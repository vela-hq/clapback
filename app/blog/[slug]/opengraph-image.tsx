import { ImageResponse } from "next/og";
import { ARTICLES, getArticle } from "../articles";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

// Same font-loading approach as the root opengraph-image: Satori only knows
// the fonts we hand it explicitly.
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

const Burst = ({ s = 64 }: { s?: number }) => (
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getArticle(slug);
  const headline = meta ? meta.h1 : "Receipts";
  const category = meta ? meta.category : "ClapBack";

  const [display, mono, body] = await Promise.all([
    loadGoogleFont("Space Grotesk", 700, "ClapBack" + headline),
    loadGoogleFont("JetBrains Mono", 500, category.toUpperCase() + "RECEIPTS · "),
    loadGoogleFont("Hanken Grotesk", 400, meta ? meta.description : ""),
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
          padding: "64px 72px",
          fontFamily: "Hanken Grotesk",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Burst s={56} />
            <span
              style={{
                fontFamily: "Space Grotesk",
                fontSize: 34,
                fontWeight: 700,
                letterSpacing: -1,
                color: "#1a1815",
              }}
            >
              ClapBack
            </span>
          </div>
          <span
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 20,
              letterSpacing: 2,
              color: "#e8442a",
            }}
          >
            RECEIPTS · {category.toUpperCase()}
          </span>
        </div>

        <div
          style={{
            fontFamily: "Space Grotesk",
            fontWeight: 700,
            fontSize: headline.length > 48 ? 62 : 74,
            lineHeight: 1.02,
            letterSpacing: -2.5,
            color: "#1a1815",
            maxWidth: 1020,
          }}
        >
          {headline}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 26, color: "#6b655c" }}>clapback.run</span>
          <span
            style={{
              fontSize: 24,
              color: "#fff",
              background: "#1a1815",
              padding: "12px 24px",
              borderRadius: 10,
              fontFamily: "Space Grotesk",
              fontWeight: 700,
            }}
          >
            The roast has receipts.
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Space Grotesk", data: display, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
        { name: "Hanken Grotesk", data: body, weight: 400, style: "normal" },
      ],
    },
  );
}
