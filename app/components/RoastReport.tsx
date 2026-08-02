"use client";

// The roast, as a page you can link to.
//
// One picture of the whole site on the left, the findings on the right, and a
// marker joining each finding to the place it is about. This replaced a stack
// of disconnected crops: a photograph of a nav link looks the same whether it
// sits at the top of the homepage or buried in a footer, and the reader was
// being asked to rebuild the page in their head to tell the difference.
//
// The map is the only stateful part. It has two modes — the whole page fitted
// into the frame, and zoomed onto one finding's region — and selecting a
// finding switches between them. Everything inside the frame is positioned in
// the PAGE's own pixel coordinates and transformed as a unit, so a region
// Cooper reported at (920, 5239) is placed at (920, 5239) with no conversion.

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { CSSProperties } from "react";
import {
  EFFORT_STYLE,
  SEV_STYLE,
  joinSurfaces,
  severityTally,
  type PageMap,
  type RoastFinding,
  type RoastShots,
  type SiteContext,
} from "@/app/data/roast";
import { track } from "@/lib/analytics";
import { cropFromMap } from "./mapCrop";
import { renderShareCard } from "./shareCard";
import styles from "./RoastReport.module.css";

// The tally dots, which are NOT the chip fills: Minor's chip is hollow with a
// grey border, and reusing that here would render an invisible dot beside the
// word "Minor". A legend needs a colour even when the badge it stands for
// doesn't have one.
const SEV_DOT: Record<string, string> = {
  Blocker: "var(--accent)",
  Major: "var(--yellow)",
  Minor: "#cfc8ba",
};

// The upsell deliberately names no price. The report's job is to prove the
// product is worth wanting; whether it is worth paying for is /pricing's job,
// and mixing the two is how the old "$49" CTA died with zero clicks. The run id
// rides along so the pricing page can keep talking about THEIR site.

// Half the pin's rendered size, from RoastReport.module.css. Kept in sync by
// hand because the placement maths needs it before layout, and reading it back
// off the DOM to place the thing that isn't there yet is a worse trade.
const PIN_RADIUS = 15;

// The map is a desktop pane. On a phone the split has nowhere to split to, so
// the map became a band across the top and the findings started below the fold
// — half a viewport spent on a keyhole onto a page-tall screenshot nobody can
// read at that size. Below this width there is no map: the findings are the
// report, and each one still carries its own crop.
//
// Must match the breakpoint in RoastReport.module.css, which hides the pane in
// CSS as well — that is what the server-rendered markup gets, so a phone never
// paints the pane in the moment before hydration takes it out of the tree.
const MAP_MQ = "(min-width: 981px)";

function subscribeMap(onChange: () => void): () => void {
  const mq = window.matchMedia(MAP_MQ);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

// Server snapshot is "wide", matching the stylesheet: the desktop layout is the
// one the CSS paints before JS arrives, so hydrating into it is the version
// that doesn't flash. Phones drop the pane on the first client render.
function useWide(): boolean {
  return useSyncExternalStore(
    subscribeMap,
    () => window.matchMedia(MAP_MQ).matches,
    () => true,
  );
}

type Props = {
  runId: string;
  url: string;
  findings: RoastFinding[];
  shots: RoastShots;
  page: PageMap | null;
  durationMs: number | null;
  site: SiteContext;
};

type Placed = {
  finding: RoastFinding;
  index: number;
  // Null when the finding has no region, or its region sits below the bottom of
  // the map image on a page too long to photograph whole.
  x: number | null;
  y: number | null;
};

function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function mmss(ms: number | null): string | null {
  if (ms === null || !Number.isFinite(ms) || ms <= 0) return null;
  const total = Math.round(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export default function RoastReport({
  runId,
  url,
  findings,
  shots,
  page,
  durationMs,
  site,
}: Props) {
  // The first finding starts open. Half of report readers never expanded
  // anything, and the ones who did opened almost everything — a split that says
  // the rows weren't reading as openable, not that the contents were dull. One
  // worked example teaches the gesture, and it costs a reader who already knew
  // nothing but a row they can close.
  //
  // Deliberately fires no event: an expansion that happens on every page load
  // is not a signal, and mixing it into `roast_finding_expanded` would bury the
  // real ones under a count equal to the number of page views. The consequence
  // is that position #1's expand count now UNDER-reports — someone who would
  // have opened it no longer has to. Judge this change on whether readers open
  // findings #2 and beyond, not on the total.
  const [selected, setSelected] = useState(findings.length > 0 ? 0 : -1);
  // Hovering a row lights up its place on the map. Kept in React rather than
  // CSS because the two are in different subtrees: the row is in the list, the
  // region and pin it points at are children of the image.
  const [hovered, setHovered] = useState(-1);
  const [copied, setCopied] = useState(false);
  const [share, setShare] = useState<{ index: number; dataUrl: string } | null>(null);
  const [shareBusy, setShareBusy] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [wholePage, setWholePage] = useState(false);
  const [frame, setFrame] = useState({ w: 0, h: 0 });

  const frameRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLOListElement | null>(null);
  const ctaRef = useRef<HTMLLIElement | null>(null);

  const wide = useWide();
  const host = hostOf(url);
  const took = mmss(durationMs);
  const tally = useMemo(() => severityTally(findings), [findings]);
  const surfacesAnd = joinSurfaces(site.untestedSurfaces, "and");
  const pricingHref = `/pricing?r=${runId}`;
  const mapSrc = page ? (shots[page.shot] ?? null) : null;
  // Whether a map is actually on screen — not just whether the run produced
  // one. The copy that points at it ("marked on the screenshot", "further down
  // than the screenshot reaches") has to follow this, not the data.
  const hasMap = wide && mapSrc !== null && page !== null;

  useEffect(() => {
    track("roast_report_viewed", {
      url,
      run_id: runId,
      findings: findings.length,
      has_map: mapSrc !== null,
    });
    // Once per mount: this is a page view, not a state change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // "Opened" in the funnel means the offer was put in front of the user. Here
  // the offer is the last card in the findings list, so the equivalent moment
  // is that card scrolling into view — without this, a report with zero clicks
  // can't say whether anyone even saw the ask.
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        track("roast_upsell_opened", {
          url,
          run_id: runId,
          site_type: site.siteType,
          surfaces: site.untestedSurfaces.length,
          surfaces_list: site.untestedSurfaces.join(", ") || null,
          via: "report",
        });
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
    // Once per mount, like the view event: the CTA doesn't move or change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The frame's size in CSS px, which is the one input the zoom maths needs and
  // the one thing that isn't known until the browser has laid out.
  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const measure = () => setFrame({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
    // `wide` too: crossing the breakpoint mounts or unmounts the frame, and the
    // measurement has to be redone against the one that exists now.
  }, [mapSrc, wide]);

  // Two ways to look at the page, and the interesting thing is that the obvious
  // one is the bad one. Fitting a whole page into the frame is what the design
  // called for, and on a real site it produces a 130px-wide ribbon — a 7,800px
  // page into an 800px pane is a 1:10 reduction, and every marker lands on a
  // grey smudge. So the DEFAULT is the page at the pane's own width, scrolled
  // like the page it is a picture of, and "whole page" is the second view: not
  // a thing you read, a thing you glance at to see where the damage clusters.
  const scales = useMemo(() => {
    if (!page || frame.w === 0 || frame.h === 0) return { read: 1, whole: 1 };
    return {
      read: frame.w / page.w,
      whole: Math.min(frame.w / page.w, frame.h / page.shotH),
    };
  }, [page, frame]);
  const scale = wholePage ? scales.whole : scales.read;

  // Where each finding sits on the map, in the image's displayed pixels.
  // Findings that coincide (two problems with the same button) would stack
  // their pins into one illegible disc, so repeats step down and to the right
  // rather than hiding each other.
  const placed: Placed[] = useMemo(() => {
    const seen = new Map<string, number>();
    return findings.map((finding, index) => {
      const r = finding.region;
      if (!page || !r || r.y >= page.shotH) return { finding, index, x: null, y: null };
      const key = `${Math.round((r.x * scale) / 20)}:${Math.round((r.y * scale) / 20)}`;
      const nth = seen.get(key) ?? 0;
      seen.set(key, nth + 1);
      // In screen px, not page px: the nudge exists to keep two discs apart on
      // screen, so it must not shrink when the map is zoomed out — which is
      // exactly when the pins are closest together.
      const step = nth * 22;
      // Pins are centred on their region's top-left corner, and a region at the
      // very top of the page (a nav bar — the single most common finding) would
      // put half the disc above the image and get it clipped. Keep the whole
      // disc on the map; a marker a few pixels off is still pointing at the
      // right thing, a marker cut in half is not.
      const inset = PIN_RADIUS + 2;
      return {
        finding,
        index,
        x: Math.min(Math.max(r.x * scale + step, inset), page.w * scale - inset),
        y: Math.min(Math.max(r.y * scale + step, inset), page.shotH * scale - inset),
      };
    });
  }, [findings, page, scale]);

  // Bring a finding's region into view. The map scrolls rather than transforms:
  // it is a picture of a page, and scrolling is how you move around a page.
  //
  // Takes the scale rather than reading it, because the caller may have just
  // switched views: `setWholePage(false)` has not re-rendered yet, so the
  // `scale` in this closure would still be the overview's and the map would
  // scroll to the wrong place by a factor of four.
  const showOnMap = useCallback(
    (index: number, atScale: number, behavior: ScrollBehavior = "smooth") => {
      const el = frameRef.current;
      const region = findings[index]?.region;
      if (!el || !page || !region || region.y >= page.shotH) return;
      el.scrollTo({
        top: Math.max(0, (region.y + region.h / 2) * atScale - el.clientHeight / 2),
        behavior,
      });
    },
    [findings, page],
  );

  // The map has to start where the pre-opened finding is. Otherwise the report
  // loads with row one expanded and its region highlighted, every other region
  // dimmed behind it, and the highlight itself somewhere off the top of a pane
  // the reader has no reason to scroll — the one moment the split is supposed
  // to explain itself, spent pointing at nothing.
  //
  // Waits for `frame.h`, because before the pane is measured `scales.read` is
  // still 1 and the scroll would land at a tenth of the right depth. Jumps
  // rather than glides: this is where the map opens, not a move anyone made.
  const mapHomed = useRef(false);
  useEffect(() => {
    if (mapHomed.current || !hasMap || frame.h === 0 || selected < 0) return;
    mapHomed.current = true;
    showOnMap(selected, scales.read, "auto");
  }, [hasMap, frame.h, selected, scales.read, showOnMap]);

  const select = useCallback(
    (index: number, via: "row" | "marker") => {
      const next = selected === index ? -1 : index;
      setSelected(next);
      if (next < 0) return;
      const f = findings[next];
      track(via === "marker" ? "roast_marker_clicked" : "roast_finding_expanded", {
        url,
        run_id: runId,
        law: f.law,
        sev: f.sev,
        position: next + 1,
      });
      if (via === "marker") {
        listRef.current
          ?.querySelector(`[data-finding="${next}"]`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        // Picking a row from the whole-page view means "show me this one", and
        // the overview is too small to show anything. Drop back to reading size
        // before scrolling, or the map obeys and nothing becomes visible.
        setWholePage(false);
        requestAnimationFrame(() => showOnMap(next, scales.read));
      }
    },
    [selected, findings, url, runId, showOnMap, scales.read],
  );

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      track("roast_report_link_copied", { url, run_id: runId });
    } catch {
      // Clipboard denied (insecure context, or the user said no). The address
      // bar already holds the link; don't pretend something happened.
    }
  }, [url, runId]);

  // The share card wants a close-up. Cooper's own crop is the better picture
  // when it survived the byte budget; when it didn't, cut one out of the map —
  // the region says exactly where, and the pixels are already here.
  const openShare = useCallback(
    async (index: number) => {
      const f = findings[index];
      setShareBusy(true);
      let shot: string | null = f.shot ? (shots[f.shot] ?? null) : null;
      if (!shot && page && mapSrc && f.region) {
        shot = await cropFromMap(mapSrc, page, f.region).catch(() => null);
      }
      track("roast_share_opened", {
        url,
        run_id: runId,
        law: f.law,
        sev: f.sev,
        position: index + 1,
        has_shot: shot !== null,
      });
      try {
        const canvas = await renderShareCard({ title: f.title, url: host, shot });
        setShare({ index, dataUrl: canvas.toDataURL("image/png") });
      } finally {
        setShareBusy(false);
      }
    },
    [findings, shots, page, mapSrc, url, runId, host],
  );

  const shareAction = useCallback(
    async (method: "copy" | "download") => {
      if (!share) return;
      const f = findings[share.index];
      if (method === "download") {
        const a = document.createElement("a");
        a.href = share.dataUrl;
        a.download = `clapback-${host.replace(/[^a-z0-9]+/gi, "-")}-${share.index + 1}.png`;
        a.click();
      } else {
        const blob = await (await fetch(share.dataUrl)).blob();
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 1800);
      }
      track("roast_shared", {
        url,
        run_id: runId,
        law: f.law,
        sev: f.sev,
        position: share.index + 1,
        method,
      });
    },
    [share, findings, host, url, runId],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (share) setShare(null);
      else if (selected >= 0) setSelected(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [share, selected]);

  // The layer is sized in displayed pixels, not transformed: an <img> that is
  // genuinely 560px wide scrolls, prints and zooms like an image, where a
  // scaled one is a 1280px element the browser still reserves room for.
  // What the map is pointing at. Hover wins over selection so that sweeping the
  // list previews each finding's place without losing the one you opened, and
  // returning the mouse to nothing puts the map back on it.
  const focus = hovered >= 0 ? hovered : selected;

  // Dim the other regions only when the focused finding is somewhere on the map
  // to be looked at instead. A whole-page finding has `region: null` and one
  // below the bottom of the screenshot has nowhere to sit, and for either of
  // those "dim everything else" washes the entire map out in order to highlight
  // nothing. This is not a corner case now that a finding opens by default:
  // whole-page findings tend to sort first, so the wash-out would be the map's
  // opening state on exactly the runs where it looks most broken.
  const dimOthers = focus >= 0 && placed[focus]?.x != null;

  const layerStyle: CSSProperties = {
    width: page ? page.w * scale : 0,
    height: page ? page.shotH * scale : 0,
    // Centred when the page is narrower than the frame, which happens in the
    // whole-page view on anything but the longest sites.
    marginLeft: page ? Math.max(0, (frame.w - page.w * scale) / 2) : 0,
  };

  return (
    <div className={styles.page}>
      <header className={styles.bar}>
        <svg className={styles.mark} viewBox="0 0 100 100" aria-hidden="true">
          <polygon points="50,4 57.7,31.5 82.5,17.5 68.5,42.3 96,50 68.5,57.7 82.5,82.5 57.7,68.5 50,96 42.3,68.5 17.5,82.5 31.5,57.7 4,50 31.5,42.3 17.5,17.5 42.3,31.5" />
        </svg>
        <a className={styles.brand} href="/">
          ClapBack
        </a>
        <a
          className={styles.urlPill}
          href={url}
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          {host}
        </a>
        {took && (
          <span className={styles.done}>
            <span className={styles.doneTick}>✓</span> roasted in {took}
          </span>
        )}
        <div className={styles.barActions}>
          <button className={styles.copy} onClick={copyLink} type="button">
            {copied ? "link copied" : "copy link"}
          </button>
          <a className={styles.barCta} href="/">
            Roast your site
          </a>
        </div>
      </header>

      <div className={styles.split}>
        {wide && (
          <aside className={styles.mapPane}>
            {mapSrc && page ? (
              <>
                <div ref={frameRef} className={styles.mapFrame}>
                  <div className={styles.mapLayer} style={layerStyle}>
                    {/* eslint-disable-next-line @next/next/no-img-element --
                        next/image optimizes remote URLs; this is either an inline
                        data: URI or a same-origin route that already serves
                        exactly the bytes we want, immutably cached. */}
                    <img
                      className={styles.mapImg}
                      src={mapSrc}
                      alt={`Full-page screenshot of ${host}`}
                      draggable={false}
                      fetchPriority="high"
                    />
                    {placed.map(({ finding, index, x }) =>
                      finding.region && x !== null ? (
                        <span
                          key={`r${index}`}
                          className={`${styles.region} ${focus === index ? styles.regionSel : ""}`}
                          style={{
                            left: finding.region.x * scale,
                            top: finding.region.y * scale,
                            width: finding.region.w * scale,
                            height: finding.region.h * scale,
                            opacity: dimOthers && focus !== index ? 0.2 : undefined,
                          }}
                        />
                      ) : null,
                    )}
                    {placed.map(({ index, x, y }) =>
                      x !== null && y !== null ? (
                        <button
                          key={`p${index}`}
                          type="button"
                          className={`${styles.pin} ${focus === index ? styles.pinSel : ""}`}
                          style={{ left: x, top: y }}
                          onClick={(e) => {
                            e.stopPropagation();
                            select(index, "marker");
                          }}
                          aria-label={`Finding ${index + 1}: ${findings[index].title}`}
                        >
                          {index + 1}
                        </button>
                      ) : null,
                    )}
                  </div>
                </div>
                <div className={styles.mapFoot}>
                  <span className={styles.mapHint}>
                    {page.shotH < page.h
                      ? `the top ${Math.round(page.shotH).toLocaleString()}px of a ${Math.round(page.h).toLocaleString()}px page`
                      : "your whole page, as the agent saw it"}
                  </span>
                  <button
                    className={styles.mapReset}
                    onClick={() => {
                      const next = !wholePage;
                      setWholePage(next);
                      if (!next && selected >= 0) {
                        requestAnimationFrame(() => showOnMap(selected, scales.read));
                      }
                    }}
                    type="button"
                  >
                    {wholePage ? "actual size" : "whole page"}
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.mapMissing}>
                No whole-page screenshot survived this run.
                <br />
                The findings below still carry their own evidence.
              </div>
            )}
          </aside>
        )}

        <section className={styles.readPane}>
          <div className={styles.head}>
            <h1 className={styles.count}>
              {findings.length} issue{findings.length === 1 ? "" : "s"} on this page.
            </h1>
            <span className={styles.tally}>
              {tally.map((t, i) => (
                <span key={t.sev}>
                  {i > 0 && " · "}
                  <span className={styles.tallyDot} style={{ background: SEV_DOT[t.sev] }} />
                  {t.count} {t.sev}
                </span>
              ))}
            </span>
          </div>
          <p className={styles.lede}>
            {hasMap ? "Every issue is marked on the screenshot. " : ""}Open any one for why it costs
            you users, and what to do about it.
          </p>

          <ol className={styles.list} ref={listRef}>
            {findings.map((f, i) => {
              const isSel = selected === i;
              const effort = EFFORT_STYLE[f.effort];
              const shot = f.shot ? shots[f.shot] : null;
              // Only worth saying when there is a screenshot on screen to be
              // "further down than".
              const offMap =
                hasMap && page !== null && f.region !== null && f.region.y >= page.shotH;
              return (
                <li
                  key={`${f.law}-${i}`}
                  data-finding={i}
                  className={`${styles.finding} ${isSel ? styles.findingSel : ""}`}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered((h) => (h === i ? -1 : h))}
                >
                  <button
                    type="button"
                    className={styles.findingBtn}
                    onClick={() => select(i, "row")}
                    aria-expanded={isSel}
                  >
                    <span className={`${styles.num} ${isSel ? styles.numSel : ""}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.sevChip} style={SEV_STYLE[f.sev]}>
                      {f.sev.toUpperCase()}
                    </span>
                    <span className={styles.title}>{f.title}</span>
                    {/* A bare "+" promised nothing. The title is already a whole
                        sentence, so a reader has no way to know anything is
                        behind it. One word is enough to say something is. */}
                    <span className={`${styles.toggle} ${isSel ? styles.toggleOpen : ""}`}>
                      {isSel ? "close" : "why"}
                      <span className={styles.toggleGlyph}>{isSel ? "−" : "+"}</span>
                    </span>
                  </button>
                  {isSel && (
                    <div className={styles.detail}>
                      {shot && (
                        // eslint-disable-next-line @next/next/no-img-element -- see the map above
                        <img
                          className={styles.shot}
                          src={shot}
                          alt={`Screenshot of the problem: ${f.title}`}
                        />
                      )}
                      <div className={styles.why}>{f.why}</div>
                      <div className={styles.fixBox}>
                        <span className={styles.fixLabel}>Fix → </span>
                        {f.fix}
                      </div>
                      <div className={styles.meta}>
                        <span className={styles.effort} style={effort.style}>
                          {effort.label}
                        </span>
                        <a
                          className={styles.lawLink}
                          href={f.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Law of UX: {f.law} ↗
                        </a>
                        {offMap && (
                          <span className={styles.offMap}>
                            further down than the screenshot reaches
                          </span>
                        )}
                        <button
                          type="button"
                          className={styles.shareLink}
                          onClick={() => openShare(i)}
                          disabled={shareBusy}
                        >
                          {shareBusy ? "building…" : "share this finding"}
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}

            {/* The finding Cooper couldn't write. Visually one of the list —
                same anatomy, next number in the sequence — but it does not
                pretend to be a finding: the chip says NOT TESTED, and the title
                names what the mini roast never reached. Dark and accent-edged
                on purpose; this is the one card allowed to shout. */}
            <li className={styles.locked} ref={ctaRef}>
              <div className={styles.lockedRow}>
                <span className={styles.lockedNum}>
                  {String(findings.length + 1).padStart(2, "0")}
                </span>
                <span className={styles.lockedChip}>NOT TESTED</span>
                <span className={styles.lockedTitle}>
                  {surfacesAnd
                    ? `Your ${surfacesAnd}. Never tested.`
                    : "Everything past this page. Never tested."}
                </span>
              </div>
              <div className={styles.lockedDetail}>
                <p className={styles.lockedWhy}>
                  This roast read one page and stopped. The full roast makes itself a throwaway
                  account and walks your whole product the way a first-time user would, filing
                  evidence at every step.
                </p>
                <ul className={styles.lockedList}>
                  {[
                    surfacesAnd
                      ? `walks your ${surfacesAnd}, end to end`
                      : "walks signup, search and checkout, end to end",
                    "maps every page the way this one was mapped",
                    "turns each finding into a ticket for Jira or Linear",
                  ].map((line) => (
                    <li className={styles.lockedItem} key={line}>
                      <span className={styles.lockedArrow}>→</span>
                      {line}
                    </li>
                  ))}
                </ul>
                <a
                  className={styles.lockedCta}
                  href={pricingHref}
                  onClick={() =>
                    track("roast_upsell_clicked", {
                      url,
                      run_id: runId,
                      site_type: site.siteType,
                      surfaces: site.untestedSurfaces.length,
                      surfaces_list: site.untestedSurfaces.join(", ") || null,
                      via: "report",
                    })
                  }
                >
                  See what the full roast covers →
                </a>
              </div>
            </li>
          </ol>

          <p className={styles.foot}>
            This report is unlisted, not private: anyone with the link can read it. Roasts are kept
            for 90 days. <a href="/">Roast your own site →</a>
          </p>
        </section>
      </div>

      {share && (
        <div className={styles.sheet} onClick={() => setShare(null)}>
          <div className={styles.sheetCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sheetTitle}>Share this finding</div>
            {/* eslint-disable-next-line @next/next/no-img-element -- a canvas data: URI */}
            <img className={styles.sheetImg} src={share.dataUrl} alt="Share card preview" />
            <div className={styles.sheetActions}>
              <button
                className={`${styles.sheetBtn} ${styles.sheetBtnPrimary}`}
                onClick={() => shareAction("copy")}
                type="button"
              >
                {shareCopied ? "Copied" : "Copy image"}
              </button>
              <button
                className={styles.sheetBtn}
                onClick={() => shareAction("download")}
                type="button"
              >
                Download
              </button>
              <button className={styles.sheetClose} onClick={() => setShare(null)} type="button">
                close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
