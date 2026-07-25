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
  // Fired when a run is given up on before any verdict lands — a close or a
  // tab-away mid-scan. Carries elapsed_ms so wait-time churn is measurable
  // rather than inferred from a missing roast_demo_shown.
  | "roast_demo_abandoned"
  // Share card: opened is the preview modal, shared is an actual export —
  // method distinguishes copy / download / native share sheet.
  | "roast_share_opened"
  | "roast_shared"
  // The permalink report at /r/<run_id>. `viewed` fires for the author landing
  // on their own fresh roast AND for anyone opening a shared link, so it is the
  // only place the two audiences are distinguishable — `first_party` says which.
  | "roast_report_viewed"
  // A marker on the page map was clicked, as opposed to the finding row. Worth
  // separating: it says whether the map is being used to navigate or just read.
  | "roast_marker_clicked"
  | "roast_report_link_copied";

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
  // The SDK's third arg is RequestOptions | Callback; our narrow subset is a
  // structural match. Cast keeps the public signature honest for callers.
  mixpanel.track(event, properties, options as Parameters<typeof mixpanel.track>[2]);
};

export const identify = (userId: string): void => {
  if (!isMixpanelReady()) return;
  mixpanel.identify(userId);
};

export const reset = (): void => {
  if (!isMixpanelReady()) return;
  mixpanel.reset();
};
