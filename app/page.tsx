"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import TrustStrip from "./components/TrustStrip";
import Problem from "./components/Problem";
import HowItWorks from "./components/HowItWorks";
import SampleFinding from "./components/SampleFinding";
import Credibility from "./components/Credibility";
import Backlog from "./components/Backlog";
import Integrations from "./components/Integrations";
import Faq from "./components/Faq";
import FinalCta from "./components/FinalCta";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import WaitlistModal from "./components/WaitlistModal";
import RoastRun from "./components/RoastRun";
import { FINDINGS } from "./data/findings";
import { track } from "@/lib/analytics";

const FOUND_ISSUES = 14;

export default function Home() {
  const [url, setUrl] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [roastOpen, setRoastOpen] = useState(false);
  const [leadId, setLeadId] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const openWaitlist = useCallback(() => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now());
    setLeadId(id);
    setRoastOpen(false);
    setModalOpen(true);

    const target = url.trim();
    track("waitlist_opened", { lead_id: id, has_url: target.length > 0 });

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
  }, [url]);

  // Every URL now gets a real roast: /api/roast runs Cooper against it live.
  // An empty box still goes to the waitlist — there is nothing to roast, and
  // the URL is the thing we most want to capture.
  const submit = useCallback(() => {
    if (!url.trim()) {
      openWaitlist();
      return;
    }
    setModalOpen(false);
    setRoastOpen(true);

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
      body: JSON.stringify({ leadId: id, url: url.trim() }),
      keepalive: true,
    }).catch(() => {});
  }, [url, openWaitlist]);

  const exportOne = useCallback(
    (tool: string, title: string) => {
      track("ticket_export_clicked", { tool, scope: "single", title });
      showToast(`${tool} ticket created · ${title}`);
    },
    [showToast],
  );

  const exportAll = useCallback(
    (tool: string) => {
      track("ticket_export_clicked", { tool, scope: "all", count: FINDINGS.length });
      showToast(`${tool} · ${FINDINGS.length} tickets created, fully pre-filled`);
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
      <Nav onGetRoast={submit} />
      <main>
        <Hero
          url={url}
          onUrlChange={setUrl}
          onSubmit={submit}
          foundIssues={FOUND_ISSUES}
        />
        <TrustStrip />
        <Problem />
        <HowItWorks />
        <SampleFinding onExport={exportOne} />
        <Credibility />
        <Backlog onExportAll={exportAll} />
        <Integrations />
        <Faq />
        <FinalCta url={url} onUrlChange={setUrl} onSubmit={submit} />
      </main>
      <Footer />
      <WaitlistModal
        open={modalOpen}
        url={url}
        leadId={leadId}
        onClose={() => setModalOpen(false)}
      />
      <RoastRun
        open={roastOpen}
        url={url}
        onGetFullRoast={openWaitlist}
        onClose={() => setRoastOpen(false)}
      />
      <Toast message={toast} />
    </div>
  );
}
