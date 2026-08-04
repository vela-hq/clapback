"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
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
import { renderShareCard } from "./shareCard";

// The window onto a run — not the run itself. The fetch, the clock and every
// decision about what happens when the verdict lands live in `useRoastJob`,
// because closing this overlay no longer ends the roast: it minimizes it into
// the pill and the request keeps going. Everything below is view.
type RoastRunProps = {
  open: boolean;
  url: string;
  // The verdict, or null while it is still being waited on.
  result: RoastResult | null;
  // Wall-clock ms since the run began, ticked by the job.
  elapsed: number;
  // The door to the waitlist: the run failed or abstained, we
  // know the URL, and the intent was real. Retrying is the primary answer — a
  // bot wall or a crash is often a one-off — but a second failure with no
  // fallback is a visitor who wanted this and leaves with nothing.
  onEmailInstead: () => void;
  onRetry: () => void;
  // Minimize while running, dismiss once finished — the job decides which.
  onClose: () => void;
};

const SPIN = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";
const QUIPS = [
  "It reads your homepage the way a stranger would. Strangers are not kind.",
  "No fake progress bar. It’s done when it’s done.",
  "Every claim it makes cites a law of UX. No vibes.",
  "It roasts in private. Only the final verdict makes it out.",
  "It scrolls, squints and clicks around like a first time visitor.",
  "Right now it is probably judging your hero copy.",
  "It screenshots everything it complains about. Receipts included.",
  "Popups, tiny tap targets, walls of text. It notices all of it.",
  "Your site gets the same patience a real visitor has. Almost none.",
  "It only reports what it can prove with a screenshot.",
  "If your homepage is clean it will say so. That is rare.",
  "Somewhere in a data center a robot is squinting at your buttons.",
  "It has read every law of UX so you don’t have to.",
  "Slow roast, better flavor. Good findings take a minute.",
];
// How long each quip holds, and how long the cross-fade between two of them
// takes. QUIP_FADE_MS must match the .quip transition duration in the CSS —
// the swap happens when the fade-out is done, so a mismatch shows the cut.
// The hold is sized against the wait: 14 quips at ~7.6s is a ~106s cycle, so a
// typical 30-90s run never shows the same line twice.
const QUIP_HOLD_MS = 7600;
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

export default function RoastRun({
  open,
  url,
  result,
  elapsed,
  onEmailInstead,
  onRetry,
  onClose,
}: RoastRunProps) {
  const [selected, setSelected] = useState(0);
  // Share card: which finding is being shared + the rendered PNG for preview.
  // The canvas itself stays in a ref — copy/native-share need its toBlob, and
  // a data URL alone can't give that back without a re-decode.
  const [share, setShare] = useState<{ index: number; dataUrl: string } | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const shareCanvasRef = useRef<HTMLCanvasElement | null>(null);
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

  // A new run wipes the reading state of the last one. Keyed on the verdict
  // going back to null, which is exactly when the job starts or retries — a
  // minimize/restore round trip leaves it alone, so an expanded finding is
  // still expanded when the window comes back.
  useEffect(() => {
    if (result !== null) return;
    setSelected(0);
    setShare(null);
  }, [result]);

  // Pick up the quip cycle where the run actually is, not at the top. Reopening
  // a roast that has been running behind the page for ninety seconds and being
  // greeted by line one reads as a restart.
  useEffect(() => {
    if (!open || !scanning) return;
    setQuipIndex(Math.floor(elapsed / QUIP_HOLD_MS));
    setQuipVisible(true);
    // `elapsed` is sampled on open, not tracked — it changes every 120ms and
    // would reset the cross-fade on every tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, scanning]);

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

  // Lock the page behind the overlay so the landing doesn't scroll underneath.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape closes the innermost layer first: share card, then the overlay.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (share) setShare(null);
        else onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, share, onClose]);

  // "Opened" means the offer was put in front of the user, and the funnel reads
  // it as the step before the click — so every surface that can fire
  // `roast_upsell_clicked` has to be able to fire this first. The report does it
  // when its locked card scrolls into view; here the equivalent is the CTA band
  // of a finished run. Without it the overlay's clicks arrive with no matching
  // open, and a cumulative funnel drops those users at the stage they skipped
  // rather than crediting them with the click they actually made.
  //
  // Three branches render this CTA (`clean`, the no-run_id findings fallback,
  // and the auth-wall abstention) and they are mutually exclusive, so a single
  // ref is only ever attached to one live node — but the funnel wants to know
  // the auth wall converted, not the overlay in general, hence `via`.
  //
  // Declared BEFORE the `!open` early return below, like every hook here: this
  // component stays mounted while `open` toggles (closing minimizes into the
  // pill), and a hook below a conditional return changes the hook count between
  // renders, which React rejects outright.
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  const status = result?.status ?? null;
  const upsellVia = status === "cannot_review" ? "auth_wall" : "overlay";
  useEffect(() => {
    if (!open) return;
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        track("roast_upsell_opened", {
          url: cleanUrl,
          site_type: site.siteType,
          surfaces: site.untestedSurfaces.length,
          surfaces_list: site.untestedSurfaces.join(", ") || null,
          via: upsellVia,
        });
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
    // Keyed on the verdict landing, which is when the CTA mounts. The site
    // context arrives on the same object, so it needs no dependency of its own.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, status]);

  if (!open) return null;

  // The agent's own measured duration is the truthful number once it lands; the
  // ticking clock is only a stand-in while we wait.
  const serverMs =
    result && "durationMs" in result && result.durationMs ? result.durationMs : null;
  const elapsedLabel = formatElapsed(scanning ? elapsed : (serverMs ?? elapsed));
  const spinChar = SPIN[Math.floor(elapsed / 90) % SPIN.length];
  const quip = QUIPS[quipIndex % QUIPS.length];
  // Anchor the ticking clock so the wait isn't open-ended: a real run is around
  // two minutes and the slow tail reaches three. Past the honest estimate the
  // line stays reassuring instead of pretending nothing is wrong. It does not
  // count down to a cutoff: the browser's is a backstop now (lib/roastBudget.ts)
  // and a run that reaches it was never going to be saved by warning about it.
  const estimate =
    elapsed < 120_000
      ? "usually takes a minute or two"
      : "running long · it’s still finding things to hate";

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

  // The full-roast CTA is a link to /pricing now, and it names no price: this
  // overlay's job is to prove the roast is worth wanting, the pricing page's
  // job is the ask. site_type / surfaces still ride the click so it can be read
  // per site kind and per "how personalized was the pitch" in Mixpanel.
  const handleFullRoastClick = () => {
    track("roast_upsell_clicked", {
      url: cleanUrl,
      site_type: site.siteType,
      surfaces: site.untestedSurfaces.length,
      surfaces_list: site.untestedSurfaces.join(", ") || null,
      via: upsellVia,
    });
  };

  // ---- Share card: one finding -> one shareable PNG, rendered client-side.
  // The screenshot is already a data: URI in memory, so nothing is uploaded
  // and the "it roasts in private" promise holds — sharing is the user's move.
  const shareFileName = `clapback-roast-${cleanUrl.replace(/\W+/g, "-")}.png`;

  const openShare = async (i: number) => {
    const f = findings[i];
    const shot = f.shot ? (shots[f.shot] ?? null) : null;
    try {
      const canvas = await renderShareCard({ title: f.title, url: cleanUrl, shot });
      shareCanvasRef.current = canvas;
      setShareCopied(false);
      setShare({ index: i, dataUrl: canvas.toDataURL("image/png") });
      track("roast_share_opened", {
        url: cleanUrl,
        law: f.law,
        sev: f.sev,
        position: i + 1,
        has_shot: shot !== null,
      });
    } catch {
      // Rendering is cosmetic; the roast itself is unaffected. Fail silent.
    }
  };

  const shareBlob = () =>
    new Promise<Blob | null>((resolve) => {
      const canvas = shareCanvasRef.current;
      if (!canvas) return resolve(null);
      canvas.toBlob(resolve, "image/png");
    });

  const trackShared = (method: "copy" | "download" | "native") => {
    if (!share) return;
    const f = findings[share.index];
    track("roast_shared", {
      url: cleanUrl,
      law: f.law,
      sev: f.sev,
      position: share.index + 1,
      method,
    });
  };

  const handleShareCopy = async () => {
    const blob = await shareBlob();
    if (!blob) return;
    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1800);
      trackShared("copy");
    } catch {
      // Clipboard denied (permissions, http). The download button is right there.
    }
  };

  const handleShareDownload = () => {
    if (!share) return;
    const a = document.createElement("a");
    a.download = shareFileName;
    a.href = share.dataUrl;
    a.click();
    trackShared("download");
  };

  const handleShareNative = async () => {
    const blob = await shareBlob();
    if (!blob) return;
    const file = new File([blob], shareFileName, { type: "image/png" });
    if (!navigator.canShare?.({ files: [file] })) return;
    try {
      await navigator.share({ files: [file] });
      trackShared("native");
    } catch {
      // User dismissed the share sheet — not a share, not an error.
    }
  };

  // Status text in the title bar: one line per outcome.
  const statusLabel = () => {
    if (scanning) return `running · ${elapsedLabel}`;
    if (result?.status === "findings") return `done in ${elapsedLabel}`;
    if (result?.status === "clean") return `done in ${elapsedLabel}`;
    if (result?.status === "cannot_review") {
      if (result.kind === "site_unreachable") return "site unreachable";
      if (result.kind === "bot_blocked") return "robots blocked";
      if (result.kind === "auth_required") return "login required";
      return "couldn’t read the page";
    }
    return "failed";
  };

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
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
            <div className={styles.counterGroup}>
              <div className={styles.timerBig}>{elapsedLabel}</div>
              <div className={styles.estimate}>{estimate}</div>
            </div>
            <div className={styles.scanCopy}>
              <div className={styles.scanTitle}>The agent is roasting.</div>
              <div
                className={`${styles.quip} ${quipVisible ? "" : styles.quipHidden}`}
              >
                {quip}
              </div>
            </div>
          </div>
        )}

        {result?.status === "cannot_review" && result.kind === "auth_required" && (
          /* ---- Auth wall: the page exists, it just refuses logged-out
                 strangers. The one abstention that is a sales moment rather
                 than a dead end — logged-in roasts are what the paid tier
                 does, so pitch that instead of shrugging. ---- */
          <div className={styles.scanBody}>
            <div className={styles.stateIcon}>🔐</div>
            <div className={styles.scanCopy}>
              <div className={styles.scanTitle}>That page wants a login first.</div>
              <div className={styles.quip}>{result.reason}</div>
              <div className={styles.quip}>
                The free roast sees what a logged-out stranger sees, and here that’s a signup
                form. The full roast signs in with a test account you provide and roasts the
                real app behind it.
              </div>
            </div>
            <div className={styles.stateActions}>
              <a
                className={styles.ctaButton}
                href="/pricing"
                ref={ctaRef}
                onClick={handleFullRoastClick}
              >
                Roast it logged in
              </a>
              <button className={styles.ghostButton} onClick={onClose}>
                Try another URL
              </button>
            </div>
            <div className={styles.privacyChip}>
              no findings invented · it abstains when it can’t see
            </div>
          </div>
        )}

        {result?.status === "cannot_review" && result.kind !== "auth_required" && (
          /* ---- Abstained: Cooper is built to say "I couldn't see it" rather
                 than invent findings. Bot walls and blank SPA shells are common,
                 so this state is expected, not an error. A classified dead end
                 (dead URL, robot wall) points at another URL as the way out;
                 only the unclassified case still leads with a retry. ---- */
          <div className={styles.scanBody}>
            <div className={styles.stateIcon}>
              {result.kind === "site_unreachable"
                ? "🛰️"
                : result.kind === "bot_blocked"
                  ? "🤖"
                  : "🚧"}
            </div>
            <div className={styles.scanCopy}>
              <div className={styles.scanTitle}>
                {result.kind === "site_unreachable"
                  ? "That URL doesn’t go anywhere."
                  : result.kind === "bot_blocked"
                    ? "That site won’t let robots in."
                    : "We couldn’t read that page."}
              </div>
              <div className={styles.quip}>{result.reason}</div>
              {result.kind === "site_unreachable" && (
                <div className={styles.quip}>
                  Check the address for typos, or point the roaster at another site.
                </div>
              )}
              {result.kind === "bot_blocked" && (
                <div className={styles.quip}>
                  The roaster visits like a robot, and this site turns robots away at the
                  door. Nothing to grade behind it. Try another URL.
                </div>
              )}
            </div>
            <div className={styles.stateActions}>
              {result.kind ? (
                <>
                  <button className={styles.ctaButton} onClick={onClose}>
                    Try another URL
                  </button>
                  <button className={styles.ghostButton} onClick={onRetry}>
                    Try again
                  </button>
                </>
              ) : (
                <>
                  <button className={styles.ctaButton} onClick={onRetry}>
                    Try again
                  </button>
                  <button className={styles.ghostButton} onClick={() => onEmailInstead()}>
                    Email it to me instead
                  </button>
                </>
              )}
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
              <button className={styles.ctaButton} onClick={onRetry}>
                Try again
              </button>
              <button className={styles.ghostButton} onClick={() => onEmailInstead()}>
                Email it to me instead
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
              <a
                className={styles.ctaButton}
                href="/pricing"
                ref={ctaRef}
                onClick={handleFullRoastClick}
              >
                See the full roast
              </a>
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
                              <button
                                className={styles.shareLink}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openShare(i);
                                }}
                              >
                                share this roast
                              </button>
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
                <a
                  className={styles.ctaButton}
                  href="/pricing"
                  ref={ctaRef}
                  onClick={handleFullRoastClick}
                >
                  See the full roast
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Share modal: preview of the rendered card + ways to get it out.
            Same overlay treatment as the upsell, wider card for the image. */}
        {share && (
          <div className={styles.upsell} onClick={() => setShare(null)}>
            <div className={styles.shareCard} onClick={(e) => e.stopPropagation()}>
              <button
                className={styles.upsellClose}
                onClick={() => setShare(null)}
                aria-label="Close"
              >
                ✕
              </button>
              <div className={styles.upsellTitle}>Share this roast</div>
              {/* eslint-disable-next-line @next/next/no-img-element --
                  data: URI preview of the card just rendered on canvas. */}
              <img
                className={styles.sharePreview}
                src={share.dataUrl}
                alt={`Share card: ${findings[share.index]?.title ?? "roast finding"}`}
              />
              <div className={styles.shareActions}>
                <button className={styles.ctaButton} onClick={handleShareCopy}>
                  {shareCopied ? "Copied ✓" : "Copy image"}
                </button>
                <button className={styles.shareGhost} onClick={handleShareDownload}>
                  Download
                </button>
                {typeof navigator !== "undefined" && !!navigator.share && (
                  <button className={styles.shareGhost} onClick={handleShareNative}>
                    Share…
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Control under the window — stop clicks from bubbling to the overlay.
          Mid-scan this is a minimize, not a cancel, which is why it says "keep
          browsing" and not "close": the run carries on either way, and the pill
          it docks into says so the instant it appears. That is the right moment
          to explain it — a second line of reassurance here only pushed the
          button off-centre under the card. */}
      <div className={styles.controls} onClick={(e) => e.stopPropagation()}>
        <button className={styles.controlBtn} onClick={onClose}>
          {scanning ? "↓ keep browsing" : "✕ close"}
        </button>
      </div>
    </div>
  );
}
