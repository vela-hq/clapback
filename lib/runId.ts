// The two patterns that guard the roast archive, and nothing else.
//
// Split out of `roastStore.ts` for the same reason `cooperSchema.ts` is split
// out of `cooper.ts`: this half is pure, has no imports and holds no
// credentials, so `npm test` can load it without a GCP identity. The half that
// can leak something stays `server-only`.
//
// These two regexes are the whole security story of the archive. A run id and a
// shot filename both arrive as URL path segments — typed by whoever followed
// the link — and both get concatenated into a bucket object name. Nothing else
// stands between the two.

// `20260724T223610Z-0ba58a0d1c2f3e4b`: Cooper's UTC stamp, a dash, and hex.
// Anchored at both ends, fixed-width stamp, lower hex only. No dots, no
// slashes, no percent-escapes, so nothing an accepted id can do will climb out
// of `runs/<id>/` and read some other object.
const RUN_ID = /^\d{8}T\d{6}Z-[0-9a-f]{8,32}$/;

// A shot's bare filename inside its run, e.g. `f1.png`. Same alphabet as
// `SHOT_OBJECT_PATH` in cooperSchema.ts, minus the `shots/` prefix — keep the
// two in step. PNG and JPEG only: those are the two things Cooper writes, and
// an extension allowlist is also what decides the Content-Type we serve.
const SHOT_FILE = /^[A-Za-z0-9_-]{1,64}\.(png|jpe?g)$/;

/** True if `id` is a well-formed Cooper run id. Every path segment that reaches
 *  the archive goes through here first. */
export function isRunId(id: string): boolean {
  return RUN_ID.test(id);
}

/** True if `file` is a shot filename we are willing to fetch. Bare filename
 *  only — a path, even a legal-looking one, is not one of these. */
export function isShotFile(file: string): boolean {
  return SHOT_FILE.test(file);
}

/** The instant baked into a run id, as an ISO string, or null if `runId` is not
 *  one. Cooper stamps the id in UTC when the run starts, so this is a usable
 *  date even for archived payloads written before Cooper sent `generated_at`. */
export function runIdTime(runId: string): string | null {
  if (!isRunId(runId)) return null;
  // 20260724T223610Z -> 2026-07-24T22:36:10Z
  const s = runId.slice(0, 16);
  const iso =
    `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}` +
    `T${s.slice(9, 11)}:${s.slice(11, 13)}:${s.slice(13, 15)}Z`;
  // The pattern only proves the digits are digits, not that they are a date:
  // `20261340T...` matches and is not a month. Date.parse is the cheapest way
  // to find that out.
  return Number.isNaN(Date.parse(iso)) ? null : iso;
}
