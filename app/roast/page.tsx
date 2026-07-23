import type { Metadata } from "next";
import Link from "next/link";
import BlogNav from "../components/blog/BlogNav";
import Footer from "../components/Footer";
import { VERTICALS, ROAST_HUB } from "./verticals";
import styles from "./Roast.module.css";

const SITE_URL = "https://clapback.run";

export const metadata: Metadata = {
  title: ROAST_HUB.title,
  description: ROAST_HUB.description,
  alternates: { canonical: "/roast" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/roast`,
    siteName: "ClapBack",
    title: ROAST_HUB.title,
    description: ROAST_HUB.description,
  },
};

export default function RoastHub() {
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: VERTICALS.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: v.h1,
      url: `${SITE_URL}/roast/${v.slug}`,
    })),
  };

  return (
    <div className={styles.page}>
      <BlogNav />

      <header className={styles.hubHeader}>
        <div className={styles.eyebrow}>Free AI UX roasts</div>
        <h1 className={styles.h1}>Roast my&nbsp;___</h1>
        <p className={styles.lede}>{ROAST_HUB.tagline}</p>
      </header>

      <main className={styles.hubGrid}>
        {VERTICALS.map((v) => (
          <Link className={styles.hubCard} href={`/roast/${v.slug}`} key={v.slug}>
            <div className={styles.hubCardTitle}>{v.h1}</div>
            <div className={styles.hubCardBody}>{v.lede}</div>
            <div className={styles.hubCardGo}>Get the free roast →</div>
          </Link>
        ))}
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
    </div>
  );
}
