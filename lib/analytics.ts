import mixpanel, { isMixpanelReady } from "@/lib/mixpanel";

// Fixed event names. Keep these snake_case and never build them dynamically —
// Mixpanel reports get noisy fast when event names are templated.
type EventName =
  | "page_viewed"
  | "waitlist_opened"
  | "waitlist_submitted"
  | "ticket_export_clicked"
  // The demo-export toast's "Roast your site" button — converts integration
  // interest into a scroll back to the hero URL input.
  | "toast_roast_cta_clicked"
  | "roast_demo_started"
  | "roast_demo_shown"
  | "roast_finding_expanded"
  | "roast_upsell_opened"
  | "roast_upsell_clicked"
  | "roast_retried"
  | "roast_demo_closed"
  // Fired when a run is given up on before any verdict lands — dismissing the
  // pill or tabbing away mid-scan. Carries elapsed_ms so wait-time churn is
  // measurable rather than inferred from a missing roast_demo_shown.
  //
  // Closing the overlay is NOT this any more: it minimizes the run into the
  // pill and the roast keeps going. Only the pill's ✕ and a page unload end it.
  | "roast_demo_abandoned"
  // The overlay was closed but the run kept going, and the trip back. Together
  // they answer whether the two-minute wait is being spent watching a timer or
  // reading the page — the reason the pill exists.
  | "roast_minimized"
  | "roast_restored"
  // A submit that was refused because a roast was already in flight. Worth its
  // own event: it is the measure of how often people lose track of a running
  // roast, which is the thing the pill exists to prevent.
  | "roast_start_blocked"
  // Share card: opened is the preview modal, shared is an actual export —
  // method distinguishes copy / download / native share sheet.
  | "roast_share_opened"
  | "roast_shared"
  // The permalink report at /r/<run_id>. Fires the same way for the author
  // landing on their own fresh roast and for anyone opening a shared link — the
  // two are not distinguished, so this counts report reads, not funnel steps.
  | "roast_report_viewed"
  // A marker on the page map was clicked, as opposed to the finding row. Worth
  // separating: it says whether the map is being used to navigate or just read.
  | "roast_marker_clicked"
  | "roast_report_link_copied"
  // Product scans at /scan/<slug>. Blog articles fire nothing, so their traffic
  // is only visible as page_viewed; scans are a distribution asset and get
  // instrumented from day one. `scan_cta_clicked` carries `where`, which names
  // the block on the page, so the chapter that actually converts is knowable
  // rather than guessed at.
  | "scan_viewed"
  | "scan_node_clicked"
  | "scan_cta_clicked";

type Primitive = string | number | boolean | null | undefined;

// Property keys should be snake_case to stay consistent across the project.
type EventProperties = Record<string, Primitive>;

// Transport controls for events fired during page unload: a normal XHR is
// cancelled when the tab goes away, so those must go out over sendBeacon.
type TrackOptions = { transport?: "xhr" | "sendBeacon"; send_immediately?: boolean };

// Central track function. No-ops until Mixpanel has been initialized (e.g. when
// the token is missing), so callers never have to guard.
export const track = (
  event: EventName,
  properties?: EventProperties,
  options?: TrackOptions,
): void => {
  if (!isMixpanelReady()) return;
  try {
    // The SDK's third arg is RequestOptions | Callback; our narrow subset is a
    // structural match. Cast keeps the public signature honest for callers.
    mixpanel.track(event, properties, options as Parameters<typeof mixpanel.track>[2]);
  } catch {
    // Instrumentation must never be able to break the thing it measures. The
    // types say every property is a primitive, but types are a compile-time
    // promise and this is a runtime library that walks whatever it is handed:
    // one non-primitive slipping through (a DOM event from a click handler,
    // say) recursed until the stack blew and killed the click that fired it.
  }
};

export const identify = (userId: string): void => {
  if (!isMixpanelReady()) return;
  mixpanel.identify(userId);
};

export const reset = (): void => {
  if (!isMixpanelReady()) return;
  mixpanel.reset();
};
