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
import type { RoastFinding, RoastResult, RoastShots } from "@/app/data/roast";

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
  shot?: unknown;
};

export type CooperPayload = {
  url?: unknown;
  generated_at?: unknown;
  error?: unknown;
  cannot_review?: unknown;
  duration_ms?: unknown;
  cost_usd?: unknown;
  findings?: unknown;
  shots?: unknown; // id -> PNG/JPEG data URI; findings reference these by id
};

const SEVERITIES: Severity[] = ["Blocker", "Major", "Minor"];
const EFFORTS: Effort[] = ["Quick win", "Deep fix"];
const SEV_ORDER: Record<Severity, number> = { Blocker: 0, Major: 1, Minor: 2 };

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

// A shot is a base64 image that goes straight into an <img src>. Same rule as
// the law link below: never hand the browser an unvetted URL. `data:` is the one
// scheme where a wrong answer is quiet — `data:text/html,<script>…` in an <img>
// is inert, but the same string elsewhere isn't, and this value gets forwarded.
// So: exact prefix, and a strict base64 alphabet after it — not a substring
// check, not a `startsWith` on a lowercased copy.
//
// PNG and JPEG only, and only these two: Cooper sends crops as PNG (small, all
// text) and the whole-page overview as JPEG (huge, shown at thumbnail size).
// Nothing else is allowed in — notably not SVG, which is a script vector.
const IMG_DATA_URI = /^data:image\/(png|jpeg);base64,[A-Za-z0-9+/]+={0,2}$/;

// Cooper sends images once in a `shots` map and has findings reference them by
// id, because several findings legitimately share one image (every "the whole
// page is a mess" finding cites "page"). Keep that shape all the way to the
// browser: resolving to per-finding URIs here would re-duplicate the very bytes
// the map exists to send once, in the response that has the 4.5 MB ceiling.
//
// Validate on the way through — every value here is destined for an <img src>.
function shotTable(v: unknown): RoastShots {
  const table: RoastShots = {};
  if (!v || typeof v !== "object" || Array.isArray(v)) return table;
  for (const [id, uri] of Object.entries(v as Record<string, unknown>)) {
    if (typeof uri === "string" && IMG_DATA_URI.test(uri)) table[id] = uri;
  }
  return table;
}

// Cooper validates the cited `law` against its catalog but NOT sev/effort —
// those are prompt-enforced only, so a model typo reaches us intact. Validate
// both here rather than casting: an unknown severity would index into
// SEV_STYLE and render `undefined` styles on a real user's screen.
function toFinding(raw: CooperFinding, shots: RoastShots): RoastFinding | null {
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
    // Keep the id, not the image. An id naming a shot that didn't survive
    // validation (or Cooper's byte budget) is cleared here, so the UI never
    // holds a reference to a picture that isn't in `shots`.
    shot: shots[str(raw.shot)] ? str(raw.shot) : null,
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

  const shots = shotTable(payload.shots);
  const raw = Array.isArray(payload.findings) ? (payload.findings as CooperFinding[]) : [];
  const findings = raw
    .map((f) => toFinding(f, shots))
    .filter((f): f is RoastFinding => f !== null)
    .sort((a, b) => SEV_ORDER[a.sev] - SEV_ORDER[b.sev]);

  // No findings and no abstention is a real, positive verdict — the page is
  // clean. Do not dress it up as an error.
  if (findings.length === 0) return { status: "clean", durationMs };

  // Only ship images something actually cites: a shot whose finding was dropped
  // for a bad severity would otherwise be pure weight in a capped response.
  const cited = new Set(findings.map((f) => f.shot).filter(Boolean));
  const used: RoastShots = {};
  for (const [id, uri] of Object.entries(shots)) {
    if (cited.has(id)) used[id] = uri;
  }

  return { status: "findings", findings, shots: used, durationMs };
}
