"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import TrustStrip from "./components/TrustStrip";
import Problem from "./components/Problem";
import HowItWorks from "./components/HowItWorks";
import SampleFinding from "./components/SampleFinding";
import ScanTeaser from "./components/ScanTeaser";
import Credibility from "./components/Credibility";
import Backlog from "./components/Backlog";
import Integrations from "./components/Integrations";
import Faq from "./components/Faq";
import FinalCta from "./components/FinalCta";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import WaitlistModal from "./components/WaitlistModal";
import RoastRun from "./components/RoastRun";
import RoastPill from "./components/RoastPill";
import { useRoastJob } from "./components/useRoastJob";
import { FINDINGS } from "./data/findings";
import { track } from "@/lib/analytics";

const FOUND_ISSUES = 14;

export default function Home() {
  const [url, setUrl] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  // The run outlives its window: closing the overlay minimizes it into the pill
  // and the fetch keeps going, so the state lives here rather than inside
  // RoastRun, which unmounts every time the user goes back to reading the page.
  const roast = useRoastJob();
  // Pulled out so the callbacks below depend on the individual actions rather
  // than on the job object, which is a fresh literal on every tick of the clock.
  const { start: startRoast, close: closeRoast } = roast;
  const [leadId, setLeadId] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 6000);
  }, []);

  const toastToRoast = useCallback(() => {
    track("toast_roast_cta_clicked");
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(null);
    const input = document.getElementById("roast-url");
    input?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (input instanceof HTMLInputElement) input.focus({ preventScroll: true });
  }, []);

  // `via` separates "clicked Pay in the upsell" from "submitted the form with
  // no URL" in Mixpanel — the upsell path is the strongest intent signal the
  // funnel produces, so it must not be indistinguishable from the weakest.
  const openWaitlist = useCallback((via: "form" | "upsell" | "report" = "form") => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now());
    setLeadId(id);
    // A finished roast is done with, so the waitlist replaces it. A running one
    // is not: it keeps going in the pill behind the modal, because the waitlist
    // is not worth throwing away a roast the user is still owed. `close` is
    // exactly that rule, and no-ops when nothing is active.
    closeRoast();
    setModalOpen(true);

    const target = url.trim();
    track("waitlist_opened", { lead_id: id, has_url: target.length > 0, via });

    // Capture the typed URL immediately, before they commit an email — so we
    // still get data if they churn out of the modal. Fire-and-forget.
    if (target) {
      void fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: id, url: target }),
        keepalive: true,
      }).catch(() => {});
    }
  }, [url, closeRoast]);

  // Arriving from a report's upsell (`/?waitlist=report`). The report page has
  // the strongest intent in the funnel and none of the machinery — the modal,
  // the lead id, the capture POST all live here — so it hands the intent over
  // in the URL and this picks it up. Stripped from the address bar afterwards
  // so a reload or a shared link doesn't reopen the modal out of nowhere.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("waitlist") !== "report") return;
    window.history.replaceState(null, "", window.location.pathname);
    openWaitlist("report");
    // Once, on arrival. `openWaitlist` changes identity with `url`, which is
    // empty here anyway.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Every URL now gets a real roast: /api/roast runs Cooper against it live.
  // An empty box still goes to the waitlist — there is nothing to roast, and
  // the URL is the thing we most want to capture.
  //
  // Unless a roast is already running: then this is the same roast being asked
  // for twice, and the answer is to show it, not to start another or to detour
  // into the waitlist. `startRoast` refuses and reopens it; every CTA that
  // reaches here is relabelled while that is true, so the refusal is never a
  // surprise.
  const submit = useCallback(() => {
    const target = url.trim();
    // Nothing to roast and nothing running: the waitlist is the fallback.
    if (!target && !roast.scanning) {
      openWaitlist();
      return;
    }
    // Refused while a roast is in flight — that one is reopened instead, and
    // an empty box can only ever reach here in exactly that case.
    if (!startRoast(target)) return;
    setModalOpen(false);

    // Capture the URL the moment they ask for a roast, exactly as the waitlist
    // path does — a real run costs money, so the lead should outlive the
    // overlay even if they never reach the upsell. Fire-and-forget.
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now());
    setLeadId(id);
    void fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: id, url: target }),
      keepalive: true,
    }).catch(() => {});
  }, [url, roast.scanning, openWaitlist, startRoast]);

  const exportOne = useCallback(
    (tool: string, title: string) => {
      track("ticket_export_clicked", { tool, scope: "single", title });
      showToast(`Cute click. This ticket's a demo. On a real roast it lands in ${tool}.`);
    },
    [showToast],
  );

  const exportAll = useCallback(
    (tool: string) => {
      track("ticket_export_clicked", { tool, scope: "all", count: FINDINGS.length });
      showToast(`Nice try. This backlog is the demo. A real roast sends all ${FINDINGS.length} tickets to ${tool}, pre-filled.`);
    },
    [showToast],
  );

  // Reveal-on-scroll for [data-reveal] elements.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  return (
    <div style={{ overflowX: "hidden" }}>
      <Nav onGetRoast={submit} busy={roast.scanning} />
      <main>
        <Hero
          url={url}
          onUrlChange={setUrl}
          onSubmit={submit}
          foundIssues={FOUND_ISSUES}
          busy={roast.scanning}
        />
        <TrustStrip />
        <Problem />
        <HowItWorks />
        <SampleFinding onExport={exportOne} />
        <ScanTeaser />
        <Credibility />
        <Backlog onExportAll={exportAll} />
        <Integrations />
        <Faq />
        <FinalCta
          url={url}
          onUrlChange={setUrl}
          onSubmit={submit}
          busy={roast.scanning}
        />
      </main>
      <Footer />
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
        onGetFullRoast={() => openWaitlist("upsell")}
        onRetry={roast.retry}
        onClose={roast.close}
      />
      {/* The same run, docked. Only ever one of these two is on screen. */}
      <RoastPill
        open={roast.active && roast.minimized}
        url={roast.url}
        result={roast.result}
        elapsed={roast.elapsed}
        onOpen={() => roast.restore("pill")}
      />
      <Toast
        message={toast}
        actionLabel="Roast your site →"
        onAction={toastToRoast}
      />
    </div>
  );
}
