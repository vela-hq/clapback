import { CSSProperties } from "react";
import { EFFORT_STYLE, FINDINGS, SEVERITY_STYLE } from "../data/findings";
import styles from "./Backlog.module.css";

type Props = {
  onExportAll: (tool: string) => void;
};

export default function Backlog({ onExportAll }: Props) {
  return (
    <section id="backlog" className={styles.section} data-screen-label="Triage backlog">
      <div className={styles.intro} data-reveal>
        <div className={styles.eyebrow}>The wedge</div>
        <h2 className={styles.title}>Your UX backlog, already organized.</h2>
        <p className={styles.lede}>
          Other tools hand you a list and walk away. ClapBack writes the whole
          ticket — severity, evidence and a concrete fix — then bulk-exports to
          Jira or Linear, where your team actually triages.
        </p>
      </div>

      <div className={styles.body} data-reveal>
        <div className={styles.bulkBar}>
          <div className={styles.bulkMeta}>
            <span className={styles.bulkCount}>{FINDINGS.length} findings</span>
            <span className={styles.bulkSub}>in this report · sorted by severity</span>
          </div>
          <div className={styles.bulkActions}>
            <button
              className={styles.bulkJira}
              onClick={() => onExportAll("Jira")}
            >
              ↗ Export all to Jira
            </button>
            <button
              className={styles.bulkLinear}
              onClick={() => onExportAll("Linear")}
            >
              ↗ Linear
            </button>
          </div>
        </div>

        <div className={styles.list}>
          {FINDINGS.map((f) => {
            const sev = SEVERITY_STYLE[f.sev];
            const effort = EFFORT_STYLE[f.effort];
            return (
              <div key={f.title} className={styles.card}>
                <div className={styles.cardHead}>
                  <div className={styles.cardMain}>
                    <div className={styles.tags}>
                      <span
                        className={styles.sev}
                        style={
                          {
                            color: sev.fg,
                            background: sev.bg,
                            border: sev.border,
                          } as CSSProperties
                        }
                      >
                        {f.sev}
                      </span>
                      <span className={styles.cat}>{f.cat}</span>
                      <span className={styles.rule}>{f.rule}</span>
                    </div>
                    <div className={styles.cardTitle}>{f.title}</div>
                  </div>
                </div>
                <div className={styles.why}>{f.why}</div>
                <div className={styles.fixBox}>
                  <div className={styles.fixLabel}>Suggested fix</div>
                  <div className={styles.fixText}>{f.fix}</div>
                  <div
                    className={styles.effort}
                    style={{ color: effort.fg, background: effort.bg }}
                  >
                    {effort.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
