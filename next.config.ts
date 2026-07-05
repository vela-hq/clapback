import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // First-party proxy for Mixpanel. The browser SDK posts to
      // /ingest/* on our own origin, which we forward server-side to the
      // EU ingestion host. Ad/tracking blockers only see a same-domain
      // request, so events from blocked visitors still get through.
      {
        source: "/ingest/:path*",
        destination: "https://api-eu.mixpanel.com/:path*",
      },
    ];
  },
};

export default nextConfig;
