import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span>✦</span>
          </div>
          <span className={styles.wordmark}>ClapBack</span>
          <span className={styles.tagline}>The roast has receipts.</span>
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
