import styles from "./Credibility.module.css";

const CARDS = [
  {
    title: "Nielsen's 10 Heuristics",
    lines: ["#1 Visibility of status", "#5 Error prevention", "#9 Help users recover"],
  },
  {
    title: "WCAG 2.2 · A / AA",
    lines: ["1.4.3 Contrast", "2.4.7 Focus visible", "3.3.1 Error identification"],
  },
  {
    title: "Laws of UX",
    lines: ["Hick's · Fitts's", "Jakob's · Miller's", "Proximity · Familiarity"],
  },
];

export default function Credibility() {
  return (
    <section className={styles.section} data-screen-label="Credibility">
      <div className={styles.inner}>
        <div className={styles.intro} data-reveal>
          <div className={styles.eyebrow}>Credibility</div>
          <h2 className={styles.title}>
            The roast is savage. The citations are not.
          </h2>
        </div>
        <div className={styles.grid} data-reveal>
          {CARDS.map((card) => (
            <div key={card.title} className={styles.card}>
              <div className={styles.cardTitle}>{card.title}</div>
              <div className={styles.cardLines}>
                {card.lines.map((line, i) => (
                  <span key={line}>
                    {line}
                    {i < card.lines.length - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <div className={styles.stat}>
            <div className={styles.statNum}>100%</div>
            <div className={styles.statBody}>
              of findings cite a named, checkable rule. Argue with the agent,
              not us.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
