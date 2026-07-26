"use client";

import { useEffect, useState } from "react";
import { FINAL_URL_FIELD, urlFieldProps } from "./urlField";
import styles from "./FinalCta.module.css";

type Props = {
  url: string;
  onUrlChange: (value: string) => void;
  onSubmit: () => void;
  // A roast is already running. The button still works — it reopens that roast
  // — but it must stop promising a new one it is not going to start.
  busy?: boolean;
  // This CTA was pressed with the box empty. A count, not a flag, so pressing
  // again re-runs the effect. Same deal as Hero.
  nudge?: number;
};

const NUDGE_HOLD = 5200;

export default function FinalCta({
  url,
  onUrlChange,
  onSubmit,
  busy = false,
  nudge = 0,
}: Props) {
  const [asking, setAsking] = useState(false);
  useEffect(() => {
    if (!nudge) return;
    setAsking(true);
    const t = setTimeout(() => setAsking(false), NUDGE_HOLD);
    return () => clearTimeout(t);
  }, [nudge]);

  return (
    <section id="start" className={styles.section} data-screen-label="Final CTA">
      <div data-reveal>
        <h2 className={styles.title}>
          Find out what your
          <br />
          users won&rsquo;t tell you.
        </h2>
        <div className={styles.form}>
          <div className={`${styles.field} ${asking ? styles.fieldAsking : ""}`}>
            <span className={styles.scheme}>https://</span>
            <input
              id={FINAL_URL_FIELD}
              className={styles.input}
              placeholder="your-app.com"
              aria-label="Your site URL"
              {...urlFieldProps(url, onUrlChange, onSubmit)}
            />
          </div>
          <button className={styles.submit} onClick={() => onSubmit()}>
            {busy ? "Watch the roast →" : "Get my free roast →"}
          </button>
        </div>
        <div className={`${styles.hint} ${asking ? styles.hintAsking : ""}`}>
          {asking
            ? "Needs a site to roast. Drop a URL in here and it goes to work."
            : busy
              ? "One roast at a time. Yours is still running."
              : "Roast your own site or a competitor’s · no card required"}
        </div>
      </div>
    </section>
  );
}
