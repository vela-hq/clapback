import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ClapBack: Your UX sucks. Here's the receipts.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Load the brand fonts so the share card matches the landing page instead of
// falling back to a generic system sans-serif. Satori only knows the fonts we
// hand it; it does not inherit next/font.
async function loadGoogleFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(
    / /g,
    "+",
  )}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/,
  );
  if (!resource) throw new Error(`Failed to load font: ${family} ${weight}`);
  return (await fetch(resource[1])).arrayBuffer();
}

const WORDMARK = "ClapBack";
const HEADLINE = "Your UX sucks. Here’s the receipts.";
const DESCRIPTION =
  "An AI agent uses your product like a real user, roasts what sucks, and turns it into Jira tickets you can ship.";

// Burst mark from the brand logo, sized for the share card.
const Burst = () => (
  <svg width="92" height="92" viewBox="0 0 100 100">
    <g transform="translate(11 0) skewX(-13)">
      <polygon
        points="50.0,4.0 57.7,31.5 82.5,17.5 68.5,42.3 96.0,50.0 68.5,57.7 82.5,82.5 57.7,68.5 50.0,96.0 42.3,68.5 17.5,82.5 31.5,57.7 4.0,50.0 31.5,42.3 17.5,17.5 42.3,31.5"
        fill="#e8442a"
      />
    </g>
  </svg>
);

export default async function Image() {
  const [display, body] = await Promise.all([
    loadGoogleFont("Space Grotesk", 700, WORDMARK + HEADLINE),
    loadGoogleFont("Hanken Grotesk", 400, DESCRIPTION),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f1ea",
          padding: "72px 80px",
          fontFamily: "Hanken Grotesk",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Burst />
          <span
            style={{
              fontFamily: "Space Grotesk",
              fontSize: 44,
              fontWeight: 700,
              letterSpacing: -1,
              color: "#1a1815",
            }}
          >
            ClapBack
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Space Grotesk",
            fontWeight: 700,
            fontSize: 96,
            lineHeight: 0.98,
            letterSpacing: -3,
          }}
        >
          <div style={{ color: "#1a1815" }}>Your UX sucks.</div>
          <div style={{ color: "#e8442a" }}>Here&rsquo;s the receipts.</div>
        </div>

        <div
          style={{
            fontSize: 32,
            lineHeight: 1.45,
            color: "#4a453d",
            maxWidth: 940,
          }}
        >
          {DESCRIPTION}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Space Grotesk", data: display, weight: 700, style: "normal" },
        { name: "Hanken Grotesk", data: body, weight: 400, style: "normal" },
      ],
    },
  );
}
