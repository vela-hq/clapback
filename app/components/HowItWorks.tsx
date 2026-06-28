import styles from "./HowItWorks.module.css";

const STEPS = [
  {
    num: "01",
    title: "Paste a URL",
    body: "No install, no SDK, no access tokens. Just the link to whatever you want roasted.",
  },
  {
    num: "02",
    title: "The agent goes in",
    body: "It signs up, clicks around, fills your forms and breaks your flows, like a real user with zero patience.",
  },
  {
    num: "03",
    title: "You get receipts",
    body: "A ranked report of every issue: cited, screenshotted, and ready to triage and ship.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className={styles.section} data-screen-label="How it works">
      <div className={styles.inner}>
        <div className={styles.intro} data-reveal>
          <div className={styles.eyebrow}>How it works</div>
          <h2 className={styles.title}>Three steps. Zero meetings.</h2>
        </div>
        <div className={styles.grid} data-reveal>
          {STEPS.map((step) => (
            <div key={step.num} className={styles.card}>
              <div className={styles.num}>{step.num}</div>
              <div className={styles.cardTitle}>{step.title}</div>
              <div className={styles.cardBody}>{step.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
