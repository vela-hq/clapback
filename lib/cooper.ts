// Server-only client for Cooper, the agent that actually does the roasting.
//
// Cooper runs as a *private* Cloud Run service: it spends real money per review
// and drives a real browser, so it is not reachable without an IAM identity
// token. This module holds the two things that get us in — a GCP identity and
// Cooper's own shared key — and must never be imported from a client component.
//
// The payload translation lives in `cooperSchema.ts`, which is pure and holds
// no secrets, so it stays testable. This half is the part that can leak.

import "server-only";
import { GoogleAuth } from "google-auth-library";
import { mapPayload, type CooperPayload } from "./cooperSchema";
import type { RoastResult } from "@/app/data/roast";

export { mapPayload };

// Cache the auth client across warm invocations. google-auth-library caches the
// minted ID token internally, so a warm function reuses a valid token instead of
// paying a round trip per roast.
let authClientPromise: ReturnType<GoogleAuth["getIdTokenClient"]> | null = null;

function idTokenClient(audience: string) {
  if (authClientPromise) return authClientPromise;

  // Two ways in, in order of preference:
  //
  //  1. Nothing set -> Application Default Credentials. This covers keyless
  //     setups: `gcloud auth application-default login` locally, and Workload
  //     Identity Federation (Vercel OIDC -> GCP) in production, which is wired
  //     entirely through GOOGLE_APPLICATION_CREDENTIALS pointing at an
  //     external_account file. Nothing long-lived to leak or rotate.
  //  2. GCP_SERVICE_ACCOUNT_KEY -> an explicit service-account key. Simpler to
  //     wire into a dashboard, but it is a STANDING credential: anyone holding
  //     it can make Cooper spend money until the key is revoked.
  const raw = process.env.GCP_SERVICE_ACCOUNT_KEY?.trim();
  if (!raw) {
    authClientPromise = new GoogleAuth().getIdTokenClient(audience);
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
  authClientPromise = new GoogleAuth({ credentials }).getIdTokenClient(audience);
  return authClientPromise;
}

export class CooperNotConfigured extends Error {}

/** What a run cost and what it produced. `costUsd` never reaches the browser —
 *  it exists so the route can log real spend per roast, which is the only
 *  visibility we have until a proper cap lands. */
export type RoastOutcome = {
  result: RoastResult;
  costUsd: number | null;
  durationMs: number | null;
};

/** Ask Cooper to review `url`. Throws only on a configuration fault the caller
 *  should surface as a 500; every other failure comes back as an error result. */
export async function roast(url: string, signal: AbortSignal): Promise<RoastOutcome> {
  const base = process.env.COOPER_URL?.replace(/\/$/, "");
  if (!base) throw new CooperNotConfigured("COOPER_URL is not set");

  const client = await idTokenClient(base);
  // The ID token's audience is the service's root URL, not the endpoint path.
  const authHeaders = await client.getRequestHeaders(base);

  const res = await fetch(`${base}/review`, {
    method: "POST",
    signal,
    headers: {
      ...Object.fromEntries(new Headers(authHeaders as HeadersInit).entries()),
      "Content-Type": "application/json",
      // Cooper's second lock, behind Cloud Run IAM. See cooper/server.py.
      ...(process.env.COOPER_KEY ? { "X-Cooper-Key": process.env.COOPER_KEY } : {}),
    },
    body: JSON.stringify({ url }),
  });

  let payload: CooperPayload;
  try {
    payload = (await res.json()) as CooperPayload;
  } catch {
    return {
      result: { status: "error", message: `Cooper returned a non-JSON ${res.status}` },
      costUsd: null,
      durationMs: null,
    };
  }

  // Cooper answers 200 and 502 in the same shape, and since the hardening also
  // 400/401. mapPayload reads `error` either way, so the status code only
  // matters when the body somehow says nothing.
  let result = mapPayload(payload);
  if (!res.ok && result.status !== "error" && result.status !== "cannot_review") {
    result = { status: "error", message: `Cooper returned ${res.status}` };
  }

  return {
    result,
    // Real spend, straight from the agent's own accounting. Null on a run that
    // died before it reported.
    costUsd: typeof payload.cost_usd === "number" ? payload.cost_usd : null,
    durationMs: typeof payload.duration_ms === "number" ? payload.duration_ms : null,
  };
}
