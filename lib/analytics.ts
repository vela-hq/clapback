import mixpanel, { isMixpanelReady } from "@/lib/mixpanel";

// Fixed event names. Keep these snake_case and never build them dynamically —
// Mixpanel reports get noisy fast when event names are templated.
type EventName =
  | "page_viewed"
  | "waitlist_opened"
  | "waitlist_submitted"
  | "ticket_export_clicked";

type Primitive = string | number | boolean | null | undefined;

// Property keys should be snake_case to stay consistent across the project.
type EventProperties = Record<string, Primitive>;

// Central track function. No-ops until Mixpanel has been initialized (e.g. when
// the token is missing), so callers never have to guard.
export const track = (event: EventName, properties?: EventProperties): void => {
  if (!isMixpanelReady()) return;
  mixpanel.track(event, properties);
};

export const identify = (userId: string): void => {
  if (!isMixpanelReady()) return;
  mixpanel.identify(userId);
};

export const reset = (): void => {
  if (!isMixpanelReady()) return;
  mixpanel.reset();
};
