import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
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
          <span className={styles.tagline}>The roast has receipts.</span>
          <a className={styles.navLink} href="/blog">
            Receipts, the blog
          </a>
        </div>
        <div className={styles.legal}>
          Not affiliated with any audit consultancy.
          <br />
          We punch at products, never at the people who built them.
        </div>
      </div>
    </footer>
  );
}
