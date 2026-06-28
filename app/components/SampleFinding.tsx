import Mockup from "./Mockup";
import styles from "./SampleFinding.module.css";

const CHECKS = [
  "Severity: Blocker / Major / Minor",
  "Backed by Nielsen, WCAG & Laws of UX",
  "Suggested fix + quick-win / deep-fix estimate",
  "One click → a pre-filled Jira or Linear ticket",
];

type Props = {
  onExport: (tool: string, title: string) => void;
};

const TITLE = "Six pricing tiers, chosen by nobody";

export default function SampleFinding({ onExport }: Props) {
  return (
    <section id="sample" className={styles.section} data-screen-label="Sample finding">
      <div className={styles.inner} data-reveal>
        <div className={styles.copy}>
          <div className={styles.eyebrow}>The finding card</div>
          <h2 className={styles.title}>Every roast has receipts.</h2>
          <p className={styles.lede}>
            No vibes. Each finding carries a severity, a category, a cited rule,
            an annotated screenshot, a plain-language reason it matters, and a
            fix with an effort estimate.
          </p>
          <ul className={styles.checks}>
            {CHECKS.map((check) => (
              <li key={check} className={styles.check}>
                <span className={styles.tick}>✓</span>
                {check}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.cardWrap}>
          <div className={styles.card}>
            <div className={styles.shot}>
              <Mockup shot="pricing-page" />
              <span className={styles.annotation} />
              <span className={styles.pin}>3</span>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.tags}>
                <span className={styles.sev}>Major</span>
                <span className={styles.cat}>Cognitive load</span>
                <span className={styles.rule}>Hick&rsquo;s Law</span>
              </div>
              <div className={styles.cardTitle}>{TITLE}</div>
              <p className={styles.why}>
                Six tiers with eleven feature rows each. Paradox of choice kicks
                in and people pick nothing. Your pricing page is a
                decision-paralysis machine.
              </p>
              <div className={styles.fixBox}>
                <div className={styles.fixLabel}>Suggested fix</div>
                <div className={styles.fixText}>
                  Collapse to three tiers, highlight one, push the full matrix
                  below the fold.
                </div>
                <div className={styles.effort}>⚒ Deep fix · ~2 days</div>
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.primary}
                  onClick={() => onExport("Jira", TITLE)}
                >
                  ↗ Export to Jira
                </button>
                <button
                  className={styles.secondary}
                  onClick={() => onExport("Linear", TITLE)}
                >
                  ↗ Linear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
