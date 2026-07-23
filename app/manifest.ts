import type { MetadataRoute } from "next";

// Web app manifest for installability and richer mobile/browser chrome.
// Colors mirror the brand: ink background (#1a1815), roast-red accent
// (#e8442a). The SVG icon is scalable, so one entry covers every size.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ClapBack",
    short_name: "ClapBack",
    description:
      "An AI agent uses your product like a real user, roasts everything that sucks, and turns it into tickets you can ship.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f1ea",
    theme_color: "#1a1815",
    icons: [
      {
        src: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
      {
        src: "/apple-icon",
        type: "image/png",
        sizes: "180x180",
      },
    ],
  };
}
