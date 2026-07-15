"use client";

import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import styles from "./RoastRun.module.css";
import {
  EFFORT_STYLE,
  SEV_STYLE,
  severityTally,
  type RoastFinding,
  type RoastResult,
} from "../data/roast";
import { track } from "@/lib/analytics";
import { displayUrl } from "@/lib/url";
import { checkUrl } from "@/lib/urlguard";

type RoastRunProps = {
  open: boolean;
  url: string;
  // Converts the "get the full roast" upsell into the real waitlist flow.
  onGetFullRoast: () => void;
  onClose: () => void;
};

// A real Cooper run takes 30-90s, plus up to ~30s of Cloud Run cold start. Give
// up at 150s: past that the user has almost certainly left, and the honest move
// is to say so rather than spin forever. The server keeps its own, longer
// deadline — this one only decides when to stop *waiting*.
const CLIENT_TIMEOUT_MS = 150_000;
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
  const whole = Math.floor(Math.max(0, ms) / 1000);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

export default function RoastRun({ open, url, onGetFullRoast, onClose }: RoastRunProps) {
  // Wall-clock elapsed since the run began, ticked on an interval. `startRef`
  // is the source of truth so a retry is just a reset.
  const startRef = useRef<number>(0);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<RoastResult | null>(null);
  const [selected, setSelected] = useState(0);
  const [upsellOpen, setUpsellOpen] = useState(false);
  const shownTracked = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  // Bumping this re-runs the fetch effect — that is the whole retry mechanism.
  const [attempt, setAttempt] = useState(0);

  const cleanUrl = displayUrl(url) || "your site";
  // The pill links out to the site under test. Route the href through the same
  // guard the run itself passed rather than interpolating `url` straight in:
  // it is user-typed, and it reaches an href here, so "javascript:..." is only
  // ever one paste away. checkUrl hands back an http(s) URL or nothing.
  const check = checkUrl(url);
  const href = check.ok ? check.url : null;
  // The scan is over when the answer lands, not when a timer says so. This is
  // the one line that turns the staged demo into a real run.
  const scanning = result === null;
  const findings: RoastFinding[] = result?.status === "findings" ? result.findings : [];
  const tally = severityTally(findings);

  const handleClose = useCallback(() => {
    track("roast_demo_closed", { url: cleanUrl });
    onClose();
  }, [cleanUrl, onClose]);

  const retry = useCallback(() => {
    track("roast_retried", { url: cleanUrl });
    setAttempt((n) => n + 1);
  }, [cleanUrl]);

  // The run itself: one fetch per open (and per retry). Aborts on close, on
  // unmount, and on its own timeout — a roast nobody is waiting for should not
  // keep a request alive.
  useEffect(() => {
    if (!open) return;

    startRef.current = Date.now();
    setElapsed(0);
    setResult(null);
    setSelected(0);
    setUpsellOpen(false);
    shownTracked.current = false;

    const controller = new AbortController();
    abortRef.current = controller;
    // Both the timeout and an unmount abort the same controller, so the catch
    // needs this flag to tell "we gave up waiting" (show an error) from "the
    // user closed the overlay" (show nothing — the component is going away).
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, CLIENT_TIMEOUT_MS);
    track("roast_demo_started", { url: cleanUrl });

    (async () => {
      try {
        const res = await fetch("/api/roast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
          signal: controller.signal,
        });
        // The route answers with a RoastResult in the body on success AND on
        // failure, so the status code carries no information the body lacks.
        const data = (await res.json()) as RoastResult;
        setResult(
          data?.status
            ? data
            : { status: "error", message: "The roast came back empty. Try again." },
        );
      } catch {
        if (controller.signal.aborted && !timedOut) return; // closed, not failed
        setResult({
          status: "error",
          message: timedOut
            ? "The roast took too long. Try again."
            : "Couldn’t reach the roaster. Check your connection and try again.",
        });
      } finally {
        clearTimeout(timer);
      }
    })();

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
    // `url` is intentionally read at open time, not tracked: retyping behind an
    // open overlay must not silently swap the run out from under the user.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, attempt]);

  // Drive the clock while the run is in flight. ~120ms keeps the spinner lively
  // without thrashing React.
  useEffect(() => {
    if (!open || !scanning) return;
    const id = setInterval(() => {
      setElapsed(Date.now() - startRef.current);
    }, 120);
    return () => clearInterval(id);
  }, [open, scanning]);

  // Fire "results shown" exactly once per run, whatever the verdict was.
  useEffect(() => {
    if (!open || !result || shownTracked.current) return;
    shownTracked.current = true;
    track("roast_demo_shown", {
      url: cleanUrl,
      status: result.status,
      findings: result.status === "findings" ? result.findings.length : 0,
    });
  }, [open, result, cleanUrl]);

  // Lock the page behind the overlay so the landing doesn't scroll underneath.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape closes the upsell first, then the whole overlay.
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

  // The agent's own measured duration is the truthful number once it lands; the
  // ticking clock is only a stand-in while we wait.
  const serverMs =
    result && "durationMs" in result && result.durationMs ? result.durationMs : null;
  const elapsedLabel = formatElapsed(scanning ? elapsed : (serverMs ?? elapsed));
  const spinChar = SPIN[Math.floor(elapsed / 90) % SPIN.length];
  const quip = QUIPS[Math.floor(elapsed / 3000) % QUIPS.length];

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

  // Status text in the title bar: one line per outcome.
  const statusLabel = () => {
    if (scanning) return `running · ${elapsedLabel}`;
    if (result?.status === "findings") return `done in ${elapsedLabel}`;
    if (result?.status === "clean") return `done in ${elapsedLabel}`;
    if (result?.status === "cannot_review") return "couldn’t read the page";
    return "failed";
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
          {href ? (
            <a
              className={`${styles.urlPill} ${styles.urlPillLink}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={`Open ${cleanUrl} in a new tab`}
            >
              {cleanUrl}
            </a>
          ) : (
            <span className={styles.urlPill}>{cleanUrl}</span>
          )}
          <span className={styles.miniBadge}>MINI ROAST · free</span>
          <div className={styles.status}>
            {scanning ? (
              <>
                <span className={styles.spin}>{spinChar}</span>
                <span className={styles.statusMuted}>{statusLabel()}</span>
              </>
            ) : (
              <>
                <span className={styles.check}>
                  {result?.status === "findings" || result?.status === "clean" ? "✓" : "!"}
                </span>
                <span className={styles.statusMuted}>{statusLabel()}</span>
              </>
            )}
          </div>
        </div>

        {scanning && (
          /* ---- Running: a real wait, not a staged one ---- */
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
        )}

        {result?.status === "cannot_review" && (
          /* ---- Abstained: Cooper is built to say "I couldn't see it" rather
                 than invent findings. Bot walls and blank SPA shells are common,
                 so this state is expected, not an error. ---- */
          <div className={styles.scanBody}>
            <div className={styles.stateIcon}>🚧</div>
            <div className={styles.scanCopy}>
              <div className={styles.scanTitle}>We couldn’t read that page.</div>
              <div className={styles.quip}>{result.reason}</div>
            </div>
            <div className={styles.stateActions}>
              <button className={styles.ctaButton} onClick={retry}>
                Try again
              </button>
            </div>
            <div className={styles.privacyChip}>
              no findings invented · it abstains when it can’t see
            </div>
          </div>
        )}

        {result?.status === "error" && (
          <div className={styles.scanBody}>
            <div className={styles.stateIcon}>💥</div>
            <div className={styles.scanCopy}>
              <div className={styles.scanTitle}>The roast crashed.</div>
              <div className={styles.quip}>{result.message}</div>
            </div>
            <div className={styles.stateActions}>
              <button className={styles.ctaButton} onClick={retry}>
                Try again
              </button>
            </div>
          </div>
        )}

        {result?.status === "clean" && (
          /* ---- A real, positive verdict. Not a failure — say so plainly. ---- */
          <div className={styles.scanBody}>
            <div className={styles.stateIcon}>✨</div>
            <div className={styles.scanCopy}>
              <div className={styles.scanTitle}>Nothing to roast.</div>
              <div className={styles.quip}>
                The agent went looking for broken UX on {cleanUrl} and came back
                empty-handed. Genuinely rare. Take the win.
              </div>
            </div>
            <div className={styles.stateActions}>
              <button className={styles.ctaButton} onClick={openUpsell}>
                Get the full roast
              </button>
            </div>
            <div className={styles.privacyChip}>
              the mini roast only skims your homepage
            </div>
          </div>
        )}

        {result?.status === "findings" && (
          /* ---- Results ---- */
          <div className={styles.doneBody}>
            <div className={styles.doneWrap}>
              <div className={styles.resultHead}>
                <span className={styles.resultCount}>
                  {findings.length} {findings.length === 1 ? "issue" : "issues"} in{" "}
                  {elapsedLabel}.
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
                  const effort = EFFORT_STYLE[f.effort];
                  return (
                    <div
                      key={`${f.law}-${f.title}`}
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
                          style={SEV_STYLE[f.sev] as CSSProperties}
                        >
                          {f.sev.toUpperCase()}
                        </span>
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
                                Law of UX: {f.law} ↗
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
