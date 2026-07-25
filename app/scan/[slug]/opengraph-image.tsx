import { ImageResponse } from "next/og";
import { SCANS, getScan } from "../../scans/scans";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return SCANS.map((s) => ({ slug: s.slug }));
}

// Same font-loading approach as the blog's OG route, including the retry: a
// bare fetch here once cost a whole deploy, because Next aborts the entire
// build when one static page fails.
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
  const meta = getScan(slug);
  const headline = meta ? meta.h1 : "Scans";
  const eyebrow = meta
    ? `PRODUCT SCAN · NO. ${String(meta.number).padStart(3, "0")} · ${meta.host.toUpperCase()}`
    : "PRODUCT SCAN";
  // The counted ratios are the share card's whole job: the number is the hook,
  // and it travels further than the headline does.
  const tiles = (meta?.stats ?? []).slice(0, 3);
  const tileText = tiles.map((t) => t.num + t.label).join("");

  const [display, mono, body] = await Promise.all([
    loadGoogleFont("Space Grotesk", 700, "ClapBack" + headline + tileText),
    loadGoogleFont("JetBrains Mono", 500, eyebrow + "clapback.run"),
    loadGoogleFont("Hanken Grotesk", 400, tileText + "clapback.run"),
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
          padding: "58px 68px",
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
            <Burst s={52} />
            <span
              style={{
                fontFamily: "Space Grotesk",
                fontSize: 32,
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
              fontSize: 18,
              letterSpacing: 2,
              color: "#e8442a",
            }}
          >
            {eyebrow}
          </span>
        </div>

        <div
          style={{
            fontFamily: "Space Grotesk",
            fontWeight: 700,
            fontSize: headline.length > 48 ? 58 : 68,
            lineHeight: 1.03,
            letterSpacing: -2.5,
            color: "#1a1815",
            maxWidth: 1030,
          }}
        >
          {headline}
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {tiles.map((t) => (
            <div
              key={t.label}
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                background: "#fff",
                border: "1px solid #e4dfd4",
                borderRadius: 14,
                padding: "18px 20px",
              }}
            >
              <span
                style={{
                  fontFamily: "Space Grotesk",
                  fontWeight: 700,
                  fontSize: 46,
                  letterSpacing: -2,
                  color: "#1a1815",
                }}
              >
                {t.num}
              </span>
              <span
                style={{
                  fontSize: 19,
                  lineHeight: 1.25,
                  color: "#6b655c",
                  marginTop: 8,
                }}
              >
                {t.label}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 22,
              color: "#6b655c",
            }}
          >
            clapback.run
          </span>
          <span
            style={{
              fontSize: 22,
              color: "#fff",
              background: "#1a1815",
              padding: "11px 22px",
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
