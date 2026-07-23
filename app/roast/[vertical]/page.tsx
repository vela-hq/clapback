import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import BlogNav from "../../components/blog/BlogNav";
import Footer from "../../components/Footer";
import RoastLauncher from "../RoastLauncher";
import { VERTICALS, getVertical } from "../verticals";
import styles from "../Roast.module.css";

const SITE_URL = "https://clapback.run";

export function generateStaticParams() {
  return VERTICALS.map((v) => ({ vertical: v.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vertical: string }>;
}): Promise<Metadata> {
  const { vertical } = await params;
  const v = getVertical(vertical);
  if (!v) return {};
  const url = `${SITE_URL}/roast/${v.slug}`;
  return {
    title: v.title,
    description: v.description,
    alternates: { canonical: `/roast/${v.slug}` },
    openGraph: {
      type: "website",
      url,
      siteName: "ClapBack",
      title: v.title,
      description: v.description,
    },
    twitter: {
      card: "summary_large_image",
      title: v.title,
      description: v.description,
    },
  };
}

export default async function VerticalPage({
  params,
}: {
  params: Promise<{ vertical: string }>;
}) {
  const { vertical } = await params;
  const v = getVertical(vertical);
  if (!v) notFound();

  const pageUrl = `${SITE_URL}/roast/${v.slug}`;

  const appLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `ClapBack: Roast My ${v.noun[0].toUpperCase()}${v.noun.slice(1)}`,
    url: pageUrl,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description: v.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: `Free ${v.noun} UX roast`,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClapBack", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Roast", item: `${SITE_URL}/roast` },
      { "@type": "ListItem", position: 3, name: v.h1, item: pageUrl },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: v.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className={styles.page}>
      <BlogNav />

      <main>
      <section className={styles.hero}>
        <div className={styles.eyebrow}>Free AI UX roast</div>
        <h1 className={styles.h1}>{v.h1}</h1>
        <p className={styles.lede}>{v.lede}</p>
        <RoastLauncher placeholder={v.placeholder} />
      </section>

      <div className={styles.intro}>
        {v.intro.map((p, i) => (
          <p className={styles.introP} key={i}>
            {p}
          </p>
        ))}
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{v.checksTitle}</h2>
        <div className={styles.checks}>
          {v.checks.map((c) => (
            <div className={styles.check} key={c.label}>
              <div className={styles.checkRule}>{c.rule}</div>
              <div className={styles.checkLabel}>{c.label}</div>
              <div className={styles.checkBody}>{c.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.faq}>
        <h2 className={styles.sectionTitle}>Questions</h2>
        {v.faq.map((f) => (
          <div className={styles.faqItem} key={f.q}>
            <div className={styles.faqQ}>{f.q}</div>
            <div className={styles.faqA}>{f.a}</div>
          </div>
        ))}
      </section>

      <nav className={styles.related} aria-label="Other roasts">
        {v.related.map((slug) => {
          const r = getVertical(slug);
          if (!r) return null;
          return (
            <Link className={styles.relatedLink} href={`/roast/${r.slug}`} key={slug}>
              Roast my {r.noun} →
            </Link>
          );
        })}
        <Link className={styles.relatedLink} href="/roast">
          All roasts →
        </Link>
        <Link className={styles.relatedLink} href="/blog">
          The Receipts blog →
        </Link>
      </nav>

      <section className={styles.finalCta}>
        <h2 className={styles.sectionTitle}>Ready for the receipts?</h2>
        <RoastLauncher placeholder={v.placeholder} />
      </section>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </div>
  );
}
