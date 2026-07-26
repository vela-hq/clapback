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
import RoastPill from "./components/RoastPill";
import { useRoastJob } from "./components/useRoastJob";
import { FINDINGS } from "./data/findings";
import { FINAL_URL_FIELD, HERO_URL_FIELD, focusUrlField } from "./components/urlField";
import { track } from "@/lib/analytics";

const FOUND_ISSUES = 14;

// Where the waitlist is allowed to be reached from.
//
// There is deliberately no "a visitor pressed a CTA" member. An empty URL box
// used to fall through to the waitlist, and the navbar button — which has no
// box anywhere near it, so is always empty — therefore took people from "show
// me this thing" straight to "give us your email" before they had seen a single
// finding. It was the site's most prominent button and its worst path.
//
// The waitlist is now an exit from a roast, never an entrance to the site, and
// this type is the enforcement: every caller has to name the roast it is
// leaving, and there is no way to spell "none".
type WaitlistVia =
  // "Get the full roast" on a finished run, in the overlay.
  | "upsell"
  // The same, from the report at /r/<id>, handed over as /?waitlist=report.
  | "report"
  // The run crashed or abstained. The URL is known and the intent was real, so
  // an email is the one thing left worth offering — and worth something.
  | "failed_roast";

// Which CTA was pressed. Only matters when the box is empty: it decides which
// box to send them to, and it is the property that makes the leak visible in
// Mixpanel rather than inferred.
type CtaOrigin = "nav" | "hero" | "final";

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
  // A CTA was pressed with nothing to roast. Names the box that was sent to and
  // counts the presses — the count is what re-fires the nudge when someone
  // presses twice, since the field itself never changes.
  const [nudge, setNudge] = useState<{ field: "hero" | "final"; n: number } | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 6000);
  }, []);

  const toastToRoast = useCallback(() => {
    track("toast_roast_cta_clicked");
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(null);
    focusUrlField(HERO_URL_FIELD);
  }, []);

  // Every way in is a roast the visitor has already seen through to its end —
  // see WaitlistVia. `via` keeps them apart in Mixpanel, because "paid attention
  // to a verdict and asked for more" and "the roast broke and we offered to mail
  // it" are different leads even though both are earned.
  const openWaitlist = useCallback((via: WaitlistVia) => {
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

  // Every URL gets a real roast: /api/roast runs Cooper against it live.
  //
  // An empty box is not a lead, it is a visitor who pressed the button before
  // filling in the one field the product needs. It used to be answered with the
  // waitlist modal, which read as a bait and switch — the page promises a free
  // roast and the button delivered a signup form. Now it is answered with the
  // box: scroll there, focus it, and say what is missing.
  //
  // Unless a roast is already running: then this is the same roast being asked
  // for twice, and the answer is to show it, not to start another. `startRoast`
  // refuses and reopens it; every CTA that reaches here is relabelled while that
  // is true, so the refusal is never a surprise.
  const submit = useCallback((origin: CtaOrigin) => {
    const target = url.trim();
    // Nothing to roast and nothing running: send them to the field. The navbar
    // has no field of its own, so it borrows the hero's.
    if (!target && !roast.scanning) {
      const field = origin === "final" ? "final" : "hero";
      focusUrlField(field === "final" ? FINAL_URL_FIELD : HERO_URL_FIELD);
      setNudge((prev) => ({ field, n: (prev?.n ?? 0) + 1 }));
      track("roast_url_prompted", { via: origin });
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
  }, [url, roast.scanning, startRoast]);

  // Bound per CTA, and zero-arg on purpose. These are wired straight to onClick
  // in three components, and React hands a click handler its MouseEvent as the
  // first argument — which would land in `origin`, go into an analytics property
  // and take the whole handler down on the way to being serialized.
  const submitFromNav = useCallback(() => submit("nav"), [submit]);
  const submitFromHero = useCallback(() => submit("hero"), [submit]);
  const submitFromFinal = useCallback(() => submit("final"), [submit]);

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
    // `clip`, not `hidden`. `overflow-x: hidden` computes overflow-y to `auto`,
    // which makes this div a scroll container — and a `position: sticky` header
    // inside a scroll container that never scrolls just sits at the top of the
    // document and slides away with everything else. The nav has not actually
    // been sticky; it scrolled off after ~66px, which is why getting back to it
    // meant scrolling all the way to the top. `clip` crops the same overflow
    // without creating the scroll container.
    <div style={{ overflowX: "clip" }}>
      <Nav onGetRoast={submitFromNav} busy={roast.scanning} />
      <main>
        <Hero
          url={url}
          onUrlChange={setUrl}
          onSubmit={submitFromHero}
          foundIssues={FOUND_ISSUES}
          busy={roast.scanning}
          nudge={nudge?.field === "hero" ? nudge.n : 0}
        />
        <TrustStrip />
        <Problem />
        <HowItWorks />
        <SampleFinding onExport={exportOne} />
        <Credibility />
        <Backlog onExportAll={exportAll} />
        <Integrations />
        <Faq />
        <FinalCta
          url={url}
          onUrlChange={setUrl}
          onSubmit={submitFromFinal}
          busy={roast.scanning}
          nudge={nudge?.field === "final" ? nudge.n : 0}
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
        onEmailInstead={() => openWaitlist("failed_roast")}
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
