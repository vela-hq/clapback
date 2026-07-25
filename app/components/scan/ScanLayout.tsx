import Link from "next/link";
import type { ReactNode } from "react";
import { ARTICLES, type ArticleMeta } from "../../blog/articles";
import type { ScanMeta } from "../../scans/scans";
import BlogNav from "../blog/BlogNav";
import Footer from "../Footer";
import { ScanReveal, TrackedCta } from "./scan.client";
import styles from "./Scan.module.css";

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function BurstMark({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <g transform="translate(11 0) skewX(-13)">
        <polygon
          points="50.0,4.0 57.7,31.5 82.5,17.5 68.5,42.3 96.0,50.0 68.5,57.7 82.5,82.5 57.7,68.5 50.0,96.0 42.3,68.5 17.5,82.5 31.5,57.7 4.0,50.0 31.5,42.3 17.5,17.5 42.3,31.5"
          fill="var(--accent)"
        />
      </g>
    </svg>
  );
}

export default function ScanLayout({
  meta,
  children,
}: {
  meta: ScanMeta;
  children: ReactNode;
}) {
  const related = meta.relatedArticles
    .map((slug) => ARTICLES.find((a) => a.slug === slug))
    .filter((a): a is ArticleMeta => Boolean(a));

  return (
    <div className={styles.page}>
      <ScanReveal slug={meta.slug} />
      <BlogNav />

      <main>
        <header className={styles.header}>
          <p className={styles.eyebrow}>
            Product scan · No. {String(meta.number).padStart(3, "0")} ·{" "}
            {meta.host}
          </p>
          <h1 className={styles.title}>{meta.h1}</h1>
          <p className={styles.standfirst}>{meta.excerpt}</p>
          <div className={styles.byline}>
            <span className={styles.bylineMark}>
              <BurstMark />
            </span>
            <span>
              <span className={styles.bylineStrong}>ClapBack Research</span>
              {" · "}
              walked {formatDate(meta.scanDate)}
            </span>
            {meta.chips.map((c) => (
              <span key={c} className={styles.chip}>
                {c}
              </span>
            ))}
          </div>
        </header>

        {children}

        {meta.faq && meta.faq.length > 0 && (
          <div className={styles.col}>
            <div className={styles.faq}>
              <h2 className={styles.faqTitle}>Questions people actually ask</h2>
              {meta.faq.map((item) => (
                <div key={item.q} className={styles.faqItem}>
                  <div className={styles.faqQ}>{item.q}</div>
                  <div className={styles.faqA}>{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.col}>
          <div className={styles.endCta} data-reveal>
            <p className={styles.endCtaLabel}>Your funnel, same treatment</p>
            <h2 className={styles.endCtaTitle}>
              Ryanair pays people to build this. Most products ship it by
              accident.
            </h2>
            <p className={styles.endCtaBody}>
              This walk was done by hand so we could check every count. The
              product does the same thing automatically: an agent opens your
              site, uses it like a first-time customer, and comes back with the
              friction, drawn on screenshots, written as tickets. First roast is
              free.
            </p>
            <TrackedCta
              href="/#start"
              where="scan_end"
              className={styles.endCtaBtn}
            >
              Roast my funnel →
            </TrackedCta>
            <div className={styles.endCtaHint}>
              Your site or a competitor&rsquo;s. We won&rsquo;t tell.
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className={styles.related}>
            <div className={styles.relatedLabel}>Keep reading</div>
            <div className={styles.relatedGrid}>
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className={styles.relatedCard}
                >
                  <div className={styles.relatedCat}>{r.category}</div>
                  <div className={styles.relatedTitle}>{r.h1}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
