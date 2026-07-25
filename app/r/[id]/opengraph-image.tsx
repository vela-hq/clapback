import { ImageResponse } from "next/og";
import { loadRoast } from "@/lib/roastStore";
import { severityTally } from "@/app/data/roast";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Explicitly Node, not edge: this card is generated from the archived run, and
// reading the archive means google-auth-library, which is Node-only. The other
// OG images in this app have nothing to fetch and are free to run anywhere;
// this one is not. (Node is already the default — it is spelled out so nobody
// "optimises" it to edge and gets a build error they have to decode.)
export const runtime = "nodejs";

// Same font-loading + retry approach as the other OG images: Satori only knows
// the fonts we hand it, and a bare fetch that times out can abort the render.
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

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}

// Text only, on purpose. The obvious idea is to put the page screenshot behind
// this card, and the obvious idea costs a multi-megabyte fetch out of the
// bucket plus a base64 encode on every scrape, for an image that renders at
// thumbnail size in a timeline. The count is the thing that makes someone
// click.
export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const roast = await loadRoast(id).catch(() => null);
  const r = roast?.result;
  const host = roast ? hostOf(roast.url) : "";

  // Headline and sub, one per way a run can end. A gone (or broken) run still
  // gets a card: the link is already out in the world by the time anything
  // scrapes it, and a blank image looks like our fault either way.
  let headline = "Roast expired";
  let sub = "Roasts are kept for 90 days.";
  if (r?.status === "findings") {
    const n = r.findings.length;
    headline = `${n} ${n === 1 ? "issue" : "issues"}`;
    sub = severityTally(r.findings)
      .map((t) => `${t.count} ${t.sev}`)
      .join("  ·  ");
  } else if (r?.status === "clean") {
    headline = "Nothing found";
    sub = "Rare. Enjoy it.";
  } else if (r?.status === "cannot_review") {
    headline = "Couldn't read it";
    sub = "The agent abstained instead of inventing findings.";
  } else if (r?.status === "error") {
    headline = "Roast failed";
    sub = "This one broke before it finished.";
  }

  const label = host ? `clapback.run roast of ${host}` : "clapback.run";

  const [display, body] = await Promise.all([
    loadGoogleFont("Space Grotesk", 700, `ClapBack${headline}${host}`),
    loadGoogleFont("Hanken Grotesk", 500, `${sub}${label}`),
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

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "Space Grotesk",
              fontWeight: 700,
              fontSize: 128,
              lineHeight: 0.98,
              letterSpacing: -4,
              color: "#e8442a",
            }}
          >
            {headline}
          </div>
          {host ? (
            <div
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                fontSize: 56,
                lineHeight: 1.1,
                letterSpacing: -2,
                color: "#1a1815",
                marginTop: 14,
                // Someone else's hostname can be arbitrarily long; clip rather
                // than let it push the tally off the card.
                overflow: "hidden",
                textOverflow: "clip",
                whiteSpace: "nowrap",
                maxWidth: 1040,
              }}
            >
              {host}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 500, color: "#4a453d" }}>{sub}</div>
          <div style={{ fontSize: 24, fontWeight: 500, color: "#9a948a" }}>{label}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Space Grotesk", data: display, weight: 700, style: "normal" },
        { name: "Hanken Grotesk", data: body, weight: 500, style: "normal" },
      ],
    },
  );
}
