import Mockup from "./Mockup";
import styles from "./Hero.module.css";

type HeroProps = {
  url: string;
  onUrlChange: (value: string) => void;
  onSubmit: () => void;
  foundIssues: number;
};

export default function Hero({ url, onUrlChange, onSubmit, foundIssues }: HeroProps) {
  const urlDisplay = url.trim() ? url.replace(/^https?:\/\//, "") : "your-app.com";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSubmit();
  };

  return (
    <section className={styles.hero} data-screen-label="Hero">
      <div className={styles.copy}>
        <h1 className={styles.title}>
          Your UX sucks.
          <br />
          <span className={styles.accent}>Here&rsquo;s the receipts.</span>
        </h1>
        <p className={styles.lede}>
          An AI agent uses your product like a real user, roasts everything that
          sucks, and turns it into Jira tickets you can ship. Not vibes,{" "}
          <em>actual UX research.</em>
        </p>

        <div className={styles.form}>
          <div className={styles.field}>
            <span className={styles.scheme}>https://</span>
            <input
              className={styles.input}
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="your-app.com"
              aria-label="Your site URL"
            />
          </div>
          <button className={styles.submit} onClick={onSubmit}>
            Get my free roast →
          </button>
        </div>

        <div className={styles.hint}>
          Paste your own site, or a competitor you love to hate. We won&rsquo;t tell.
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.window}>
          <div className={styles.windowBar}>
            <span className={styles.dots}>
              <span />
              <span />
              <span />
            </span>
            <span className={styles.urlPill}>{urlDisplay}</span>
          </div>

          <div className={styles.windowBody}>
            <div className={styles.findingMeta}>
              <span className={styles.label}>Example finding · 1 of {foundIssues}</span>
              <span className={styles.count}>{foundIssues} found</span>
            </div>
            <div className={styles.card}>
              <div className={styles.shot}>
                <Mockup shot="signup-error" />
                <span className={styles.annotation} />
                <span className={styles.pin}>1</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.tags}>
                  <span className={styles.sev}>Blocker</span>
                  <span className={styles.cat}>Forms</span>
                  <span className={styles.rule}>Nielsen #9</span>
                </div>
                <div className={styles.cardTitle}>
                  Creating an account is a guessing game
                </div>
                <div className={styles.cardWhy}>
                  The form never states its requirements up front. People guess,
                  get bounced by a vague error, and quit before they ever learn
                  what they did wrong.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
