import Link from "next/link";
import styles from "../Nav.module.css";

/**
 * Server-rendered variant of the landing Nav for blog pages: same look, but
 * links navigate instead of driving the waitlist modal (which lives on the
 * home page). The CTA lands on the final-CTA section of the landing page.
 */
export default function BlogNav() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} style={{ textDecoration: "none" }}>
          <div className={styles.logo}>
            <svg width="19" height="19" viewBox="0 0 100 100" aria-hidden="true">
              <g transform="translate(11 0) skewX(-13)">
                <polygon
                  points="50.0,4.0 57.7,31.5 82.5,17.5 68.5,42.3 96.0,50.0 68.5,57.7 82.5,82.5 57.7,68.5 50.0,96.0 42.3,68.5 17.5,82.5 31.5,57.7 4.0,50.0 31.5,42.3 17.5,17.5 42.3,31.5"
                  fill="var(--accent)"
                />
              </g>
            </svg>
          </div>
          <span className={styles.wordmark}>ClapBack</span>
        </Link>
        <nav className={styles.nav}>
          <Link href="/#how">How it works</Link>
          <Link href="/#sample">Sample roast</Link>
          <Link href="/blog">Receipts</Link>
          <Link href="/#faq">FAQ</Link>
        </nav>
        <Link href="/#start" className={styles.cta} style={{ textDecoration: "none", display: "inline-block" }}>
          Get your free roast
        </Link>
      </div>
    </header>
  );
}
