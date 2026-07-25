import type { Metadata } from "next";
import Link from "next/link";
import BlogNav from "../components/blog/BlogNav";
import Footer from "../components/Footer";
import { SCANS, SERIES_NAME, SERIES_TAGLINE } from "../scans/scans";
import styles from "../components/scan/Scan.module.css";

const SITE_URL = "https://clapback.run";

export const metadata: Metadata = {
  title: `${SERIES_NAME} · Real checkouts, walked end to end and counted`,
  description:
    "ClapBack Scans: we walk one real product's checkout from first click to payment, map it as a graph, and count every upsell, re-ask and pre-ticked box. Dated screenshots, stated method.",
  alternates: { canonical: "/scan" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/scan`,
    siteName: "ClapBack",
    title: `${SERIES_NAME} · ClapBack Research`,
    description: SERIES_TAGLINE,
  },
};

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function ScanIndex() {
  const scans = [...SCANS].sort((a, b) => b.number - a.number);

  return (
    <div className={styles.page}>
      <BlogNav />
      <main>
        <header className={styles.indexHeader}>
          <p className={styles.eyebrow}>ClapBack Research</p>
          <h1 className={styles.indexTitle}>
            Scans<span className={styles.indexAccent}>.</span>
          </h1>
          <p className={styles.indexLede}>{SERIES_TAGLINE}</p>
        </header>

        <div className={styles.indexGrid}>
          {scans.map((s) => (
            <Link key={s.slug} href={`/scan/${s.slug}`} className={styles.indexCard}>
              <div className={styles.indexCardTop}>
                No. {String(s.number).padStart(3, "0")} · {s.host} ·{" "}
                {formatDate(s.scanDate)}
              </div>
              <div className={styles.indexCardTitle}>{s.h1}</div>
              <div className={styles.indexCardExcerpt}>{s.excerpt}</div>
              <div className={styles.indexCardMeta}>
                {s.chips.map((c) => (
                  <span key={c} className={styles.chip}>
                    {c}
                  </span>
                ))}
                <span className={styles.chip}>{s.readingMinutes} min read</span>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.indexNext}>
          <div className={styles.teaser}>
            <p className={styles.boxLabel}>Next scan · No. 002</p>
            <p className={styles.teaserTitle}>
              Planet Fitness: two minutes to join, one certified letter to leave
            </p>
            <p className={styles.teaserBody}>
              We map the signup flow against the cancellation flow as a single
              graph. The asymmetry is the whole story. In the meantime, the
              agent that does this for a living can{" "}
              <Link href="/#start">walk your funnel instead</Link>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
