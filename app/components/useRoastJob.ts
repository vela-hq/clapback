"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { RoastResult } from "../data/roast";
import { track } from "@/lib/analytics";
import { displayUrl } from "@/lib/url";
import { CLIENT_TIMEOUT_MS } from "@/lib/roastBudget";
import { playRoastChime } from "./chime";

// The run itself, lifted out of the modal that shows it.
//
// This used to live inside RoastRun, which meant closing the overlay unmounted
// the component, aborted the fetch and threw away a roast the user had already
// waited a minute for. The run has to outlive its window: closing is now
// "minimize", the job keeps ticking behind the page, and the pill is how you get
// back to it. Nothing here renders — that is the point, the state has to survive
// the view being gone.

// The one deadline the browser owns is a backstop, not a race — see
// lib/roastBudget.ts for why it sits above every server-side number rather than
// under them. Guessing from the outside has cost us finished roasts twice now:
// a 150s cutoff tuned to a faster model, then a 270s one that beat the route's
// own 280s answer by ten seconds. Both turned paid-for runs the archive had
// already kept into user-visible errors nobody could act on.

export type RoastJob = {
  // The URL under roast, as typed. "" before the first run.
  url: string;
  // A run exists and has not been dismissed — it is either in the modal or in
  // the pill.
  active: boolean;
  // Running behind the page rather than in the modal.
  minimized: boolean;
  // No verdict yet. False the instant the answer lands, whatever it says.
  scanning: boolean;
  result: RoastResult | null;
  // Wall-clock ms since this attempt began, ticked while scanning.
  elapsed: number;
  // Begins a roast, unless one is already in flight. Returns whether it did —
  // false means the running roast was brought back into view instead.
  start: (url: string) => boolean;
  // The overlay's close: keeps a running roast alive, ends a finished one.
  close: () => void;
  minimize: () => void;
  // Back to the roast — straight to the report when there is one. `via` is the
  // route back: the pill, or a CTA that was refused because this roast is
  // already running.
  restore: (via?: "pill" | "cta") => void;
  retry: () => void;
};

export function useRoastJob(): RoastJob {
  const router = useRouter();
  const [url, setUrl] = useState("");
  // 0 means "never started". Bumping it is the whole run/retry mechanism: the
  // fetch effect keys on this and nothing else, so minimizing and restoring
  // can't restart a run.
  const [attempt, setAttempt] = useState(0);
  const [active, setActive] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [result, setResult] = useState<RoastResult | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // Wall-clock start of the current attempt — the source of truth the ticking
  // clock and every elapsed_ms property are derived from.
  const startRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  // Machine-readable failure class, set where the error is actually known (HTTP
  // code, timeout flag) and read later by the shown-tracking effect, which only
  // sees the flattened RoastResult.
  const errorReasonRef = useRef<string | null>(null);
  // Guards the abandonment event so a dismiss-then-unload (or a double pagehide)
  // can't fire it twice for one run.
  const abandonTracked = useRef(false);
  const shownTracked = useRef(false);
  // Read by the effects that must know whether anyone is looking without
  // re-running when that changes: the chime, and the "was it minimized when it
  // landed" question the notification depends on.
  const minimizedRef = useRef(false);
  useEffect(() => {
    minimizedRef.current = minimized;
  }, [minimized]);

  const cleanUrl = displayUrl(url) || "your site";
  const scanning = active && result === null;

  const goToReport = useCallback(
    (runId: string) => {
      router.push(`/r/${runId}`);
    },
    [router],
  );

  // One fetch per attempt. Aborts on retry, on a new run, on dismiss and on its
  // own timeout — but explicitly NOT on minimize, which is the whole feature.
  useEffect(() => {
    if (attempt === 0) return;

    startRef.current = Date.now();
    setElapsed(0);
    setResult(null);
    shownTracked.current = false;
    abandonTracked.current = false;
    errorReasonRef.current = null;

    const controller = new AbortController();
    abortRef.current = controller;
    // Both the timeout and a dismiss abort the same controller, so the catch
    // needs this flag to tell "we gave up waiting" (show an error) from "the
    // user killed the run" (show nothing — there is no view left to tell).
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
        if (controller.signal.aborted && !timedOut) return; // dismissed, not failed
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
    // `url` is read at start time, not tracked: retyping in the hero while a
    // roast runs must not silently swap the run out from under the user.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  // Drive the clock while the run is in flight — for the modal's big timer and
  // for the pill's small one, whichever is on screen. ~120ms keeps the spinner
  // lively without thrashing React.
  useEffect(() => {
    if (!scanning) return;
    const id = setInterval(() => {
      setElapsed(Date.now() - startRef.current);
    }, 120);
    return () => clearInterval(id);
  }, [scanning]);

  // Closing the tab or navigating away mid-scan otherwise leaves no trace — the
  // user just disappears from the funnel. Fire a best-effort abandonment on the
  // way out; sendBeacon survives the unload where a normal XHR would be killed.
  useEffect(() => {
    if (!scanning) return;
    const onPageHide = () => {
      if (abandonTracked.current) return;
      abandonTracked.current = true;
      track(
        "roast_demo_abandoned",
        {
          url: cleanUrl,
          elapsed_ms: Math.round(Date.now() - startRef.current),
          via: "pagehide",
          minimized: minimizedRef.current,
        },
        { transport: "sendBeacon", send_immediately: true },
      );
    };
    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, [scanning, cleanUrl]);

  // The verdict landed. Fire "results shown" exactly once per run, and — if the
  // user walked away from the modal — say so out loud, because nothing on
  // screen is going to catch their eye on its own.
  useEffect(() => {
    if (!active || !result || shownTracked.current) return;
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
      // Did they sit through it, or go back to reading the page? The answer
      // decides whether the wait is a churn problem or a solved one.
      minimized: minimizedRef.current,
    });
    if (minimizedRef.current) playRoastChime();
  }, [active, result, cleanUrl]);

  // A finished roast that nobody is looking at should be findable from the tab
  // strip too — the sound is missable and the pill is off-screen if they
  // scrolled. Restored on cleanup so a dismiss or a navigation puts the real
  // title back.
  useEffect(() => {
    if (!active || !minimized || !result) return;
    const prev = document.title;
    document.title =
      result.status === "findings" || result.status === "clean"
        ? "✅ Your roast is ready · ClapBack"
        : "ClapBack · roast finished";
    return () => {
      document.title = prev;
    };
  }, [active, minimized, result]);

  // A verdict with findings has a page of its own — the evidence map at
  // /r/<run_id>, which is also the link the user can send someone. Go there
  // rather than rendering the same findings into a modal that dies on close.
  //
  // Only when the modal is the thing on screen: a run that finishes while
  // minimized must not yank the page out from under someone who is reading it.
  // That navigation is theirs to trigger, by clicking the pill.
  //
  // And only when Cooper archived the run: `runId` is null on a local dev roast
  // and on a run whose upload failed, and both of those would land on a 404. The
  // modal's own findings view is the fallback for exactly that case.
  useEffect(() => {
    if (!active || minimized) return;
    if (result?.status !== "findings" || !result.runId) return;
    goToReport(result.runId);
  }, [active, minimized, result, goToReport]);

  const restore = useCallback(
    (via: "pill" | "cta" = "pill") => {
      // Coerced, not trusted. This is wired straight to onClick in more than one
      // place, and React hands a click handler its MouseEvent as the first
      // argument — which lands here as `via`, goes into an analytics property
      // and takes the whole handler down with it on the way to being
      // serialized. The click then does nothing at all, which is a far worse
      // bug than a mislabelled event.
      const from = via === "cta" ? "cta" : "pill";
      track("roast_restored", {
        url: cleanUrl,
        elapsed_ms: Math.round(Date.now() - startRef.current),
        status: result?.status ?? "running",
        via: from,
      });
      // Go where the roast actually is. Un-minimizing first would flash the
      // modal for a frame on its way to the same place.
      if (result?.status === "findings" && result.runId) {
        goToReport(result.runId);
        return;
      }
      setMinimized(false);
    },
    [cleanUrl, result, goToReport],
  );

  // One roast at a time. A roast is a real agent run against a real budget, and
  // a second submit while one is in flight is someone wondering where theirs
  // went — not a request to pay for another. Refuse, and put the running one
  // back on screen so the click still answers the question that prompted it.
  //
  // The guard lives here rather than in the pages because both the landing page
  // and every /roast/<vertical> page start runs, and a rule enforced twice is a
  // rule that eventually holds in one place only.
  const start = useCallback(
    (next: string): boolean => {
      if (active && result === null) {
        track("roast_start_blocked", {
          url: cleanUrl,
          attempted_url: displayUrl(next) || null,
          elapsed_ms: Math.round(Date.now() - startRef.current),
        });
        restore("cta");
        return false;
      }
      setUrl(next);
      setResult(null);
      setActive(true);
      setMinimized(false);
      setAttempt((n) => n + 1);
      return true;
    },
    [active, result, cleanUrl, restore],
  );

  const minimize = useCallback(() => {
    if (!active) return;
    track("roast_minimized", {
      url: cleanUrl,
      elapsed_ms: Math.round(Date.now() - startRef.current),
      status: result?.status ?? "running",
    });
    setMinimized(true);
  }, [active, cleanUrl, result]);

  // Ends the run for good. Internal on purpose: nothing in the UI can stop a
  // roast any more, so the only way here is `close` on a run that has already
  // answered. The mid-flight branch stays as a safety net — if a caller ever
  // does kill a live run, that is abandonment and the funnel needs to hear
  // about it rather than lose the run silently.
  const dismiss = useCallback(() => {
    if (!active) return;
    if (result === null) {
      if (!abandonTracked.current) {
        abandonTracked.current = true;
        track("roast_demo_abandoned", {
          url: cleanUrl,
          elapsed_ms: Math.round(Date.now() - startRef.current),
          via: "dismiss",
          minimized: minimizedRef.current,
        });
      }
    } else {
      track("roast_demo_closed", { url: cleanUrl });
    }
    abortRef.current?.abort();
    setActive(false);
    setMinimized(false);
    setResult(null);
  }, [active, cleanUrl, result]);

  // The overlay's ✕, and the only close there is. A roast still running goes on
  // running behind the page — there is no stopping it, by design: it is already
  // paid for and already happening, and a control that throws that away is a
  // mis-click waiting to cost someone their roast. A finished one has nothing
  // left to protect, so closing it means closing it.
  const close = useCallback(() => {
    if (!active) return;
    if (result === null) minimize();
    else dismiss();
  }, [active, result, minimize, dismiss]);

  const retry = useCallback(() => {
    track("roast_retried", { url: cleanUrl });
    setMinimized(false);
    setAttempt((n) => n + 1);
  }, [cleanUrl]);

  return {
    url,
    active,
    minimized,
    scanning,
    result,
    elapsed,
    start,
    close,
    minimize,
    restore,
    retry,
  };
}
