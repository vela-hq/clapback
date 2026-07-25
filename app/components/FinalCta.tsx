import { urlFieldProps } from "./urlField";
import styles from "./FinalCta.module.css";

type Props = {
  url: string;
  onUrlChange: (value: string) => void;
  onSubmit: () => void;
  // A roast is already running. The button still works — it reopens that roast
  // — but it must stop promising a new one it is not going to start.
  busy?: boolean;
};

export default function FinalCta({ url, onUrlChange, onSubmit, busy = false }: Props) {
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
              placeholder="your-app.com"
              aria-label="Your site URL"
              {...urlFieldProps(url, onUrlChange, onSubmit)}
            />
          </div>
          <button className={styles.submit} onClick={onSubmit}>
            {busy ? "Watch the roast →" : "Get my free roast →"}
          </button>
        </div>
        <div className={styles.hint}>
          {busy
            ? "One roast at a time. Yours is still running."
            : "Roast your own site or a competitor’s · no card required"}
        </div>
      </div>
    </section>
  );
}
