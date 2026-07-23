import { ImageResponse } from "next/og";
import { VERTICALS, getVertical } from "../verticals";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return VERTICALS.map((v) => ({ vertical: v.slug }));
}

// Same font-loading + retry approach as the root and blog OG images: Satori
// only knows the fonts we hand it, and a bare fetch that times out can abort
// the whole static build.
async function fetchWithRetry(url: string, attempts = 3): Promise<Response> {
  for (let i = 0; ; i++) {
    try {
      return await fetch(url);
    } catch (err) {
      if (i === attempts - 1) throw err;
      await new Promise((r) => setTimeout(r, 300 * 2 ** i));
    }
  }
}

async function loadGoogleFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(
    / /g,
    "+",
  )}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetchWithRetry(url)).text();
  const resource = css.match(
    /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/,
  );
  if (!resource) throw new Error(`Failed to load font: ${family} ${weight}`);
  return (await fetchWithRetry(resource[1])).arrayBuffer();
}

const Burst = ({ s = 92 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 100 100">
    <g transform="translate(11 0) skewX(-13)">
      <polygon
        points="50.0,4.0 57.7,31.5 82.5,17.5 68.5,42.3 96.0,50.0 68.5,57.7 82.5,82.5 57.7,68.5 50.0,96.0 42.3,68.5 17.5,82.5 31.5,57.7 4.0,50.0 31.5,42.3 17.5,17.5 42.3,31.5"
        fill="#e8442a"
      />
    </g>
  </svg>
);

export default async function Image({
  params,
}: {
  params: Promise<{ vertical: string }>;
}) {
  const { vertical } = await params;
  const v = getVertical(vertical);
  const line1 = v ? v.ogHeadline[0] : "Roast my";
  const line2 = v ? v.ogHeadline[1] : "website.";
  const sub = v
    ? "A real AI agent uses it like a user, roasts what sucks, and shows the receipts."
    : "";

  const [display, body] = await Promise.all([
    loadGoogleFont("Space Grotesk", 700, "ClapBack" + line1 + line2),
    loadGoogleFont("Hanken Grotesk", 400, sub),
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
            fontSize: 104,
            lineHeight: 0.98,
            letterSpacing: -3,
          }}
        >
          <div style={{ color: "#1a1815" }}>{line1}</div>
          <div style={{ color: "#e8442a" }}>{line2}</div>
        </div>

        <div style={{ fontSize: 30, lineHeight: 1.45, color: "#4a453d", maxWidth: 940 }}>
          {sub}
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
