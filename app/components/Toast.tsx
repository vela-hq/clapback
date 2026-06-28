import styles from "./Toast.module.css";

export default function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className={styles.toast} role="status">
      <span className={styles.check}>✓</span>
      {message}
    </div>
  );
}
