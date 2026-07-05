import mixpanel from "mixpanel-browser";

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
    // Route events through our own /ingest path (a Next.js rewrite that
    // forwards to api-eu.mixpanel.com server-side). Being same-origin, it
    // slips past ad/tracking blockers that block api-eu.mixpanel.com
    // directly. The rewrite target already pins the EU data-residency host.
    api_host: "/ingest",
    debug: process.env.NODE_ENV === "development",
    // We fire page views ourselves from MixpanelProvider so we can follow
    // client-side route changes in the App Router.
    track_pageview: false,
    persistence: "localStorage",
  });
  initialized = true;
  return true;
};

export const isMixpanelReady = (): boolean => initialized;

export default mixpanel;
