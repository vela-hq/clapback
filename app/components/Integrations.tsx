import styles from "./Integrations.module.css";

const TOOLS = ["Jira", "Linear", "Slack", "GitHub", "Notion"];

export default function Integrations() {
  return (
    <section className={styles.section} data-screen-label="Integrations">
      <div className={styles.inner} data-reveal>
        <span className={styles.label}>Exports straight into</span>
        {TOOLS.map((tool) => (
          <span key={tool} className={styles.tool}>
            {tool}
          </span>
        ))}
      </div>
    </section>
  );
}
