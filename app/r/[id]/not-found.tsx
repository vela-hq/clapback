import Link from "next/link";
import styles from "./Report.module.css";

// Reached when loadRoast comes back empty: an id that never existed, or one
// whose run has aged out of the bucket. Those are indistinguishable from here
// and the honest answer covers both, so say the retention out loud rather than
// let someone wonder whether we lost their roast.
export default function RoastNotFound() {
  return (
    <main className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.eyebrow}>Roast not found</div>
        <h1 className={styles.title}>This one has expired</h1>
        <p className={styles.body}>
          Roasts are kept for 90 days, then they go. Either this link is past
          that, or it was never a roast in the first place.
        </p>
        <p className={styles.body}>
          The good news is that a new one takes about a minute.
        </p>
        <Link className={styles.cta} href="/">
          Roast a site
        </Link>
      </div>
    </main>
  );
}
