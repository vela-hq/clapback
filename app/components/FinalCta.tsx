import styles from "./FinalCta.module.css";

type Props = {
  url: string;
  onUrlChange: (value: string) => void;
  onSubmit: () => void;
};

export default function FinalCta({ url, onUrlChange, onSubmit }: Props) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSubmit();
  };

  return (
    <section id="start" className={styles.section} data-screen-label="Final CTA">
      <div data-reveal>
        <h2 className={styles.title}>
          Find out what your
          <br />
          users won&rsquo;t tell you.
        </h2>
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
          Roast your own site or a competitor&rsquo;s · no card required
        </div>
      </div>
    </section>
  );
}
