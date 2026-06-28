import styles from "./TrustStrip.module.css";

const SOURCES = [
  "Nielsen Norman",
  "WCAG 2.2",
  "Laws of UX",
  "Fitts · Hick · Jakob · Miller",
];

export default function TrustStrip() {
  return (
    <div className={styles.strip}>
      <span className={styles.eyebrow}>Cites the receipts from</span>
      {SOURCES.map((name, i) => (
        <span key={name} style={{ display: "contents" }}>
          <span className={styles.name}>{name}</span>
          {i < SOURCES.length - 1 && <span className={styles.sep}>·</span>}
        </span>
      ))}
    </div>
  );
}
