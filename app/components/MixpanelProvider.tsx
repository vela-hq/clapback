"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initMixpanel } from "@/lib/mixpanel";
import { track } from "@/lib/analytics";

// Initializes Mixpanel once on mount and fires a page_viewed event on every
// route change. Rendered from the (server) root layout so it wraps the app
// without turning the layout into a client component.
export default function MixpanelProvider() {
  const pathname = usePathname();

  useEffect(() => {
    initMixpanel();
  }, []);

  useEffect(() => {
    track("page_viewed", { path: pathname });
  }, [pathname]);

  return null;
}
