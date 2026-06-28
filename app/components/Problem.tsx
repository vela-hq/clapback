import styles from "./Problem.module.css";

const POINTS = [
  {
    title: "Answers in minutes",
    body: "Paste a URL and get a ranked report back before your coffee's cold. No recruiting, no scheduling.",
  },
  {
    title: "Priced like lunch",
    body: "Pro-grade heuristics from $49, expense it without a meeting. Pay once, no retainer.",
  },
  {
    title: "A fresh set of eyes",
    body: "The agent has never seen your product, so it hits every rough edge you've gone blind to.",
  },
];

export default function Problem() {
  return (
    <section className={styles.section} data-screen-label="Why ClapBack">
      <div className={styles.intro} data-reveal>
        <div className={styles.eyebrow}>Why ClapBack</div>
        <h2 className={styles.title}>
          A senior-level UX audit, back before your next standup.
        </h2>
        <p className={styles.lede}>
          Same frameworks the pros use, the same fresh perspective real users
          bring, delivered as a fix list you can ship today.
        </p>
      </div>

      <div className={styles.grid} data-reveal>
        {POINTS.map((point) => (
          <div key={point.title} className={styles.card}>
            <div className={styles.cardTitle}>{point.title}</div>
            <div className={styles.cardBody}>{point.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
