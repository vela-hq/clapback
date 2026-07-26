import mixpanel, { type Config } from "mixpanel-browser";

const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

let initialized = false;

// Initialize the Mixpanel browser SDK once, on the client. Safe to call more
// than once — subsequent calls are no-ops. Returns whether tracking is live.
export const initMixpanel = (): boolean => {
  if (initialized) return true;
  if (typeof window === "undefined") return false;
  if (!token) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[mixpanel] NEXT_PUBLIC_MIXPANEL_TOKEN is not set; tracking disabled.");
    }
    return false;
  }

  mixpanel.init(token, {
    // Route events through our own first-party proxy (Next.js rewrites in
    // next.config.ts forward /relay/* to the EU host server-side). Same-origin
    // requests slip past ad/tracking blockers. The base path AND the endpoint
    // letters are intentionally neutral — blockers match /ingest and /track
    // even when first-party. Keep these letters in sync with RELAY_ROUTES.
    api_host: "/relay",
    // Config merge is a shallow extend, so this replaces the SDK's default
    // api_routes wholesale — every endpoint used must be listed here. record
    // and settings are needed for Session Replay. The @types only know about
    // the first three keys, hence the cast. Keep in sync with RELAY_ROUTES.
    api_routes: {
      track: "a",
      engage: "b",
      groups: "c",
      record: "d",
      settings: "s",
    } as Config["api_routes"],
    debug: process.env.NODE_ENV === "development",
    // We fire page views ourselves from MixpanelProvider so we can follow
    // client-side route changes in the App Router.
    track_pageview: false,
    persistence: "localStorage",
    // Session Replay. Record every session (low-traffic landing page); dial
    // this down if it eats into the plan's replay quota.
    record_sessions_percent: 100,
    // Out of the box a replay is a wireframe: every text node comes back as
    // ▪▪▪▪ and every img/video/audio as a grey box. On a site whose whole
    // point is what the copy says and what the roast screenshots show, that
    // makes replays unreadable — you cannot tell which finding someone
    // scrolled to. So show the page as it actually rendered.
    //
    // record_block_selector defaults to "img, video, audio"; "" clears it.
    record_mask_all_text: false,
    record_block_selector: "",
    // Inputs too, so the URL box reads as what someone actually typed —
    // watching a domain get half-typed and abandoned is the point of having
    // replays on this page at all.
    record_mask_all_inputs: false,
    // Email still cannot leak: the SDK hard-masks type=email/tel/password/
    // hidden, and anything with an autocomplete attribute, whatever the
    // config says. That covers the waitlist and upsell fields. Per-element
    // escape hatch for anything sensitive added later: a `mp-mask` class on
    // text or an input, `mp-block` on media.
  });
  initialized = true;
  return true;
};

export const isMixpanelReady = (): boolean => initialized;

export default mixpanel;
