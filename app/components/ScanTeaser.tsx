import Link from "next/link";
import { SCANS } from "../scans/scans";
import styles from "./ScanTeaser.module.css";

/**
 * Landing-page proof of depth. Every other section on this page describes what
 * the agent does; this one points at a piece of work anyone can go and check,
 * on a brand everybody has a story about. It sits after the sample finding
 * because that is where a visitor has just learned what a finding looks like
 * and is deciding whether we can actually find them.
 */
export default function ScanTeaser() {
  const scan = [...SCANS].sort((a, b) => b.number - a.number)[0];
  if (!scan) return null;

  return (
    <section className={styles.section} id="scans" data-screen-label="Scans">
      <div className={styles.inner}>
        <div className={styles.intro} data-reveal>
          <div className={styles.eyebrow}>ClapBack Research</div>
          <h2 className={styles.title}>
            We did it to Ryanair first, by hand, so you can check our work.
          </h2>
          <p className={styles.lede}>
            One booking flow, walked end to end with every upsell declined, every
            screen screenshotted and every refusal counted. This is the method
            the agent runs on your site, done slowly enough to show its working.
          </p>
        </div>

        <div className={styles.grid} data-reveal>
          <Link href={`/scan/${scan.slug}`} className={styles.card}>
            <div className={styles.cardTop}>
              Product scan · No. {String(scan.number).padStart(3, "0")} ·{" "}
              {scan.host}
            </div>
            <div className={styles.cardTitle}>{scan.h1}</div>
            <p className={styles.cardBody}>{scan.excerpt}</p>
            <div className={styles.cardGo}>Read the scan →</div>
          </Link>

          <div className={styles.stats}>
            {scan.stats.slice(0, 4).map((s) => (
              <div key={s.label} className={styles.stat}>
                <div className={styles.statNum}>{s.num}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
