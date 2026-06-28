import styles from "./Nav.module.css";

export default function Nav({ onGetRoast }: { onGetRoast: () => void }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span>✦</span>
          </div>
          <span className={styles.wordmark}>ClapBack</span>
        </div>
        <nav className={styles.nav}>
          <a href="#how">How it works</a>
          <a href="#sample">Sample roast</a>
          <a href="#backlog">Triage</a>
          <a href="#faq">FAQ</a>
        </nav>
        <button className={styles.cta} onClick={onGetRoast}>
          Get your free roast
        </button>
      </div>
    </header>
  );
}
