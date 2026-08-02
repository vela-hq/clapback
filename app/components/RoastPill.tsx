"use client";

import styles from "./RoastPill.module.css";
import type { RoastResult } from "../data/roast";
import { displayUrl } from "@/lib/url";

type RoastPillProps = {
  open: boolean;
  url: string;
  result: RoastResult | null;
  elapsed: number;
  onOpen: () => void;
};

// Same spinner alphabet as the modal — minimizing should look like the same run
// moved, not like a different thing started.
const SPIN = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";

function formatElapsed(ms: number): string {
  const whole = Math.floor(Math.max(0, ms) / 1000);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

// The minimized roast: a docked timer that keeps the run visible while the user
// goes back to reading the page. It is the only affordance saying the roast did
// not die when the overlay closed, so it has to keep counting — a static badge
// would read as a leftover.
//
// One control, and it is "open", never "stop". A run is already paid for and
// already happening by the time this appears; a kill switch sitting in the
// corner of the page can only ever be a mis-click that throws away a roast the
// user waited for. Every state resolves by opening it instead: findings go to
// the report, everything else back to the window, which is where closing for
// good lives.
export default function RoastPill({ open, url, result, elapsed, onOpen }: RoastPillProps) {
  if (!open) return null;

  const cleanUrl = displayUrl(url) || "your site";
  const scanning = result === null;
  const won = result?.status === "findings" || result?.status === "clean";

  const label = scanning
    ? `Roasting ${cleanUrl}`
    : result?.status === "findings"
      ? "Your roast is ready"
      : result?.status === "clean"
        ? "Nothing to roast"
        : result?.status === "cannot_review"
          ? "Couldn’t read the page"
          : "The roast crashed";

  const hint = scanning
    ? "still running · click to watch"
    : won
      ? "click to see it"
      : "click for details";

  // Three looks, not two. The running pill stays quiet on purpose — it is
  // company while you read the page. The landed one is the payoff and has to
  // win against whatever the user went back to doing, so it fills with brand
  // red, keeps moving, and points at itself. A failed run gets the old subdued
  // treatment: it still needs finding, but a celebration animation on "the
  // roast crashed" is the wrong invitation.
  const tone = scanning ? "" : won ? styles.pillReady : styles.pillDone;

  return (
    <div className={styles.dock} role="status" aria-live="polite">
      <button
        className={`${styles.pill} ${tone}`}
        onClick={onOpen}
        aria-label={scanning ? `Roast in progress: ${label}` : label}
      >
        {/* A light sweeping across the fill. Purely decorative, and clipped to
            the pill by its own overflow so it can ignore the padding. */}
        {won && <span className={styles.gloss} aria-hidden="true" />}
        <span className={styles.icon} aria-hidden="true">
          {scanning ? (
            <span className={styles.spin}>{SPIN[Math.floor(elapsed / 90) % SPIN.length]}</span>
          ) : won ? (
            "✓"
          ) : (
            "!"
          )}
        </span>
        <span className={styles.text}>
          <span className={styles.label}>{label}</span>
          <span className={styles.hint}>{hint}</span>
        </span>
        {scanning && <span className={styles.timer}>{formatElapsed(elapsed)}</span>}
        {won && (
          <span className={styles.go} aria-hidden="true">
            →
          </span>
        )}
      </button>
    </div>
  );
}
