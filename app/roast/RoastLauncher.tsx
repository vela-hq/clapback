"use client";

import { useCallback, useState } from "react";
import { urlFieldProps } from "../components/urlField";
import RoastRun from "../components/RoastRun";
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
  const [roastOpen, setRoastOpen] = useState(false);
  const [leadId, setLeadId] = useState("");

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

  // Same `via` split as app/page.tsx: upsell-driven opens are the funnel's
  // strongest intent signal and must be separable in Mixpanel.
  const openWaitlist = useCallback((via: "form" | "upsell" = "form") => {
    const id = newLeadId();
    setLeadId(id);
    setRoastOpen(false);
    setModalOpen(true);
    const target = url.trim();
    track("waitlist_opened", { lead_id: id, has_url: target.length > 0, via });
    captureLead(id, target);
  }, [url]);

  const submit = useCallback(() => {
    const target = url.trim();
    if (!target) {
      openWaitlist();
      return;
    }
    setModalOpen(false);
    setRoastOpen(true);
    const id = newLeadId();
    setLeadId(id);
    captureLead(id, target);
  }, [url, openWaitlist]);

  return (
    <>
      <div className={styles.form}>
        <div className={styles.field}>
          <span className={styles.scheme}>https://</span>
          <input
            className={styles.input}
            placeholder={placeholder}
            aria-label="Your site URL"
            {...urlFieldProps(url, setUrl, submit)}
          />
        </div>
        <button className={styles.submit} onClick={submit}>
          Get my free roast →
        </button>
      </div>
      <div className={styles.hint}>
        Roast your own site or a competitor&rsquo;s · no login, no card required ·
        takes about 2 minutes
      </div>

      <WaitlistModal
        open={modalOpen}
        url={url}
        leadId={leadId}
        onClose={() => setModalOpen(false)}
      />
      <RoastRun
        open={roastOpen}
        url={url}
        onGetFullRoast={() => openWaitlist("upsell")}
        onClose={() => setRoastOpen(false)}
      />
    </>
  );
}
