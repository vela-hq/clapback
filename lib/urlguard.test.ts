// Tests for the SSRF guard.
//
//     npm test
//
// Node's built-in runner with native type stripping — no jest, no vitest, no
// ts-node. The project has no test infrastructure and this one module does not
// justify inventing any, but it does justify a test: it is the difference
// between "a public form" and "a public form that fetches our metadata server".
//
// Every case here is a URL that leaked, or nearly leaked, during development.

import { test } from "node:test";
import assert from "node:assert/strict";
import { checkUrl } from "./urlguard.ts";

const blocked = (url: string) => {
  const r = checkUrl(url);
  assert.equal(r.ok, false, `expected ${JSON.stringify(url)} to be blocked, got ${JSON.stringify(r)}`);
};

const allowed = (url: string) => {
  const r = checkUrl(url);
  assert.equal(r.ok, true, `expected ${JSON.stringify(url)} to be allowed, got ${JSON.stringify(r)}`);
};

test("blocks the cloud metadata server", () => {
  // The whole reason this file exists: on Cloud Run this address hands out
  // service-account tokens to anything that asks.
  blocked("http://169.254.169.254/computeMetadata/v1/");
  blocked("http://metadata.google.internal/");
  blocked("http://metadata/");
  blocked("http://[::ffff:169.254.169.254]/");
});

test("blocks loopback and private IPv4", () => {
  for (const url of [
    "http://127.0.0.1/",
    "http://0.0.0.0/",
    "http://10.0.0.5/",
    "http://172.16.0.1/",
    "http://192.168.1.1/",
    "http://100.64.0.1/", // CGNAT
    "https://localhost",
    "localhost:8080", // scheme-less: must not parse as scheme "localhost"
  ]) {
    blocked(url);
  }
});

test("blocks private IPv6 in every spelling", () => {
  // These all leaked at first. URL.hostname keeps the brackets AND rewrites
  // ::ffff:127.0.0.1 to ::ffff:7f00:1, so string matching loses both ways.
  for (const url of [
    "http://[::1]/", // loopback
    "http://[::]/", // unspecified
    "http://[fe80::1]/", // link-local
    "http://[fc00::1]/", // unique-local
    "http://[fd12:3456::1]/", // unique-local
    "http://[ff02::1]/", // multicast
    "http://[::ffff:127.0.0.1]/", // v4-mapped, dotted
    "http://[::ffff:7f00:1]/", // v4-mapped, the form URL normalizes TO
    "http://[::ffff:10.0.0.1]/",
    "http://[::127.0.0.1]/", // v4-compatible
    "http://[64:ff9b::127.0.0.1]/", // NAT64
    "http://[2002:7f00:1::]/", // 6to4 wrapping 127.0.0.1
  ]) {
    blocked(url);
  }
});

test("blocks IPv4 written as an integer", () => {
  blocked("http://2130706433/"); // 127.0.0.1
  blocked("http://0x7f000001/");
});

test("blocks non-http schemes", () => {
  for (const url of [
    "file:///etc/passwd",
    "gopher://evil.com/",
    "javascript:alert(1)",
    "data:text/html,x",
  ]) {
    blocked(url);
  }
});

test("blocks internal-looking hostnames", () => {
  for (const url of [
    "http://wiki/", // single-label intranet name
    "http://foo.localhost/",
    "http://db.internal/",
    "http://x.local/",
  ]) {
    blocked(url);
  }
});

test("blocks malformed input", () => {
  for (const url of ["", "   ", "not a url", "https://exam ple.com"]) {
    blocked(url);
  }
  blocked("http://user:pass@example.com/"); // credential smuggling
  blocked(`https://example.com/${"a".repeat(3000)}`);
});

test("allows real public sites", () => {
  for (const url of [
    "https://example.com",
    "http://example.com/path?q=1",
    "https://news.ycombinator.com",
    "https://sub.domain.co.uk/a/b?c=1#d",
    "https://8.8.8.8/",
    "http://[2606:4700:4700::1111]/", // public IPv6 must not be collateral
    "http://[2001:4860:4860::8888]/",
  ]) {
    allowed(url);
  }
});

test("adds https:// to a bare host, matching Cooper's browse tool", () => {
  const r = checkUrl("example.com");
  assert.equal(r.ok, true);
  assert.equal(r.ok && r.url, "https://example.com/");
});
