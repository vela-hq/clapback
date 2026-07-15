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
