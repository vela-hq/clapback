import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ClapBack: Your UX sucks. Here's the receipts.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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

export default function Image() {
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
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Burst />
          <span style={{ fontSize: 44, fontWeight: 700, color: "#1a1815" }}>
            ClapBack
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              color: "#1a1815",
              lineHeight: 1.02,
              letterSpacing: -2,
            }}
          >
            Your UX sucks.
          </div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              color: "#e8442a",
              lineHeight: 1.02,
              letterSpacing: -2,
            }}
          >
            Here&rsquo;s the receipts.
          </div>
        </div>

        <div style={{ fontSize: 32, color: "#4a453d", maxWidth: 940 }}>
          An AI agent uses your product like a real user, roasts what sucks, and
          turns it into Jira tickets you can ship.
        </div>
      </div>
    ),
    { ...size },
  );
}
