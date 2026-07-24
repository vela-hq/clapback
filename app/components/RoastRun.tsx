"use client";

import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import styles from "./RoastRun.module.css";
import {
  EFFORT_STYLE,
  EMPTY_SITE_CONTEXT,
  joinSurfaces,
  SEV_STYLE,
  severityTally,
  type RoastFinding,
  type RoastResult,
  type RoastShots,
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
// How long each quip holds, and how long the cross-fade between two of them
// takes. QUIP_FADE_MS must match the .quip transition duration in the CSS —
// the swap happens when the fade-out is done, so a mismatch shows the cut.
const QUIP_HOLD_MS = 3600;
const QUIP_FADE_MS = 420;

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
  // Guards the abandonment event so a close-then-unload (or a double pagehide)
  // can't fire it twice for one run.
  const abandonTracked = useRef(false);
  // Machine-readable failure class, set where the error is actually known (HTTP
  // code, timeout flag) and read later by the shown-tracking effect, which only
  // sees the flattened RoastResult.
  const errorReasonRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  // Bumping this re-runs the fetch effect — that is the whole retry mechanism.
  const [attempt, setAttempt] = useState(0);
  // The quip is cross-faded, so it can't be derived straight from `elapsed`:
  // the visible text has to lag the index by one fade-out. `quipVisible` drives
  // the opacity, `quipIndex` is what we're heading towards.
  const [quipIndex, setQuipIndex] = useState(0);
  const [quipVisible, setQuipVisible] = useState(true);

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
  // Images arrive once, keyed by id, however many findings cite them.
  const shots: RoastShots = result?.status === "findings" ? result.shots : {};
  const tally = severityTally(findings);
  // What Cooper saw but didn't test — the hook the upsell copy is built on.
  // Empty (old Cooper, dropped fields) falls back to the generic lines.
  const site =
    result?.status === "findings" || result?.status === "clean"
      ? result.site
      : EMPTY_SITE_CONTEXT;
  const surfacesProse = joinSurfaces(site.untestedSurfaces); // "" when none

  const handleClose = useCallback(() => {
    // Closing while the scan is still running is a give-up-waiting signal, not a
    // normal dismissal — track it as abandonment (with how long they waited) so
    // wait-time churn is a first-class number, not a gap in the funnel.
    if (result === null) {
      if (!abandonTracked.current) {
        abandonTracked.current = true;
        track("roast_demo_abandoned", {
          url: cleanUrl,
          elapsed_ms: Math.round(Date.now() - startRef.current),
          via: "close",
        });
      }
    } else {
      track("roast_demo_closed", { url: cleanUrl });
    }
    onClose();
  }, [cleanUrl, onClose, result]);

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
    setQuipIndex(0);
    setQuipVisible(true);
    shownTracked.current = false;
    abandonTracked.current = false;
    errorReasonRef.current = null;

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
        if (data?.status) {
          // The body always carries a status; the HTTP code is what separates
          // the ways an "error" status happened. Recorded here so the shown
          // event can tell "user typed junk" from "Cooper is down".
          if (data.status === "error") {
            errorReasonRef.current =
              res.status === 400
                ? "invalid_url"
                : res.status === 504
                  ? "server_timeout"
                  : res.status === 502
                    ? "cooper_crash"
                    : res.status === 500
                      ? "not_configured"
                      : "server_error";
          }
          setResult(data);
        } else {
          errorReasonRef.current = "empty_body";
          setResult({ status: "error", message: "The roast came back empty. Try again." });
        }
      } catch {
        if (controller.signal.aborted && !timedOut) return; // closed, not failed
        errorReasonRef.current = timedOut ? "client_timeout" : "unreachable";
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

  // Closing the tab or navigating away mid-scan otherwise leaves no trace — the
  // user just disappears from the funnel. Fire a best-effort abandonment on the
  // way out; sendBeacon survives the unload where a normal XHR would be killed.
  useEffect(() => {
    if (!open || !scanning) return;
    const onPageHide = () => {
      if (abandonTracked.current) return;
      abandonTracked.current = true;
      track(
        "roast_demo_abandoned",
        {
          url: cleanUrl,
          elapsed_ms: Math.round(Date.now() - startRef.current),
          via: "pagehide",
        },
        { transport: "sendBeacon", send_immediately: true },
      );
    };
    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, [open, scanning, cleanUrl]);

  // Rotate the quips as a cross-fade rather than a swap: fade the current line
  // out, change the text only once it is invisible, fade the next one in. The
  // text node itself is never remounted — a remount would restart the element
  // with its final opacity and the transition would never play.
  useEffect(() => {
    if (!open || !scanning) return;
    let swap: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      setQuipVisible(false);
      swap = setTimeout(() => {
        setQuipIndex((n) => n + 1);
        setQuipVisible(true);
      }, QUIP_FADE_MS);
    }, QUIP_HOLD_MS);
    return () => {
      clearInterval(id);
      clearTimeout(swap);
    };
  }, [open, scanning]);

  // Fire "results shown" exactly once per run, whatever the verdict was.
  useEffect(() => {
    if (!open || !result || shownTracked.current) return;
    shownTracked.current = true;
    track("roast_demo_shown", {
      url: cleanUrl,
      status: result.status,
      findings: result.status === "findings" ? result.findings.length : 0,
      // The wall-clock wait the user actually sat through — this is the number
      // wait-time churn is about. A findings/clean verdict also reports the
      // agent's own measured time; error/cannot_review carry none.
      duration_ms: Math.round(Date.now() - startRef.current),
      agent_ms:
        result.status === "findings" || result.status === "clean" ? result.durationMs : null,
      // Only set on the error path: distinguishes a slow timeout from a Cooper
      // crash from a junk URL. null everywhere else keeps the property present.
      error_reason: result.status === "error" ? errorReasonRef.current : null,
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
  const quip = QUIPS[quipIndex % QUIPS.length];

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

  // site_type / surfaces ride the upsell events so click-through can be read
  // per site kind and per "how personalized was the pitch" in Mixpanel.
  const openUpsell = () => {
    setUpsellOpen(true);
    track("roast_upsell_opened", {
      url: cleanUrl,
      site_type: site.siteType,
      surfaces: site.untestedSurfaces.length,
      surfaces_list: site.untestedSurfaces.join(", ") || null,
    });
  };

  const handleUpsellPay = () => {
    track("roast_upsell_clicked", {
      url: cleanUrl,
      price: PRICE,
      site_type: site.siteType,
      surfaces: site.untestedSurfaces.length,
      surfaces_list: site.untestedSurfaces.join(", ") || null,
    });
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
          {/* Same burst mark as the nav / favicon — the topbar is already ink,
              so the mark sits straight on it without the rounded tile. */}
          <svg
            className={styles.star}
            width="17"
            height="17"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <g transform="translate(11 0) skewX(-13)">
              <polygon
                points="50.0,4.0 57.7,31.5 82.5,17.5 68.5,42.3 96.0,50.0 68.5,57.7 82.5,82.5 57.7,68.5 50.0,96.0 42.3,68.5 17.5,82.5 31.5,57.7 4.0,50.0 31.5,42.3 17.5,17.5 42.3,31.5"
                fill="var(--accent)"
              />
            </g>
          </svg>
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
              <div
                className={`${styles.quip} ${quipVisible ? "" : styles.quipHidden}`}
              >
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
                {surfacesProse
                  ? `The agent went looking for broken UX on ${cleanUrl} and came back ` +
                    `empty-handed. Genuinely rare. But it only saw the homepage. Your ` +
                    `${surfacesProse} went untested.`
                  : `The agent went looking for broken UX on ${cleanUrl} and came back ` +
                    `empty-handed. Genuinely rare. Take the win.`}
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
                          {f.shot && shots[f.shot] && (
                            // eslint-disable-next-line @next/next/no-img-element --
                            // next/image optimizes remote URLs; this is an inline
                            // data: URI that is already exactly what we want to show.
                            <img
                              className={styles.shot}
                              src={shots[f.shot]}
                              alt={`Screenshot of the problem: ${f.title}`}
                            />
                          )}
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
                  {surfacesProse
                    ? `It never touched your ${surfacesProse}. The full roast does.`
                    : "The full roast crawls every page and tests every flow."}
                </div>
                <button className={styles.ctaButton} onClick={openUpsell}>
                  Roast the whole site
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
                <div className={styles.upsellTitle}>The full roast</div>
                <div className={styles.upsellLede}>
                  The mini roast only skims your homepage. The full roast:
                </div>
              </div>
              <div className={styles.upsellList}>
                {[
                  "crawls every page, not just the homepage",
                  // The one personalized line: name the surfaces Cooper itself
                  // saw and skipped, so the pitch is about THEIR site.
                  surfacesProse
                    ? `clicks through your ${joinSurfaces(site.untestedSurfaces, "and")}`
                    : "clicks through flows, forms and dead ends",
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
                Pay {PRICE} · start the full roast
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
