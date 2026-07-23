import { ImageResponse } from "next/og";

// Apple touch icon (home-screen bookmark on iOS). Rendered from the brand
// burst on the ink tile — the same mark as app/icon.svg — so no external
// font fetch is involved and it cannot break a build the way the OG images
// once did.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1815",
        }}
      >
        <svg width="118" height="118" viewBox="0 0 100 100">
          <g transform="translate(11 0) skewX(-13)">
            <polygon
              points="50.0,4.0 57.7,31.5 82.5,17.5 68.5,42.3 96.0,50.0 68.5,57.7 82.5,82.5 57.7,68.5 50.0,96.0 42.3,68.5 17.5,82.5 31.5,57.7 4.0,50.0 31.5,42.3 17.5,17.5 42.3,31.5"
              fill="#e8442a"
            />
          </g>
        </svg>
      </div>
    ),
    { ...size },
  );
}
