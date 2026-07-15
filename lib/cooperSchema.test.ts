// Tests for the Cooper -> ClapBack schema mapping.
//
//     npm test
//
// This mapping is the whole integration: Cooper's payload and the UI's shape
// are the same data under different names, and every field that gets renamed
// here is a field that renders wrong if the rename drifts. Cooper duplicates
// its own payload shape between server.py and report.py, so drift is not
// hypothetical — it has already happened once in that repo.
//
// The fixtures are real Cooper responses, trimmed.

import { test } from "node:test";
import assert from "node:assert/strict";
import { mapPayload } from "./cooperSchema.ts";
// Imported from cooperSchema, not cooper: the latter is `server-only` and
// refuses to load outside a server bundle. Keeping the mapping pure is what
// makes it testable at all.

// Straight from a live `GET /review?url=https://news.ycombinator.com`.
const HN_FINDING = {
  sev: "Major",
  law: "fittss-law",
  law_name: "Fitts's Law",
  title: "An upvote arrow the size of a breadcrumb",
  why: "The vote target is a handful of pixels...",
  fix: "Give the arrow a padded hit area...",
  effort: "Deep fix",
  ref: "https://lawsofux.com/fittss-law/",
};

test("renames Cooper's fields to the shape the UI renders", () => {
  const r = mapPayload({ findings: [HN_FINDING], duration_ms: 80328, cost_usd: 0.23 });
  assert.equal(r.status, "findings");
  if (r.status !== "findings") return;
  const f = r.findings[0];
  // law_name -> law: the UI shows "Fitts's Law", never the "fittss-law" slug.
  assert.equal(f.law, "Fitts's Law");
  // ref -> url
  assert.equal(f.url, "https://lawsofux.com/fittss-law/");
  assert.equal(f.sev, "Major");
  assert.equal(f.effort, "Deep fix");
  assert.equal(r.durationMs, 80328);
});

test("falls back to the slug when law_name is missing", () => {
  const r = mapPayload({ findings: [{ ...HN_FINDING, law_name: undefined }] });
  assert.equal(r.status, "findings");
  if (r.status !== "findings") return;
  assert.equal(r.findings[0].law, "fittss-law");
});

test("drops findings with an unknown severity or effort", () => {
  // Cooper validates the cited `law` against its catalog but NOT sev/effort —
  // those are prompt-enforced only, so a model typo arrives intact. An unknown
  // severity would index into SEV_STYLE and render undefined styles.
  const r = mapPayload({
    findings: [
      HN_FINDING,
      { ...HN_FINDING, sev: "Critical", title: "bogus sev" },
      { ...HN_FINDING, effort: "Medium", title: "bogus effort" },
      { ...HN_FINDING, title: "" },
    ],
  });
  assert.equal(r.status, "findings");
  if (r.status !== "findings") return;
  assert.equal(r.findings.length, 1);
  assert.equal(r.findings[0].title, HN_FINDING.title);
});

test("accepts severity and effort case-insensitively", () => {
  const r = mapPayload({ findings: [{ ...HN_FINDING, sev: "major", effort: "deep fix" }] });
  assert.equal(r.status, "findings");
  if (r.status !== "findings") return;
  assert.equal(r.findings[0].sev, "Major");
  assert.equal(r.findings[0].effort, "Deep fix");
});

test("sorts Blocker before Major before Minor", () => {
  const r = mapPayload({
    findings: [
      { ...HN_FINDING, sev: "Minor", title: "c" },
      { ...HN_FINDING, sev: "Blocker", title: "a" },
      { ...HN_FINDING, sev: "Major", title: "b" },
    ],
  });
  assert.equal(r.status, "findings");
  if (r.status !== "findings") return;
  assert.deepEqual(r.findings.map((f) => f.title), ["a", "b", "c"]);
});

test("replaces a non-http law ref rather than rendering a broken link", () => {
  const r = mapPayload({ findings: [{ ...HN_FINDING, ref: "javascript:alert(1)" }] });
  assert.equal(r.status, "findings");
  if (r.status !== "findings") return;
  assert.equal(r.findings[0].url, "https://lawsofux.com/");
});

test("an empty findings array is a clean verdict, not a failure", () => {
  // The page was reviewed and nothing was wrong. Real, positive, and easy to
  // mistake for an error since it looks identical to an abstention.
  const r = mapPayload({ findings: [], duration_ms: 37959, cost_usd: 0.24 });
  assert.equal(r.status, "clean");
});

test("distinguishes an abstention from a clean verdict", () => {
  const r = mapPayload({
    findings: [],
    cannot_review: "The page returned a login wall with no readable content.",
  });
  assert.equal(r.status, "cannot_review");
  if (r.status !== "cannot_review") return;
  assert.match(r.reason, /login wall/);
});

test("an error outranks everything else", () => {
  // A crashed run carries zero findings, exactly like a clean one. Reading
  // `error` first is what keeps a crash from being reported as "nothing wrong".
  const r = mapPayload({
    error: "RuntimeError('No parseable result from the agent')",
    findings: [],
    cannot_review: null,
  });
  assert.equal(r.status, "error");
});

test("survives a payload with junk in it", () => {
  assert.equal(mapPayload({}).status, "clean");
  assert.equal(mapPayload({ findings: "not-an-array" }).status, "clean");
  assert.equal(mapPayload({ findings: [null, 42, "x"] as never }).status, "clean");
});

// --- Screenshots ------------------------------------------------------------
//
// `shot` is the one field that reaches the DOM as a URL rather than as text, so
// it gets the same distrust as the law link: an allowlist, not a sanitiser.
// Cooper is ours, but "the producer is trustworthy" is exactly the assumption
// that stops being true the day it isn't, and this value is forwarded verbatim
// into an <img src>.

const PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==";
const JPEG = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ==";

test("a finding keeps its shot id, and the image rides in shots", () => {
  const r = mapPayload({ findings: [{ ...HN_FINDING, shot: "f1" }], shots: { f1: PNG } });
  assert.equal(r.status, "findings");
  if (r.status !== "findings") return;
  assert.equal(r.findings[0].shot, "f1");
  assert.equal(r.shots.f1, PNG);
});

test("several findings share one image, and it is serialised exactly once", () => {
  // The whole-page shot is cited by every finding about the page as a whole.
  // Inlining it per finding is what put a real payload at 88% of Vercel's
  // 4.5 MB response ceiling, so this is a size guarantee, not a style choice.
  const r = mapPayload({
    findings: [
      { ...HN_FINDING, title: "a", shot: "page" },
      { ...HN_FINDING, title: "b", shot: "page" },
      { ...HN_FINDING, title: "c", shot: "page" },
    ],
    shots: { page: PNG },
  });
  assert.equal(r.status, "findings");
  if (r.status !== "findings") return;
  assert.deepEqual(r.findings.map((f) => f.shot), ["page", "page", "page"]);
  assert.equal(Object.keys(r.shots).length, 1);
  // The bytes appear once in the wire form, however many findings cite them.
  const occurrences = JSON.stringify(r).split(PNG).length - 1;
  assert.equal(occurrences, 1, "image must not be duplicated per finding");
});

test("a shot id with no matching image is just no picture", () => {
  const r = mapPayload({ findings: [{ ...HN_FINDING, shot: "nope" }], shots: { f1: PNG } });
  assert.equal(r.status, "findings");
  if (r.status !== "findings") return;
  assert.equal(r.findings[0].shot, null);
});

test("a finding with no screenshot is null, not undefined or empty", () => {
  const r = mapPayload({ findings: [HN_FINDING], shots: {} });
  assert.equal(r.status, "findings");
  if (r.status !== "findings") return;
  // The UI branches on `f.shot &&`, so null is the contract; undefined would
  // typecheck against `string | null` only by accident.
  assert.equal(r.findings[0].shot, null);
});

test("rejects anything that is not a base64 PNG data URI", () => {
  const attacks = [
    "javascript:alert(1)",
    "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==",
    "data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9YWxlcnQoMSk+", // SVG scripts
    "https://evil.example/tracker.png", // a beacon, and a request we never make
    " data:image/png;base64,iVBORw0KG", // leading space
    "data:image/png;base64,iVBOR w0KG", // whitespace smuggled into the payload
    "data:image/png;base64,<script>", // non-base64 payload
    "DATA:IMAGE/PNG;BASE64,iVBORw0KG", // prefix must match exactly
    "x=data:image/png;base64,iVBORw0KG", // prefix must be at the start
    "",
    null,
    42,
    {},
  ];
  for (const evil of attacks) {
    const r = mapPayload({
      findings: [{ ...HN_FINDING, shot: "f1" }],
      shots: { f1: evil } as never,
    });
    assert.equal(r.status, "findings");
    if (r.status !== "findings") continue;
    assert.equal(r.findings[0].shot, null, `should have rejected: ${String(evil)}`);
    assert.deepEqual(r.shots, {}, `rejected image must not ship: ${String(evil)}`);
  }
});

test("a bad screenshot never takes the finding down with it", () => {
  // The roast is the product; the picture is a bonus. Dropping a real finding
  // because its evidence was malformed would be the wrong trade.
  const r = mapPayload({
    findings: [{ ...HN_FINDING, shot: "f1" }],
    shots: { f1: "javascript:alert(1)" },
  });
  assert.equal(r.status, "findings");
  if (r.status !== "findings") return;
  assert.equal(r.findings.length, 1);
  assert.equal(r.findings[0].title, HN_FINDING.title);
});

test("survives a junk shots table", () => {
  for (const shots of [null, 42, "nope", [], { f1: null }, { f1: {} }] as never[]) {
    const r = mapPayload({ findings: [{ ...HN_FINDING, shot: "f1" }], shots });
    assert.equal(r.status, "findings");
    if (r.status !== "findings") continue;
    assert.equal(r.findings[0].shot, null);
  }
});

test("accepts the JPEG whole-page shot, not just PNG crops", () => {
  // Cooper sends crops as PNG and the page overview as JPEG — an 8 MB PNG page
  // shot pushed a real payload to 29.7 MB against a 32 MB limit. If this
  // regex only knew PNG, the page shot would vanish with no error anywhere.
  const r = mapPayload({ findings: [{ ...HN_FINDING, shot: "page" }], shots: { page: JPEG } });
  assert.equal(r.status, "findings");
  if (r.status !== "findings") return;
  assert.equal(r.shots.page, JPEG);
});

test("still refuses image types that carry script", () => {
  for (const evil of [
    "data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9YWxlcnQoMSk+",
    "data:image/gif;base64,R0lGODlhAQ==",
    "data:image/webp;base64,UklGRg==",
  ]) {
    const r = mapPayload({ findings: [{ ...HN_FINDING, shot: "f1" }], shots: { f1: evil } });
    assert.equal(r.status, "findings");
    if (r.status !== "findings") continue;
    assert.equal(r.findings[0].shot, null, `should have rejected: ${evil}`);
    assert.deepEqual(r.shots, {}, `rejected image must not ship: ${evil}`);
  }
});
