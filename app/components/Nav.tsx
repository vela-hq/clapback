import styles from "./Nav.module.css";

export default function Nav({ onGetRoast }: { onGetRoast: () => void }) {
  return (
    <header className={styles.header}>
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
