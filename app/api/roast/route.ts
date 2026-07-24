import { NextResponse } from "next/server";
import { checkUrl } from "@/lib/urlguard";
import { CooperNotConfigured, roast } from "@/lib/cooper";
import type { RoastResult } from "@/app/data/roast";
import { REDDIT_FINDINGS } from "@/app/data/redditFindings";
import { isRedditUrl } from "@/app/data/redditFindings";

// A roast is a real agent run: 30-90s, plus up to ~30s of Cloud Run cold start
// while the 2.5 GB image is pulled. This is the trust boundary — the browser
// never touches Cloud Run directly, because that would leak the service URL,
// force it public, and put auth on the client where none of it can be trusted.
//
// 300s is both the default and the hard ceiling on Vercel Hobby (with fluid
// compute), so this is as much room as the plan can buy. The client aborts well
// before it — a user will not wait this long, but the function should not be
// the thing that gives up first.
export const maxDuration = 300;

// Cooper is stateful per-run and costs money; nothing here is cacheable.
export const dynamic = "force-dynamic";

// Leave headroom under maxDuration so a Cooper timeout comes back as our JSON
// error rather than Vercel's opaque 504 (FUNCTION_INVOCATION_TIMEOUT).
const COOPER_TIMEOUT_MS = 280_000;

export async function POST(req: Request) {
  let body: { url?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { status: "error", message: "Invalid request." } satisfies RoastResult,
      { status: 400 },
    );
  }

  const check = checkUrl(typeof body.url === "string" ? body.url : "");
  if (!check.ok) {
    // 400 with a real reason: the URL is the user's, and so is the mistake.
    return NextResponse.json(
      { status: "error", message: check.reason } satisfies RoastResult,
      { status: 400 },
    );
  }

  // Local dev without GCP credentials replays the scripted reddit findings, so
  // `npm run dev` works with zero setup. Never in production: silently serving
  // reddit's roast for someone else's site would be lying to a user, so a
  // missing COOPER_URL in prod is a 500, loudly.
  if (!process.env.COOPER_URL && process.env.NODE_ENV !== "production") {
    console.warn("COOPER_URL unset — serving the scripted reddit findings (dev only).");
    await new Promise((r) => setTimeout(r, 2_000));
    return NextResponse.json(
      isRedditUrl(check.url)
        ? ({
            status: "findings",
            findings: REDDIT_FINDINGS,
            // The canned set predates screenshots and has no images to serve.
            shots: {},
            durationMs: 12_000,
            // Plausible site context so the personalized upsell renders in dev.
            site: {
              siteType: "social news aggregator",
              untestedSurfaces: ["comments", "login flow", "search"],
            },
          } satisfies RoastResult)
        : ({
            status: "cannot_review",
            reason: "Dev mode without COOPER_URL only has canned findings for reddit.com.",
          } satisfies RoastResult),
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), COOPER_TIMEOUT_MS);
  const startedAt = Date.now();

  try {
    const { result, costUsd, durationMs } = await roast(check.url, controller.signal);

    // Every roast spends real money and nothing caps it yet, so this line is
    // the only record that it happened. Structured and greppable on purpose:
    //   gcloud/vercel logs | grep roast_completed | jq -s 'map(.cost_usd)|add'
    // is, for now, the spend dashboard.
    console.log(
      JSON.stringify({
        event: "roast_completed",
        url: check.url,
        status: result.status,
        cost_usd: costUsd,
        agent_ms: durationMs,
        elapsed_ms: Date.now() - startedAt,
        ...(result.status === "error" && { error: result.message }),
      }),
    );

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof CooperNotConfigured) {
      console.error("Roast backend is not configured:", err.message);
      return NextResponse.json(
        { status: "error", message: "Roasting isn't switched on yet." } satisfies RoastResult,
        { status: 500 },
      );
    }
    const aborted = controller.signal.aborted;
    console.error("Roast failed", { url: check.url, aborted, err });
    return NextResponse.json(
      {
        status: "error",
        message: aborted
          ? "The roast took too long and timed out. Try again."
          : "The roast crashed. Try again.",
      } satisfies RoastResult,
      { status: aborted ? 504 : 502 },
    );
  } finally {
    clearTimeout(timer);
  }
}
