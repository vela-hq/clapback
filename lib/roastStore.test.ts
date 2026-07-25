// Tests for the roast archive's id and filename guards.
//
//     npm test
//
// Same setup as urlguard.test.ts: node's built-in runner with native type
// stripping, no jest, no vitest. Only `runId.ts` is imported — it is pure and
// import-free by design, so nothing here needs a GCP credential, a network, or
// a bucket. `roastStore.ts` itself is `server-only` and cannot be loaded from a
// plain node process at all.
//
// These two patterns are the only thing between a URL path segment somebody
// typed and a bucket object name, so they get tested like it.

import { test } from "node:test";
import assert from "node:assert/strict";
import { isRunId, isShotFile, runIdTime } from "./runId.ts";

test("accepts the run ids Cooper actually mints", () => {
  for (const id of [
    "20260724T223610Z-0ba58a0d1c2f3e4b", // a real archived run
    "20260101T000000Z-00000000",         // shortest hex tail we allow
    "20261231T235959Z-" + "a".repeat(32), // longest
  ]) {
    assert.equal(isRunId(id), true, `expected ${id} to be a run id`);
  }
});

test("rejects anything that could climb out of the run's prefix", () => {
  for (const id of [
    "../../secret",
    "20260724T223610Z-0ba58a0d1c2f3e4b/../../other",
    "runs/20260724T223610Z-0ba58a0d1c2f3e4b",
    "20260724T223610Z-0ba58a0d1c2f3e4b/run.json",
    "20260724T223610Z-0ba58a0d1c2f3e4b%2F..",
    "20260724T223610Z-0ba58a0d1c2f3e4b\n20260724T223610Z-0ba58a0d1c2f3e4b", // anchors must be ^$ not ^ alone
    "..%2F..%2Fetc",
  ]) {
    assert.equal(isRunId(id), false, `expected ${JSON.stringify(id)} to be rejected`);
  }
});

test("rejects near-misses on the shape", () => {
  for (const id of [
    "",
    "2026072T223610Z-0ba58a0d1c2f3e4b", // short date
    "20260724t223610z-0ba58a0d1c2f3e4b", // lowercase separators
    "20260724T223610-0ba58a0d1c2f3e4b", // no Z
    "20260724T223610Z0ba58a0d1c2f3e4b", // no dash
    "20260724T223610Z-0BA58A0D1C2F3E4B", // upper hex: Cooper writes lower
    "20260724T223610Z-0ba58a0d1c2f3e4z", // z is not hex
    "20260724T223610Z-0ba58a0", // hex tail too short
    "20260724T223610Z-" + "a".repeat(33), // too long
    " 20260724T223610Z-0ba58a0d1c2f3e4b", // leading space
  ]) {
    assert.equal(isRunId(id), false, `expected ${JSON.stringify(id)} to be rejected`);
  }
});

test("accepts the shot filenames Cooper writes", () => {
  for (const f of ["f1.png", "page_full.jpg", "page_full.jpeg", "a-b_c.png"]) {
    assert.equal(isShotFile(f), true, `expected ${f} to be a shot file`);
  }
});

test("rejects shot filenames that are really paths or other formats", () => {
  for (const f of [
    "",
    "shots/f1.png", // the prefix is added by the caller, not carried here
    "../run.json",
    "f1.png/../../run.json",
    "f1.svg", // SVG is a script vector; never served
    "f1.png.svg",
    "f1", // no extension
    ".png", // no name
    "f 1.png", // space
    "f1.PNG", // Cooper writes lowercase; the Content-Type check assumes it
    "a".repeat(65) + ".png",
  ]) {
    assert.equal(isShotFile(f), false, `expected ${JSON.stringify(f)} to be rejected`);
  }
});

test("reads the timestamp back out of a run id", () => {
  assert.equal(runIdTime("20260724T223610Z-0ba58a0d1c2f3e4b"), "2026-07-24T22:36:10Z");
  // Archived payloads from before Cooper sent `generated_at` still get a date.
  assert.equal(
    Date.parse(runIdTime("20260724T223610Z-0ba58a0d1c2f3e4b") ?? ""),
    Date.UTC(2026, 6, 24, 22, 36, 10),
  );
});

test("returns no timestamp for ids that are not ids, or not dates", () => {
  assert.equal(runIdTime("nonsense"), null);
  assert.equal(runIdTime(""), null);
  // Matches the pattern digit for digit and is still not a date.
  assert.equal(runIdTime("20261340T223610Z-0ba58a0d1c2f3e4b"), null);
  assert.equal(runIdTime("20260724T996110Z-0ba58a0d1c2f3e4b"), null);
});
