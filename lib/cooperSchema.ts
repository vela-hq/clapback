// Cooper's wire format, and the translation into what the UI renders.
//
// Split out from `cooper.ts` deliberately: this half is pure and holds no
// secrets, so it stays importable by tests. `cooper.ts` is `server-only`
// because it carries credentials — that guard belongs on the module that can
// leak something, not on a pure function.
//
// The two shapes are the same data under different names. Cooper duplicates its
// payload shape between server.py and report.py with no shared serializer, and
// those two have already drifted once — so treat everything arriving here as
// untrusted and validate it, rather than casting and hoping.

import type { Severity, Effort } from "@/app/data/findings";
import type { RoastFinding, RoastResult } from "@/app/data/roast";

// `law` is the slug ("hicks-law"), `law_name` the display name ("Hick's Law"),
// and the lawsofux.com link is `ref` rather than `url`.
export type CooperFinding = {
  sev?: unknown;
  law?: unknown;
  law_name?: unknown;
  title?: unknown;
  why?: unknown;
  fix?: unknown;
  effort?: unknown;
  ref?: unknown;
};

export type CooperPayload = {
  url?: unknown;
  generated_at?: unknown;
  error?: unknown;
  cannot_review?: unknown;
  duration_ms?: unknown;
  cost_usd?: unknown;
  findings?: unknown;
};

const SEVERITIES: Severity[] = ["Blocker", "Major", "Minor"];
const EFFORTS: Effort[] = ["Quick win", "Deep fix"];
const SEV_ORDER: Record<Severity, number> = { Blocker: 0, Major: 1, Minor: 2 };

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

// Cooper validates the cited `law` against its catalog but NOT sev/effort —
// those are prompt-enforced only, so a model typo reaches us intact. Validate
// both here rather than casting: an unknown severity would index into
// SEV_STYLE and render `undefined` styles on a real user's screen.
function toFinding(raw: CooperFinding): RoastFinding | null {
  if (!raw || typeof raw !== "object") return null;

  const sev = SEVERITIES.find((s) => s.toLowerCase() === str(raw.sev).toLowerCase());
  const effort = EFFORTS.find((e) => e.toLowerCase() === str(raw.effort).toLowerCase());
  const title = str(raw.title);
  // law_name is derived from Cooper's catalog, so it is the trustworthy one;
  // fall back to the slug only if it somehow sent none.
  const law = str(raw.law_name) || str(raw.law);

  if (!sev || !effort || !title || !law) return null;

  const ref = str(raw.ref);
  return {
    sev,
    law,
    title,
    why: str(raw.why),
    fix: str(raw.fix),
    effort,
    // Never hand the browser an unvetted href — this one goes into an <a>.
    url: /^https?:\/\//i.test(ref) ? ref : "https://lawsofux.com/",
  };
}

export function mapPayload(payload: CooperPayload): RoastResult {
  const durationMs = typeof payload.duration_ms === "number" ? payload.duration_ms : null;

  // Order matters: a crashed run and an abstention both carry zero findings,
  // and neither is the same thing to a user as "your page is fine".
  const error = str(payload.error);
  if (error) return { status: "error", message: error };

  const cannotReview = str(payload.cannot_review);
  if (cannotReview) return { status: "cannot_review", reason: cannotReview };

  const raw = Array.isArray(payload.findings) ? (payload.findings as CooperFinding[]) : [];
  const findings = raw
    .map(toFinding)
    .filter((f): f is RoastFinding => f !== null)
    .sort((a, b) => SEV_ORDER[a.sev] - SEV_ORDER[b.sev]);

  // No findings and no abstention is a real, positive verdict — the page is
  // clean. Do not dress it up as an error.
  if (findings.length === 0) return { status: "clean", durationMs };

  return { status: "findings", findings, durationMs };
}
