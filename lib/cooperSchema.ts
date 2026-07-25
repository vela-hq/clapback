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
import type {
  PageMap,
  Region,
  RoastFinding,
  RoastResult,
  RoastShots,
  SiteContext,
} from "@/app/data/roast";

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
  region?: unknown; // {x,y,w,h} in the page's own CSS px, document-relative
};

export type CooperPayload = {
  url?: unknown;
  run_id?: unknown; // the archived copy's id, and so the permalink's address
  generated_at?: unknown;
  error?: unknown;
  cannot_review?: unknown;
  duration_ms?: unknown;
  cost_usd?: unknown;
  site_type?: unknown; // "SaaS landing page" — what the agent judged the site to be
  untested_surfaces?: unknown; // ["pricing page", ...] — seen but not reviewed
  page?: unknown; // {shot,w,h,shot_h} — the whole-page map regions are drawn on
  findings?: unknown;
  shots?: unknown; // id -> PNG/JPEG data URI; findings reference these by id
};

const SEVERITIES: Severity[] = ["Blocker", "Major", "Minor"];
const EFFORTS: Effort[] = ["Quick win", "Deep fix"];
const SEV_ORDER: Record<Severity, number> = { Blocker: 0, Major: 1, Minor: 2 };

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

// Cooper enforces these caps at parse time (see agent.rs), so anything longer
// arriving here didn't come from a well-behaved Cooper — drop it the same way
// rather than let an over-long phrase blow up a one-line CTA. Values land
// verbatim in rendered copy, so the caps are also the XSS-adjacent size guard.
const SITE_TYPE_MAX = 40;
const SURFACE_MAX = 32;
const MAX_SURFACES = 3;

function siteContext(payload: CooperPayload): SiteContext {
  const rawType = str(payload.site_type);
  const siteType = rawType && rawType.length <= SITE_TYPE_MAX ? rawType : null;
  const untestedSurfaces = Array.isArray(payload.untested_surfaces)
    ? (payload.untested_surfaces as unknown[])
        .map((v) => str(v))
        .filter((s) => s.length > 0 && s.length <= SURFACE_MAX)
        .slice(0, MAX_SURFACES)
    : [];
  return { siteType, untestedSurfaces };
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

// The same images, as an archived run names them: object paths relative to the
// run's prefix in the bucket (`shots/f1.png`). A stored roast carries these
// instead of data URIs, and they end up in a URL this app then fetches — so the
// alphabet is deliberately narrow. No dots beyond the extension, no slashes
// beyond the one, nothing that could climb out of the run's own prefix.
const SHOT_OBJECT_PATH = /^shots\/[A-Za-z0-9_-]{1,64}\.(png|jpe?g)$/;

// Turn one archived shot's object path into something an <img src> can load.
// Returning null drops the shot, which the reader already handles: a finding
// whose picture didn't survive keeps the finding.
export type ShotResolver = (objectPath: string) => string | null;

function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

// A rectangle is only useful if all four numbers arrived and the box has area.
// A zero-width region would render as an invisible marker on the map — worse
// than no marker, because the finding would look like it had been placed.
function toRegion(v: unknown): Region | null {
  if (!v || typeof v !== "object" || Array.isArray(v)) return null;
  const r = v as Record<string, unknown>;
  const [x, y, w, h] = [num(r.x), num(r.y), num(r.w), num(r.h)];
  if (x === null || y === null || w === null || h === null) return null;
  if (x < 0 || y < 0 || w <= 0 || h <= 0) return null;
  return { x, y, w, h };
}

// The page every region is measured against. Rejected outright unless the shot
// it names actually made it through validation: dimensions with no image behind
// them would give the reader a coordinate space and nothing to draw it on.
function pageMap(v: unknown, shots: RoastShots): PageMap | null {
  if (!v || typeof v !== "object" || Array.isArray(v)) return null;
  const p = v as Record<string, unknown>;
  const shot = str(p.shot);
  const [w, h] = [num(p.w), num(p.h)];
  if (!shots[shot] || w === null || h === null || w <= 0 || h <= 0) return null;
  // Cooper caps the map's height, so `shot_h` is how far down the image really
  // reaches. Missing (or nonsense) means an older payload where the map was
  // never capped — the whole page is the honest answer there.
  const shotH = num(p.shot_h);
  return { shot, w, h, shotH: shotH !== null && shotH > 0 ? Math.min(shotH, h) : h };
}

// Cooper sends images once in a `shots` map and has findings reference them by
// id, because several findings legitimately share one image (every "the whole
// page is a mess" finding cites "page"). Keep that shape all the way to the
// browser: resolving to per-finding URIs here would re-duplicate the very bytes
// the map exists to send once, in the response that has the 4.5 MB ceiling.
//
// Validate on the way through — every value here is destined for an <img src>.
//
// A live roast carries the bytes inline; an archived one carries object paths
// and a `resolve` that turns them into URLs this app serves. Which of the two a
// payload is speaking is the caller's knowledge, not a guess made from the
// value's shape — a payload that claims to be inline and isn't should lose its
// images, not be reinterpreted.
function shotTable(v: unknown, resolve?: ShotResolver): RoastShots {
  const table: RoastShots = {};
  if (!v || typeof v !== "object" || Array.isArray(v)) return table;
  for (const [id, raw] of Object.entries(v as Record<string, unknown>)) {
    if (typeof raw !== "string") continue;
    if (resolve) {
      if (!SHOT_OBJECT_PATH.test(raw)) continue;
      const src = resolve(raw);
      if (src) table[id] = src;
    } else if (IMG_DATA_URI.test(raw)) {
      table[id] = raw;
    }
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
    // The region survives its shot: it is where the finding lives on the page,
    // not a property of the picture. A crop dropped for the byte budget still
    // gets a marker on the map, and the reader can cut its own close-up from
    // the map's pixels. Losing the crop should cost detail, not location.
    region: toRegion(raw.region),
  };
}

export function mapPayload(
  payload: CooperPayload,
  opts: { resolveShot?: ShotResolver } = {},
): RoastResult {
  const durationMs = typeof payload.duration_ms === "number" ? payload.duration_ms : null;
  const runId = str(payload.run_id) || null;

  // Order matters: a crashed run and an abstention both carry zero findings,
  // and neither is the same thing to a user as "your page is fine".
  const error = str(payload.error);
  if (error) return { status: "error", message: error };

  const cannotReview = str(payload.cannot_review);
  if (cannotReview) return { status: "cannot_review", reason: cannotReview };

  const shots = shotTable(payload.shots, opts.resolveShot);
  const raw = Array.isArray(payload.findings) ? (payload.findings as CooperFinding[]) : [];
  const findings = raw
    .map((f) => toFinding(f, shots))
    .filter((f): f is RoastFinding => f !== null)
    .sort((a, b) => SEV_ORDER[a.sev] - SEV_ORDER[b.sev]);

  const site = siteContext(payload);

  // No findings and no abstention is a real, positive verdict — the page is
  // clean. Do not dress it up as an error.
  if (findings.length === 0) return { status: "clean", durationMs, site, runId };

  const page = pageMap(payload.page, shots);

  // Only ship images something actually cites: a shot whose finding was dropped
  // for a bad severity would otherwise be pure weight in a capped response. The
  // map is the exception — no finding cites it, and it is what they all point
  // at, so it is kept by name.
  const cited = new Set(findings.map((f) => f.shot).filter(Boolean));
  if (page) cited.add(page.shot);
  const used: RoastShots = {};
  for (const [id, uri] of Object.entries(shots)) {
    if (cited.has(id)) used[id] = uri;
  }

  return { status: "findings", findings, shots: used, durationMs, site, page, runId };
}
