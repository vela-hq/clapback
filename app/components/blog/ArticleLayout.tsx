import Link from "next/link";
import type { ReactNode } from "react";
import { ARTICLES, type ArticleMeta } from "../../blog/articles";
import BlogNav from "./BlogNav";
import Footer from "../Footer";
import styles from "./Article.module.css";

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

export default function ArticleLayout({
  meta,
  children,
}: {
  meta: ArticleMeta;
  children: ReactNode;
}) {
  const related = meta.related
    .map((slug) => ARTICLES.find((a) => a.slug === slug))
    .filter((a): a is ArticleMeta => Boolean(a));

  return (
    <div className={styles.page}>
      <BlogNav />

      <main>
      <header className={styles.header}>
        <div className={styles.eyebrow}>
          <span>{meta.category}</span>
          <span className={styles.eyebrowSep}>·</span>
          <span className={styles.eyebrowMuted}>{meta.readingMinutes} min read</span>
        </div>
        <h1 className={styles.title}>{meta.h1}</h1>
        <p className={styles.standfirst}>{meta.excerpt}</p>
        <div className={styles.byline}>
          <span className={styles.bylineMark}>
            <BurstMark />
          </span>
          <span>
            <span className={styles.bylineStrong}>ClapBack Research</span>
            {" · "}
            {formatDate(meta.datePublished)}
            {meta.dateModified !== meta.datePublished && (
              <> · updated {formatDate(meta.dateModified)}</>
            )}
          </span>
        </div>
      </header>

      <article className={styles.body}>{children}</article>

      {meta.faq && meta.faq.length > 0 && (
        <section className={styles.body} style={{ paddingTop: 0 }}>
          <div className={styles.faq}>
            <h2 style={{ marginTop: 0 }}>Questions people actually ask</h2>
            {meta.faq.map((item) => (
              <div key={item.q} className={styles.faqItem}>
                <div className={styles.faqQ}>{item.q}</div>
                <div className={styles.faqA}>{item.a}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className={styles.cta}>
        <div className={styles.ctaBox}>
          <h2 className={styles.ctaTitle}>Reading about UX debt is the slow way.</h2>
          <p className={styles.ctaBody}>
            Paste your URL and an AI agent will use your product like a real
            user, find what breaks, and hand you the tickets. From $49, no
            install, no retainer.
          </p>
          <Link href="/#start" className={styles.ctaButton}>
            Get my free roast →
          </Link>
          <div className={styles.ctaHint}>
            Your site or a competitor&rsquo;s. We won&rsquo;t tell.
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className={styles.related}>
          <div className={styles.relatedLabel}>Keep reading</div>
          <div className={styles.relatedGrid}>
            {related.map((r) => (
              <Link key={r.slug} href={`/blog/${r.slug}`} className={styles.relatedCard}>
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
