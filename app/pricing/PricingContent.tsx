"use client";

// The pricing page, personalized when a run id came along for the ride.
//
// Structure is the offer, in the order an unconvinced reader needs it: what
// the full roast actually does (the flow walk and the manifest), what they
// already got next to what they haven't (the table), what this costs anywhere
// else (the anchor), what happens if it disappoints (the guarantee), and only
// then the number. The number appears exactly twice: once inside the anchor,
// where it has context, and once on the buy card.
//
// The buy button is a fake door: it opens an email capture, not a checkout.
// pricing_pay_clicked is the metric the door exists to collect.

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import { joinSurfaces } from "@/app/data/roast";
import { identify, track } from "@/lib/analytics";
import styles from "./Pricing.module.css";

const PRICE = "$49";

export type RunSummary = {
  runId: string;
  url: string; // the roasted site's URL, for the lead capture
  findings: number; // 0 means the mini roast came back clean
  siteType: string | null;
  surfaces: string[];
};

function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return "";
  }
}

// "checkout flow" -> "Checkout flow", for the flow-walk step labels.
function capFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// The steps of the walk band. Their surfaces, when Cooper named them, sit in
// the middle of the chain where the mini roast never went; defaults fill the
// gaps. The notes are the kinds of thing a full walk turns up, worded as
// categories, not as claims about this site: nothing here has been found yet,
// and the band must not pretend otherwise.
function walkSteps(surfaces: string[]): { label: string; note: string | null }[] {
  const defaults = ["Sign up", "Search", "Checkout", "Account"];
  // Compare with spacing and punctuation stripped: "start for free signup"
  // must swallow the default "Sign up", or the walk shows both.
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const middle = [
    ...surfaces.map(capFirst),
    ...defaults.filter((d) => !surfaces.some((s) => norm(s).includes(norm(d)))),
  ].slice(0, 4);
  const notes = ["dead end", "form eats input", "silent error"];
  let n = 0;
  return [
    { label: "Home", note: "your report" },
    ...middle.map((label, i) => ({
      label,
      note: i % 2 === 0 ? notes[n++ % notes.length] : null,
    })),
  ];
}

type GateStatus = "closed" | "idle" | "submitting" | "success" | "error";

export default function PricingContent({ run }: { run: RunSummary | null }) {
  const host = run ? hostOf(run.url) : "";
  // Cooper's surface names are labels, not prose ("start for free signup"):
  // quoted, they read as citations from the report instead of broken grammar.
  const surfacesAnd = joinSurfaces(
    (run?.surfaces ?? []).map((s) => `“${s}”`),
    "and",
  );
  const steps = walkSteps(run?.surfaces ?? []);

  const [gate, setGate] = useState<GateStatus>("closed");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const leadIdRef = useRef("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    track("pricing_viewed", {
      run_id: run?.runId ?? null,
      url: run?.url ?? null,
      findings: run?.findings ?? null,
      site_type: run?.siteType ?? null,
    });
    // Once per mount: this is a page view, not a state change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openGate = useCallback(() => {
    leadIdRef.current =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now());
    track("pricing_pay_clicked", {
      run_id: run?.runId ?? null,
      url: run?.url ?? null,
      price: PRICE,
      site_type: run?.siteType ?? null,
      surfaces: run?.surfaces.length ?? 0,
      surfaces_list: run?.surfaces.join(", ") || null,
    });
    track("waitlist_opened", {
      lead_id: leadIdRef.current,
      has_url: !!run?.url,
      via: "pricing",
    });
    // Capture the URL before an email is committed, same as the landing does:
    // a pay click that churns out of the modal is still a lead worth counting.
    if (run?.url) {
      void fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: leadIdRef.current, url: run.url }),
        keepalive: true,
      }).catch(() => {});
    }
    setEmail("");
    setError(null);
    setGate("idle");
    setTimeout(() => inputRef.current?.focus(), 60);
  }, [run]);

  const closeGate = useCallback(() => setGate("closed"), []);

  useEffect(() => {
    if (gate === "closed") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeGate();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [gate, closeGate]);

  const submit = async () => {
    if (gate === "submitting") return;
    setGate("submitting");
    setError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: leadIdRef.current, email, url: run?.url ?? "" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as { error?: string })?.error ?? "Something went wrong. Try again.");
        setGate("error");
        return;
      }
      identify(leadIdRef.current);
      track("waitlist_submitted", { lead_id: leadIdRef.current, has_url: !!run?.url });
      setGate("success");
    } catch {
      setError("Network error. Try again.");
      setGate("error");
    }
  };

  const manifest: { title: string; body: string }[] = [
    {
      title: "Signs up like a stranger",
      body:
        "It makes itself a throwaway account on your site: name, email, password, the flow you assume works. Verification, empty states, first-run screens, all of it gets used for real.",
    },
    {
      title: "Walks every flow to the end",
      body: surfacesAnd
        ? `Your ${surfacesAnd}, plus search, forms and settings. It presses on until something gives, then screenshots what gave.`
        : "Signup, search, checkout, settings, the forms in between. It presses on until something gives, then screenshots what gave.",
    },
    {
      title: "Reads every page, not one",
      body:
        "Every page it can reach gets what your homepage got: a full-page map with every finding marked where it lives.",
    },
    {
      title: "Proves everything it claims",
      body:
        "Each finding cites a named law of UX and carries a severity, a screenshot and a concrete fix with an effort estimate. No vibes.",
    },
    {
      title: "Writes the tickets",
      body:
        "Every finding exports to Jira or Linear pre-written, and the whole report is a link you can hand to your team.",
    },
    {
      title: "Comes back to check",
      body:
        "One re-roast included. Ship your fixes, run it again, watch the list shrink.",
    },
  ];

  const table: { what: string; mini: string; full: string }[] = [
    { what: "Pages read", mini: "1", full: "every page it can reach" },
    {
      what: "Flows walked",
      mini: "none, it only looks",
      // Surfaces are stops, not routes: a pricing page is not a flow you walk
      // end to end, so the flows are claimed as the paths between them.
      full: surfacesAnd
        ? `your ${surfacesAnd}, plus every flow in between`
        : "signup to checkout, end to end",
    },
    { what: "Accounts", mini: "none", full: "makes its own" },
    { what: "Evidence maps", mini: "one", full: "one per page" },
    { what: "Findings", mini: "the loudest few", full: "everything it can prove" },
    { what: "Tickets", mini: "no", full: "Jira and Linear, pre-written" },
    { what: "Re-roast after fixes", mini: "no", full: "one included" },
  ];

  const anchors: { what: string; cost: string; catchLine: string }[] = [
    { what: "UX audit from an agency", cost: "$3,000 to $8,000", catchLine: "two to three weeks" },
    { what: "Moderated usability testing", cost: "$2,000 and up", catchLine: "you recruit the users" },
    { what: "A senior designer's afternoon", cost: "$400", catchLine: "one opinion, no receipts" },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.bar}>
        <svg className={styles.mark} viewBox="0 0 100 100" aria-hidden="true">
          <polygon points="50,4 57.7,31.5 82.5,17.5 68.5,42.3 96,50 68.5,57.7 82.5,82.5 57.7,68.5 50,96 42.3,68.5 17.5,82.5 31.5,57.7 4,50 31.5,42.3 17.5,17.5 42.3,31.5" />
        </svg>
        <a className={styles.brand} href="/">
          ClapBack
        </a>
        {run && (
          <a className={styles.backLink} href={`/r/${run.runId}`}>
            ← back to your roast
          </a>
        )}
      </header>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>The full roast</div>
          <h1 className={styles.h1}>
            {run ? "That was one page." : "The free roast reads one page."}
          </h1>
          <p className={styles.heroLede}>
            {run
              ? run.findings > 0
                ? `The mini roast read one page of ${host} and found ${run.findings} ${
                    run.findings === 1 ? "issue" : "issues"
                  }. The rest of your ${
                    run.siteType || "product"
                  } got a pass it did not earn. The full roast signs in, walks every flow and files evidence for all of it.`
                : `The mini roast read one page of ${host} and found nothing. One page is not your product. The full roast signs in, walks every flow and files evidence for whatever it finds.`
              : "The full roast signs into your product with an account it makes itself, walks every page and every flow, and files a screenshot-backed ticket for everything it can prove."}
          </p>

          {/* The walk, drawn. Wireframe stops joined by a dashed line, their own
              untested surfaces in the chain: the picture of the sentence above.
              The wrapper carries the mobile edge fade: the band scrolls sideways
              on a phone, and a clean cut at the viewport edge said "that's all
              of it" about the stops that were the point. */}
          <div className={styles.flowWrap} aria-hidden="true">
          <div className={styles.flow}>
            {steps.map((s, i) => (
              <Fragment key={s.label}>
                {i > 0 && <span className={styles.flowLink} />}
                <div className={styles.flowStep}>
                  <div
                    className={`${styles.flowCard} ${s.note && i > 0 ? styles.flowCardHot : ""}`}
                  >
                    <span className={styles.flowBarWide} />
                    <span className={styles.flowBar} />
                    <span className={styles.flowBlock} />
                    {s.note && s.note !== "your report" && (
                      <span className={styles.flowPin}>!</span>
                    )}
                  </div>
                  <span className={styles.flowLabel}>{s.label}</span>
                  {/* "your report" is a covered stop, not a place something will
                      break: it doesn't get the failure-note accent. */}
                  <span
                    className={
                      s.note
                        ? i === 0
                          ? styles.flowNoteMuted
                          : styles.flowNote
                        : styles.flowNoteEmpty
                    }
                  >
                    {s.note ?? "·"}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>What it does with your site</h2>
        <ol className={styles.manifest}>
          {manifest.map((m, i) => (
            <li className={styles.mRow} key={m.title}>
              <span className={styles.mNum}>{String(i + 1).padStart(2, "0")}</span>
              <div className={styles.mBody}>
                <h3 className={styles.mTitle}>{m.title}</h3>
                <p className={styles.mText}>{m.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>{run ? "What you got, next to what you didn't" : "The free roast, next to the full one"}</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th></th>
                <th className={styles.thMini}>{run ? "your free roast" : "the free roast"}</th>
                <th className={styles.thFull}>the full roast</th>
              </tr>
            </thead>
            <tbody>
              {/* data-label feeds the stacked mobile layout, where the header
                  row is gone and each cell has to say which column it was. */}
              {table.map((row) => (
                <tr key={row.what}>
                  <td className={styles.tdWhat}>{row.what}</td>
                  <td
                    className={styles.tdMini}
                    data-label={run ? "your free roast" : "the free roast"}
                  >
                    {row.mini}
                  </td>
                  <td className={styles.tdFull} data-label="the full roast">
                    {row.full}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>What everyone else charges for this</h2>
        <div className={styles.anchors}>
          <div className={styles.anchorHead}>Not our prices</div>
          {anchors.map((a) => (
            <div className={styles.anchorRow} key={a.what}>
              <span className={styles.anchorWhat}>{a.what}</span>
              <span className={styles.anchorDots} aria-hidden="true" />
              <span className={styles.anchorCost}>{a.cost}</span>
              <span className={styles.anchorCatch}>{a.catchLine}</span>
            </div>
          ))}
          <div className={styles.anchorHead}>Ours</div>
          <div className={`${styles.anchorRow} ${styles.anchorUs}`}>
            <span className={styles.anchorWhat}>The full roast</span>
            <span className={styles.anchorDots} aria-hidden="true" />
            <span className={styles.anchorCost}>{PRICE}</span>
            <span className={styles.anchorCatch}>under an hour, receipts included</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.guarantee}>
          <div className={styles.gLabel}>The guarantee</div>
          <p className={styles.gText}>
            The full roast arrives by email. If it tells you nothing you didn&rsquo;t already
            know, reply to that email and your money comes back.
          </p>
        </div>
      </section>

      <section className={styles.buySection}>
        <div className={styles.buyCard}>
          <div className={styles.buyPrice}>{PRICE}</div>
          <div className={styles.buyNote}>once. per roast, not per month.</div>
          <button className={styles.buyBtn} onClick={openGate} type="button">
            Get the full roast{host ? ` of ${host}` : ""}
          </button>
        </div>
        <p className={styles.foot}>
          {run ? (
            <>
              Not ready? <a href={`/r/${run.runId}`}>Reread your free roast</a>, it isn&rsquo;t
              going anywhere for 90 days.
            </>
          ) : (
            <>
              Not ready? <a href="/">Get the free roast first</a>, it takes about two minutes.
            </>
          )}
        </p>
      </section>

      <Footer />

      {gate !== "closed" && (
        <div
          className={styles.overlay}
          onClick={closeGate}
          role="dialog"
          aria-modal="true"
          aria-labelledby="gate-title"
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.close} onClick={closeGate} aria-label="Close">
              ✕
            </button>
            {gate === "success" ? (
              <>
                <span className={styles.badge}>Spot saved</span>
                <h2 className={styles.mTitle} id="gate-title">
                  You&rsquo;re in the next batch.
                </h2>
                <p className={styles.modalLede}>
                  One email when your spot opens{host ? (
                    <>
                      , starting with <strong>{host}</strong>
                    </>
                  ) : null}
                  . You pay nothing until then.
                </p>
                <button className={styles.buyBtn} onClick={closeGate} type="button">
                  Done
                </button>
              </>
            ) : (
              <>
                <span className={styles.badge}>Rolling out in batches</span>
                <h2 className={styles.mTitle} id="gate-title">
                  The full roast opens in batches.
                </h2>
                <p className={styles.modalLede}>
                  Every roast gets a real walk of a real product, so we onboard a batch at a
                  time. Leave your email and you get the next spot
                  {host ? (
                    <>
                      , starting with <strong>{host}</strong>
                    </>
                  ) : null}
                  .
                </p>
                <input
                  ref={inputRef}
                  className={styles.input}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submit();
                  }}
                  placeholder="you@company.com"
                  aria-label="Your email"
                  autoComplete="email"
                />
                {error ? <div className={styles.error}>{error}</div> : null}
                <button
                  className={styles.buyBtn}
                  onClick={submit}
                  disabled={gate === "submitting"}
                  type="button"
                >
                  {gate === "submitting" ? "Saving your spot…" : "Save my spot →"}
                </button>
                <p className={styles.modalFine}>No spam. One email when your spot opens.</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
