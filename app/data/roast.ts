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
};

// Shot id -> image data: URI. Sent once per image, however many findings cite it.
export type RoastShots = Record<string, string>;

// Every way a roast can end. The scripted reddit demo only ever had one — a
// live agent has four, and the UI owes each of them an honest answer.
export type RoastResult =
  // The agent reviewed the page and found problems.
  | {
      status: "findings";
      findings: RoastFinding[];
      shots: RoastShots;
      durationMs: number | null;
    }
  // The agent reviewed the page and it was clean. A real verdict, not a failure.
  | { status: "clean"; durationMs: number | null }
  // The agent couldn't see the page: bot wall, blank SPA shell, paywall.
  // Common and expected — Cooper is designed to abstain rather than invent.
  | { status: "cannot_review"; reason: string }
  // Something broke: the agent crashed, timed out, or the URL was rejected.
  | { status: "error"; message: string };

// Severity chip styling (Blocker = accent fill, Major = yellow fill,
// Minor = hollow).
export const SEV_STYLE: Record<Severity, CSSProperties> = {
  Blocker: { background: "var(--accent)", color: "#fff", border: "1px solid var(--accent)" },
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
