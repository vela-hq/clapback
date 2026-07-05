import type { NextConfig } from "next";

// First-party proxy for Mixpanel (EU data residency). The browser SDK is
// configured to POST to /relay/<letter> on our own origin; these rewrites
// forward each to the matching EU ingestion endpoint server-side.
//
// Both the base path and the per-endpoint letters are deliberately neutral:
// paths like /ingest or /track get caught by ad/tracking blockers (Arc,
// uBlock/EasyPrivacy) even when same-origin. Keep these letters in sync with
// api_routes in lib/mixpanel.ts.
const MIXPANEL_EU = "https://api-eu.mixpanel.com";
const RELAY_ROUTES: Record<string, string> = {
  a: "track",
  b: "engage",
  c: "groups",
};

const nextConfig: NextConfig = {
  async rewrites() {
    return Object.entries(RELAY_ROUTES).map(([letter, endpoint]) => ({
      source: `/relay/${letter}`,
      destination: `${MIXPANEL_EU}/${endpoint}/`,
    }));
  },
};

export default nextConfig;
