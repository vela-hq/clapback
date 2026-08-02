"use client";

import { useCallback, useEffect, useState } from "react";
import { LAUNCHER_URL_FIELD, focusUrlField, urlFieldProps } from "../components/urlField";
import RoastRun from "../components/RoastRun";
import RoastPill from "../components/RoastPill";
import { useRoastJob } from "../components/useRoastJob";
import WaitlistModal from "../components/WaitlistModal";
import { track } from "@/lib/analytics";
import styles from "./Roast.module.css";

// Self-contained roast box for the /roast/[vertical] pages. It owns the URL
// state and the same modal flow the landing page runs (RoastRun → optional
// waitlist upsell), so each vertical page converts on its own instead of
// bouncing visitors to the homepage. The submit/waitlist logic mirrors
// app/page.tsx; the interactive pieces (RoastRun, WaitlistModal) are reused
// as-is.
export default function RoastLauncher({
  placeholder = "your-website.com",
}: {
  placeholder?: string;
}) {
  const [url, setUrl] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  // Same deal as the landing page: the job outlives the overlay so closing the
  // window minimizes the run into the pill instead of killing it.
  const roast = useRoastJob();
  const { start: startRoast, close: closeRoast } = roast;
  const [leadId, setLeadId] = useState("");
  // Submitted with the box empty. A count so a second press replays it.
  const [nudge, setNudge] = useState(0);
  const [asking, setAsking] = useState(false);
  useEffect(() => {
    if (!nudge) return;
    setAsking(true);
    const t = setTimeout(() => setAsking(false), 5200);
    return () => clearTimeout(t);
  }, [nudge]);

  const newLeadId = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now());

  const captureLead = (id: string, target: string) => {
    if (!target) return;
    // Fire-and-forget: a real run costs money, so we want the URL even if the
    // visitor churns out before committing an email.
    void fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: id, url: target }),
      keepalive: true,
    }).catch(() => {});
  };

  // Same gate as app/page.tsx, and for the same reason: the waitlist is an exit
  // from a roast, not an entrance to the page. There is no member here for "a
  // CTA was pressed", so an empty box cannot reach it. The finished-run upsell
  // is not a member either any more: that CTA links to /pricing now.
  const openWaitlist = useCallback((via: "failed_roast") => {
    const id = newLeadId();
    setLeadId(id);
    // A running roast survives the waitlist opening over it; a finished one
    // does not need to. Same rule as the overlay close.
    closeRoast();
    setModalOpen(true);
    const target = url.trim();
    track("waitlist_opened", { lead_id: id, has_url: target.length > 0, via });
    captureLead(id, target);
  }, [url, closeRoast]);

  // One roast at a time, same as the landing page: a run already in flight
  // answers this click by reopening itself rather than starting a second.
  const submit = useCallback(() => {
    const target = url.trim();
    // Nothing to roast: ask for the URL rather than for an email. The box is
    // directly under the button here, so this is mostly the nudge doing the
    // talking.
    if (!target && !roast.scanning) {
      focusUrlField(LAUNCHER_URL_FIELD);
      setNudge((n) => n + 1);
      track("roast_url_prompted", { via: "vertical" });
      return;
    }
    if (!startRoast(target)) return;
    setModalOpen(false);
    const id = newLeadId();
    setLeadId(id);
    captureLead(id, target);
  }, [url, roast.scanning, startRoast]);

  return (
    <>
      <div className={styles.form}>
        <div className={`${styles.field} ${asking ? styles.fieldAsking : ""}`}>
          <span className={styles.scheme}>https://</span>
          <input
            id={LAUNCHER_URL_FIELD}
            className={styles.input}
            placeholder={placeholder}
            aria-label="Your site URL"
            {...urlFieldProps(url, setUrl, submit)}
          />
        </div>
        <button className={styles.submit} onClick={() => submit()}>
          {roast.scanning ? "Watch the roast →" : "Get my free roast →"}
        </button>
      </div>
      <div className={`${styles.hint} ${asking ? styles.hintAsking : ""}`}>
        {asking
          ? "Needs a site to roast. Drop a URL in here and it goes to work."
          : roast.scanning
            ? "One roast at a time. Yours is still running. This takes you back to it."
            : "Roast your own site or a competitor’s · no login, no card required · takes about 2 minutes"}
      </div>

      <WaitlistModal
        open={modalOpen}
        url={url}
        leadId={leadId}
        onClose={() => setModalOpen(false)}
      />
      <RoastRun
        open={roast.active && !roast.minimized}
        url={roast.url}
        result={roast.result}
        elapsed={roast.elapsed}
        onEmailInstead={() => openWaitlist("failed_roast")}
        onRetry={roast.retry}
        onClose={roast.close}
      />
      <RoastPill
        open={roast.active && roast.minimized}
        url={roast.url}
        result={roast.result}
        elapsed={roast.elapsed}
        onOpen={() => roast.restore("pill")}
      />
    </>
  );
}
