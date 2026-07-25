import type { CSSProperties } from "react";
import type { Severity, Effort } from "./findings";

// What a live Cooper roast hands the UI. Cooper's own payload uses different
// names for two of these (`law_name` and `ref`); /api/roast maps them, so the
// browser only ever sees this shape.
//
// Not called `Finding` — `findings.ts` already owns that name for the scripted
// marketing mockup, which is a different shape (cat/rule/shot). These are two
// genuinely different things that both happen to be "a finding".
export type RoastFinding = {
  sev: Severity;
  law: string; // display name of the Law of UX, e.g. "Hick's Law"
  title: string;
  why: string;
  fix: string;
  effort: Effort;
  url: string; // lawsofux.com reference for this law
  // The evidence: an id into RoastResult.shots, for the image of the offending
  // region that Cooper outlined in red during the run. Null when the agent had
  // nothing single to point at.
  //
  // An id rather than the image itself, because findings share: every "the page
  // as a whole is a mess" finding cites the same whole-page shot. Inlining the
  // URI here duplicated that image once per finding — on a real run, three
  // findings citing one 1.5 MB page shot would be 6 MB of base64 in a response
  // Vercel caps at 4.5 MB. The id keeps the response O(unique images).
  shot: string | null;
  // Where on the page the evidence sits, in the page's own CSS pixels measured
  // from the top-left of the document. Read against `RoastResult.page` it
  // becomes a percentage, which is the only form that survives the map being
  // displayed at some width nobody knew at capture time.
  //
  // Null when there's no shot to locate, and independently null on any roast
  // taken before Cooper started reporting regions — a reader that treats that
  // as an error would break every archived run.
  region: Region | null;
};

export type Region = { x: number; y: number; w: number; h: number };

// The whole-page screenshot every finding points at, and the coordinate space
// its regions are expressed in.
//
// `shotH` is not `h`: Cooper caps the map's height, so on a very long page the
// image stops before the document does. A finding below that line has a region
// with nowhere to be drawn, and saying so is better than drawing it at the
// bottom edge and being quietly wrong.
export type PageMap = {
  shot: string; // an id into RoastResult.shots, like a finding's
  w: number;
  h: number;
  shotH: number;
};

// Shot id -> image source: a data: URI on a live roast, a same-origin URL on a
// stored one. Sent once per image, however many findings cite it.
export type RoastShots = Record<string, string>;

// What Cooper learned about the site beyond the findings: what kind of site it
// is, and which of its own surfaces the mini roast saw but never tested
// ("pricing page", "signup flow"). Fuels the personalized upsell copy. Both
// empty when an older Cooper (or a dropped field) is serving — every consumer
// must read that as "use the generic copy", never as an error.
export type SiteContext = {
  siteType: string | null; // ≤40 chars, enforced by Cooper and re-checked here
  untestedSurfaces: string[]; // ≤3 items, each ≤32 chars — same deal
};

export const EMPTY_SITE_CONTEXT: SiteContext = { siteType: null, untestedSurfaces: [] };

// Prose-join for CTA copy: ["pricing page","signup flow","checkout"] →
// "pricing page, signup flow or checkout". Empty string when there's nothing —
// callers use that as the fall-back-to-generic-copy signal.
export function joinSurfaces(surfaces: string[], conjunction: "and" | "or" = "or"): string {
  if (surfaces.length <= 1) return surfaces[0] ?? "";
  return `${surfaces.slice(0, -1).join(", ")} ${conjunction} ${surfaces[surfaces.length - 1]}`;
}

// Every way a roast can end. The scripted reddit demo only ever had one — a
// live agent has four, and the UI owes each of them an honest answer.
export type RoastResult =
  // The agent reviewed the page and found problems.
  | {
      status: "findings";
      findings: RoastFinding[];
      shots: RoastShots;
      durationMs: number | null;
      site: SiteContext;
      // The map the findings are drawn on. Null when the render produced no
      // whole-page shot, in which case the report falls back to the crops.
      page: PageMap | null;
      // Cooper's id for the archived copy of this run, and so the address of
      // its permalink: /r/<runId>. Null when Cooper isn't archiving, which is
      // every local dev run — the report still renders, it just can't be linked.
      runId: string | null;
    }
  // The agent reviewed the page and it was clean. A real verdict, not a failure.
  | { status: "clean"; durationMs: number | null; site: SiteContext; runId: string | null }
  // The agent couldn't see the page: bot wall, blank SPA shell, paywall.
  // Common and expected — Cooper is designed to abstain rather than invent.
  | { status: "cannot_review"; reason: string }
  // Something broke: the agent crashed, timed out, or the URL was rejected.
  | { status: "error"; message: string };

// Severity chip styling (Blocker = accent fill, Major = yellow fill,
// Minor = hollow).
export const SEV_STYLE: Record<Severity, CSSProperties> = {
  Blocker: { background: "var(--accent-strong)", color: "#fff", border: "1px solid var(--accent-strong)" },
  Major: { background: "var(--yellow)", color: "var(--ink)", border: "1px solid var(--yellow)" },
  Minor: { background: "transparent", color: "var(--text-muted)", border: "1px solid #cfc8ba" },
};

export const EFFORT_STYLE: Record<Effort, { label: string; style: CSSProperties }> = {
  "Quick win": {
    label: "⚡ Quick win",
    style: { background: "#e7f0e9", color: "#2f6b46" },
  },
  "Deep fix": {
    label: "⚒ Deep fix",
    style: { background: "#f3e9e4", color: "#9a4a2c" },
  },
};

// Severity tally for the results header, e.g. "1 Blocker · 3 Major · 2 Minor".
export function severityTally(findings: RoastFinding[]): { sev: Severity; count: number }[] {
  const order: Severity[] = ["Blocker", "Major", "Minor"];
  return order
    .map((sev) => ({ sev, count: findings.filter((f) => f.sev === sev).length }))
    .filter((entry) => entry.count > 0);
}
