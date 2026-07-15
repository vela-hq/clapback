"use client";

import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import styles from "./RoastRun.module.css";
import {
  REDDIT_FINDINGS,
  REDDIT_SEV_STYLE,
  REDDIT_EFFORT_STYLE,
  severityTally,
} from "../data/redditFindings";
import { track } from "@/lib/analytics";

type RoastRunProps = {
  open: boolean;
  url: string;
  // Converts the "get the full roast" upsell into the real waitlist flow.
  onGetFullRoast: () => void;
  onClose: () => void;
};

// The mini roast is deliberately staged: we fake a fixed 12-second scan, then
// drop all findings at once ("results land all at once"). Not a real crawl —
// a scripted demo for reddit.com.
const SCAN_MS = 12_000;
const PRICE = "$49";
const SPIN = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";
const QUIPS = [
  "It reads your homepage the way a stranger would. Strangers are not kind.",
  "No fake progress bar. It’s done when it’s done.",
  "Every claim it makes cites a law of UX. No vibes.",
  "It roasts in private. You get the verdict, not the play by play.",
];

const SEV_DOT: Record<string, string> = {
  Blocker: "var(--accent)",
  Major: "var(--yellow)",
  Minor: "#cfc8ba",
};

function formatElapsed(ms: number): string {
  const s = Math.min(SCAN_MS, Math.max(0, ms)) / 1000;
  const whole = Math.floor(s);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

export default function RoastRun({ open, url, onGetFullRoast, onClose }: RoastRunProps) {
  // Wall-clock elapsed since the run began, ticked on an interval. `startRef`
  // is the source of truth so replay just resets it.
  const startRef = useRef<number>(0);
  const [elapsed, setElapsed] = useState(0);
  const [selected, setSelected] = useState(0);
  const [upsellOpen, setUpsellOpen] = useState(false);
  const shownTracked = useRef(false);

  const cleanUrl = url.trim().replace(/^https?:\/\//, "") || "reddit.com";
  const scanning = elapsed < SCAN_MS;
  const findings = REDDIT_FINDINGS;
  const tally = severityTally(findings);

  const beginRun = useCallback(() => {
    startRef.current = Date.now();
    setElapsed(0);
    setSelected(0);
    setUpsellOpen(false);
    shownTracked.current = false;
  }, []);

  // User-initiated dismissal (backdrop, Escape, close button). Distinct from the
  // "pay" path, which converts into the waitlist rather than closing.
  const handleClose = useCallback(() => {
    track("roast_demo_closed", { url: cleanUrl });
    onClose();
  }, [cleanUrl, onClose]);

  // Kick off (and restart, on reopen) the run whenever the overlay opens.
  useEffect(() => {
    if (!open) return;
    beginRun();
    track("roast_demo_started", { url: cleanUrl });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Drive the clock while open. A ~120ms tick keeps the spinner and timer lively
  // without thrashing. Stops the moment the scan completes.
  useEffect(() => {
    if (!open || !scanning) return;
    const id = setInterval(() => {
      setElapsed(Date.now() - startRef.current);
    }, 120);
    return () => clearInterval(id);
  }, [open, scanning]);

  // Fire the "results shown" event exactly once per run, when the scan lands.
  useEffect(() => {
    if (open && !scanning && !shownTracked.current) {
      shownTracked.current = true;
      track("roast_demo_shown", { url: cleanUrl, findings: findings.length });
    }
  }, [open, scanning, cleanUrl, findings.length]);

  // Lock the page behind the overlay so the landing doesn't scroll underneath.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape closes the whole overlay.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (upsellOpen) setUpsellOpen(false);
        else handleClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, upsellOpen, handleClose]);

  if (!open) return null;

  const elapsedLabel = scanning ? formatElapsed(elapsed) : formatElapsed(SCAN_MS);
  const spinChar = SPIN[Math.floor(elapsed / 90) % SPIN.length];
  const quip = QUIPS[Math.floor(elapsed / 3000) % QUIPS.length];

  // Only an expand (not a collapse) counts as engagement worth recording.
  const toggleFinding = (i: number) => {
    const willExpand = selected !== i;
    setSelected(willExpand ? i : -1);
    if (willExpand) {
      track("roast_finding_expanded", {
        url: cleanUrl,
        law: findings[i].law,
        sev: findings[i].sev,
        position: i + 1,
      });
    }
  };

  const openUpsell = () => {
    setUpsellOpen(true);
    track("roast_upsell_opened", { url: cleanUrl });
  };

  const handleUpsellPay = () => {
    track("roast_upsell_clicked", { url: cleanUrl, price: PRICE });
    onGetFullRoast();
  };

  return (
    <div
      className={styles.overlay}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="ClapBack mini roast"
    >
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        {/* Browser-chrome top bar */}
        <div className={styles.topbar}>
          <span className={styles.star}>✦</span>
          <span className={styles.brand}>ClapBack</span>
          <span className={styles.urlPill}>{cleanUrl}</span>
          <span className={styles.miniBadge}>MINI ROAST · free</span>
          <div className={styles.status}>
            {scanning ? (
              <>
                <span className={styles.spin}>{spinChar}</span>
                <span className={styles.statusMuted}>running · {elapsedLabel}</span>
              </>
            ) : (
              <>
                <span className={styles.check}>✓</span>
                <span className={styles.statusMuted}>done in {elapsedLabel}</span>
              </>
            )}
          </div>
        </div>

        {scanning ? (
          /* ---- Scanning ---- */
          <div className={styles.scanBody}>
            <div className={styles.timerBig}>{elapsedLabel}</div>
            <div className={styles.scanCopy}>
              <div className={styles.scanTitle}>The agent is roasting.</div>
              <div className={styles.quip} key={quip}>
                {quip}
              </div>
            </div>
            <div className={styles.privacyChip}>
              it works in private · results land all at once
            </div>
          </div>
        ) : (
          /* ---- Results ---- */
          <div className={styles.doneBody}>
            <div className={styles.doneWrap}>
              <div className={styles.resultHead}>
                <span className={styles.resultCount}>
                  {findings.length} issues in {elapsedLabel}.
                </span>
                <span className={styles.resultHint}>
                  Click a line to see why it matters and how to fix it.
                </span>
              </div>

              <div className={styles.tally}>
                <span>Laws of UX</span>
                <span aria-hidden="true">·</span>
                {tally.map((t) => (
                  <span key={t.sev}>
                    <span
                      className={styles.tallyDot}
                      style={{ background: SEV_DOT[t.sev] }}
                    />
                    {t.count} {t.sev}
                  </span>
                ))}
              </div>

              <div className={styles.list}>
                {findings.map((f, i) => {
                  const isSel = i === selected;
                  const effort = REDDIT_EFFORT_STYLE[f.effort];
                  return (
                    <div
                      key={f.title}
                      className={`${styles.finding} ${isSel ? styles.findingSel : ""}`}
                      style={{ animationDelay: `${(i * 0.08).toFixed(2)}s` }}
                      onClick={() => toggleFinding(i)}
                    >
                      <div className={styles.findingRow}>
                        <span className={styles.num}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={styles.sevChip}
                          style={REDDIT_SEV_STYLE[f.sev] as CSSProperties}
                        >
                          {f.sev.toUpperCase()}
                        </span>
                        <span className={styles.lawChip}>{f.law}</span>
                        <span className={styles.findingTitle}>{f.title}</span>
                        <span className={styles.chev}>{isSel ? "−" : "+"}</span>
                      </div>
                      {isSel && (
                        <div className={styles.detail}>
                          <div className={styles.detailText}>
                            <span className={styles.why}>{f.why}</span>
                            <div className={styles.fixBox}>
                              <span className={styles.fixLabel}>Fix → </span>
                              {f.fix}
                            </div>
                            <div className={styles.detailMeta}>
                              <span
                                className={styles.effort}
                                style={effort.style as CSSProperties}
                              >
                                {effort.label}
                              </span>
                              <a
                                className={styles.lawLink}
                                href={f.url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {f.url.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className={styles.ctaBar}>
                <div className={styles.ctaText}>
                  <span className={styles.ctaStrong}>That was the mini roast. </span>
                  The full roast crawls every page and tests every flow.
                </div>
                <button className={styles.ctaButton} onClick={openUpsell}>
                  Get the full roast
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upsell modal, scoped inside the window */}
        {upsellOpen && (
          <div className={styles.upsell} onClick={() => setUpsellOpen(false)}>
            <div className={styles.upsellCard} onClick={(e) => e.stopPropagation()}>
              <button
                className={styles.upsellClose}
                onClick={() => setUpsellOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
              <div>
                <div className={styles.upsellTitle}>Unlock the full roast</div>
                <div className={styles.upsellLede}>
                  The mini roast only skims your homepage. The full roast:
                </div>
              </div>
              <div className={styles.upsellList}>
                {[
                  "crawls every page, not just the homepage",
                  "clicks through flows, forms and dead ends",
                  "screenshots every issue with a concrete fix",
                  "exports ready-made tickets to Jira & Linear",
                ].map((line) => (
                  <div className={styles.upsellItem} key={line}>
                    <span className={styles.upsellArrow}>→</span>
                    {line}
                  </div>
                ))}
              </div>
              <div className={styles.priceRow}>
                <span className={styles.price}>{PRICE}</span>
                <span className={styles.priceNote}>one-time · no subscription</span>
              </div>
              <button className={styles.upsellPay} onClick={handleUpsellPay}>
                Pay {PRICE} — start the full roast
              </button>
              <div className={styles.upsellFine}>money back if the roast is wrong</div>
            </div>
          </div>
        )}
      </div>

      {/* Control under the window — stop clicks from bubbling to the overlay. */}
      <div className={styles.controls} onClick={(e) => e.stopPropagation()}>
        <button className={styles.controlBtn} onClick={handleClose}>
          ✕ close
        </button>
      </div>
    </div>
  );
}
