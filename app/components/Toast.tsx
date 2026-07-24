import styles from "./Toast.module.css";

type Props = {
  message: string | null;
  actionLabel?: string;
  onAction?: () => void;
};

export default function Toast({ message, actionLabel, onAction }: Props) {
  if (!message) return null;
  return (
    <div className={styles.toast} role="status">
      {message}
      {actionLabel && onAction && (
        <button className={styles.action} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
