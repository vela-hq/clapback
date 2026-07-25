// Server-only reader for the roast archive.
//
// Cooper writes every server-mode review to a GCS bucket before it answers:
//
//   runs/<run_id>/run.json          the /review payload, with `shots` rewritten
//                                   from data URIs to relative object paths
//   runs/<run_id>/conversation.log  the agent's transcript (not read here)
//   runs/<run_id>/shots/<id>.png    the images those paths point at
//
// That archive is what makes a roast linkable: /r/<run_id> re-renders a run
// nobody is waiting on any more. This module is the read half — it holds a GCP
// credential, so like `cooper.ts` it is `server-only` and must never be pulled
// into a client component. The payload translation stays in `cooperSchema.ts`
// and the id validation in `runId.ts`; both are pure and testable. This half is
// the part that can leak.
//
// The bucket is private and stays private. Nothing here mints a signed URL or
// hands the browser a storage.googleapis.com address: images come back through
// our own /r/<id>/shot/<file> route, so the only thing a reader ever learns is
// a path on our origin.

import "server-only";
import { cache } from "react";
import { GoogleAuth } from "google-auth-library";
import { mapPayload, type CooperPayload } from "./cooperSchema";
import { isRunId, isShotFile, runIdTime } from "./runId";
import type { RoastResult } from "@/app/data/roast";

export { isRunId, runIdTime };

// Set by ci.yml on Cooper's own service; the default is the bucket that has
// been taking prod runs since 2026-07-24. Same name on both sides on purpose —
// a reader pointed at a different bucket than the writer 404s on every roast
// and looks exactly like a run that expired.
const BUCKET = process.env.COOPER_RUNS_BUCKET?.trim() || "clapback-502511-cooper-runs";

// Read-only, and deliberately the narrowest scope Google publishes for object
// reads. This app is never a writer — Cooper is the only one — and a credential
// that could also delete a run has no business on a page render.
const STORAGE_SCOPE = "https://www.googleapis.com/auth/devstorage.read_only";

/** An archived run, as a page renders it. */
export type StoredRoast = {
  runId: string;
  url: string; // the roasted site's URL
  generatedAt: string | null;
  result: RoastResult; // shots already rewritten to /r/<runId>/shot/<file>
};

// Cache the auth client across warm invocations, exactly as cooper.ts does:
// google-auth-library caches the minted access token internally, so a warm
// function reuses a valid one instead of paying a round trip per image.
let authClientPromise: ReturnType<GoogleAuth["getClient"]> | null = null;

function storageClient() {
  if (authClientPromise) return authClientPromise;

  // The same two ways in as cooper.ts, in the same order of preference:
  //
  //  1. Nothing set -> Application Default Credentials. `gcloud auth
  //     application-default login` locally, Workload Identity Federation
  //     (Vercel OIDC -> GCP) in production. Nothing long-lived to leak.
  //  2. GCP_SERVICE_ACCOUNT_KEY -> an explicit service-account key. Simpler to
  //     wire into a dashboard, but it is a STANDING credential: whoever holds
  //     it can read the whole archive until the key is revoked.
  const raw = process.env.GCP_SERVICE_ACCOUNT_KEY?.trim();
  if (!raw) {
    authClientPromise = new GoogleAuth({ scopes: [STORAGE_SCOPE] }).getClient();
    return authClientPromise;
  }

  let credentials: object;
  try {
    // Accept raw JSON or base64 — pasting multi-line JSON into a dashboard env
    // var mangles the private key's newlines often enough to tolerate both.
    const json = raw.startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
    credentials = JSON.parse(json);
  } catch {
    throw new Error("GCP_SERVICE_ACCOUNT_KEY is not valid JSON or base64-encoded JSON");
  }
  authClientPromise = new GoogleAuth({ credentials, scopes: [STORAGE_SCOPE] }).getClient();
  return authClientPromise;
}

// Fetch one object's bytes through the JSON API's media endpoint. To that API
// the object name is a single opaque path component, so every character of it —
// the slashes included — has to be percent-encoded, which encodeURIComponent
// does and encodeURI does not.
async function fetchObject(objectName: string): Promise<Response> {
  const client = await storageClient();
  const url =
    `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(BUCKET)}` +
    `/o/${encodeURIComponent(objectName)}?alt=media`;
  const headers = await client.getRequestHeaders(url);
  return fetch(url, { headers: new Headers(headers as HeadersInit) });
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Load one archived run.
 *
 *  Null means gone: the id is malformed, or the object is not there — a run
 *  that expired under the bucket's 90-day lifecycle, or one that never existed.
 *  Anything else throws, so the page can tell "gone" (a 404 with an honest
 *  explanation) from "broken" (our problem, and it should look like one).
 *
 *  Cached per request: the page, its generateMetadata and anything else on the
 *  same render share one fetch. */
export const loadRoast = cache(async (runId: string): Promise<StoredRoast | null> => {
  if (!isRunId(runId)) return null;

  const res = await fetchObject(`runs/${runId}/run.json`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Roast archive returned ${res.status} for ${runId}`);

  let payload: CooperPayload;
  try {
    payload = (await res.json()) as CooperPayload;
  } catch {
    throw new Error(`Roast archive returned unreadable JSON for ${runId}`);
  }

  // Tell mapPayload it is reading an archived payload, not a live one: `shots`
  // holds object paths, and each becomes a URL on our own origin. mapPayload
  // has already matched the path against its own strict pattern before we see
  // it; re-checking the filename here costs nothing and keeps this function
  // safe on its own terms if that pattern ever loosens.
  const result = mapPayload(payload, {
    resolveShot: (objectPath) => {
      const file = objectPath.slice("shots/".length);
      return isShotFile(file) ? `/r/${runId}/shot/${file}` : null;
    },
  });

  return {
    // The path is authoritative, not the payload: a run.json written before
    // Cooper started echoing `run_id` still has an id — it is the one we
    // fetched it by.
    runId,
    url: str(payload.url),
    generatedAt: str(payload.generated_at) || runIdTime(runId),
    result,
  };
});

/** Load one archived screenshot's bytes. `file` is the bare filename inside the
 *  run (`f1.png`), not a path. Null means gone, for either segment. */
export async function loadShot(
  runId: string,
  file: string,
): Promise<{ body: ArrayBuffer; contentType: string } | null> {
  if (!isRunId(runId) || !isShotFile(file)) return null;

  const res = await fetchObject(`runs/${runId}/shots/${file}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Roast archive returned ${res.status} for ${runId}/${file}`);

  return {
    body: await res.arrayBuffer(),
    // Derived from the extension we just validated, never echoed from the
    // object's own metadata: the Content-Type is what makes a browser decide
    // whether these bytes are a picture or something it should run, and that
    // decision should rest on this app's own allowlist.
    contentType: /\.png$/.test(file) ? "image/png" : "image/jpeg",
  };
}
