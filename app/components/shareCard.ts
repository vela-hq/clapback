// Renders one finding as a shareable image: the title (the roast) over the
// screenshot in a mini browser window, with a quiet clapback.run footer.
// Pure client-side canvas compositing — the screenshot is already a data: URI
// in memory, so nothing leaves the browser and nothing is persisted. The card
// height hugs the content: a short crop gives a short card, a full-page shot
// is cropped at H_MAX rather than producing a skyscraper.

export type ShareCardInput = {
  title: string;
  url: string; // display host of the roasted site, e.g. "lingscars.com"
  shot: string | null; // data: URI of the finding's screenshot, if it has one
};

const W = 1080;
const H_MAX = 1350;
const PAD = 72;

// Same burst polygon as the nav / favicon / topbar mark.
const BURST: [number, number][] = [
  [50, 4], [57.7, 31.5], [82.5, 17.5], [68.5, 42.3], [96, 50], [68.5, 57.7],
  [82.5, 82.5], [57.7, 68.5], [50, 96], [42.3, 68.5], [17.5, 82.5],
  [31.5, 57.7], [4, 50], [31.5, 42.3], [17.5, 17.5], [42.3, 31.5],
];

// Brand tokens come from the live CSS variables so the card can't drift from
// the site; fallbacks cover the (never expected) case of a detached call.
function tokens() {
  const s = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) =>
    s.getPropertyValue(name).trim() || fallback;
  return {
    bg: v("--bg", "#f4f1ea"),
    ink: v("--ink", "#1a1815"),
    muted: v("--text-muted", "#6b655c"),
    accent: v("--accent", "#e8442a"),
    border: "#cfc8ba",
    display: v("--font-display", "sans-serif"),
    body: v("--font-body", "sans-serif"),
    mono: v("--font-mono", "monospace"),
  };
}

function drawBurst(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 100, size / 100);
  ctx.translate(11, 0);
  ctx.transform(1, 0, Math.tan((-13 * Math.PI) / 180), 1, 0, 0); // skewX(-13)
  ctx.beginPath();
  BURST.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const probe = line ? `${line} ${word}` : word;
    if (ctx.measureText(probe).width > maxW && line) {
      lines.push(line);
      line = word;
    } else {
      line = probe;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Shrink the title until it fits maxLines, down to a floor where we accept
// however many lines it takes (a title past ~16 words has already broken the
// STYLE contract; the card stays legible either way).
function fitTitle(
  ctx: CanvasRenderingContext2D,
  font: string,
  text: string,
  maxW: number,
  maxLines: number,
  startSize: number,
  minSize: number,
): { size: number; lines: string[] } {
  for (let size = startSize; size >= minSize; size -= 4) {
    ctx.font = `700 ${size}px ${font}`;
    const lines = wrap(ctx, text, maxW);
    if (lines.length <= maxLines) return { size, lines };
  }
  ctx.font = `700 ${minSize}px ${font}`;
  return { size: minSize, lines: wrap(ctx, text, maxW) };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("share card: screenshot failed to decode"));
    img.src = src;
  });
}

export async function renderShareCard(input: ShareCardInput): Promise<HTMLCanvasElement> {
  // The page has been using these faces since first paint; ready is a no-op
  // wait in practice but guards a share clicked mid-font-swap.
  await document.fonts.ready;
  const t = tokens();

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H_MAX;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("share card: canvas 2d context unavailable");

  const img = input.shot ? await loadImage(input.shot) : null;

  // ---- Measure first: the card height hugs the content ----
  const maxW = W - PAD * 2;
  const titleTop = PAD + 60;
  const fit = img
    ? fitTitle(ctx, t.display, input.title, maxW, 4, 64, 44)
    : fitTitle(ctx, t.display, input.title, maxW, 6, 84, 56);
  const lineH = fit.size * 1.18;
  const titleH = fit.lines.length * lineH;

  const footerH = 130;
  const barH = 64;
  const frameTop = titleTop + titleH + 56;
  const scale = img ? (maxW - 8) / img.width : 1;
  const frameH = img
    ? Math.min(H_MAX - frameTop - footerH, barH + img.height * scale + 8)
    : 0;
  const cardH = img
    ? frameTop + frameH + footerH
    : Math.max(560, titleTop + titleH + footerH + 30);
  canvas.height = cardH; // resets the context state — set before any drawing

  // ---- Paper background + hairline frame ----
  ctx.fillStyle = t.bg;
  ctx.fillRect(0, 0, W, cardH);
  ctx.strokeStyle = t.border;
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, W - 2, cardH - 2);

  // ---- The roast, red tick above ----
  ctx.fillStyle = t.accent;
  ctx.fillRect(PAD, titleTop - 46, 84, 12);
  ctx.fillStyle = t.ink;
  ctx.font = `700 ${fit.size}px ${t.display}`;
  fit.lines.forEach((line, i) => {
    ctx.fillText(line, PAD, titleTop + fit.size * 0.85 + i * lineH);
  });

  // ---- Screenshot in a mini browser window ----
  if (img) {
    ctx.save();
    ctx.shadowColor = "rgba(26,24,21,.25)";
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 12;
    roundRect(ctx, PAD, frameTop, maxW, frameH, 18);
    ctx.fillStyle = t.ink;
    ctx.fill();
    ctx.restore();

    // Topbar: three dots + the roasted site in a url pill.
    [t.accent, "#f2b705", t.muted].forEach((c, i) => {
      ctx.beginPath();
      ctx.arc(PAD + 36 + i * 34, frameTop + barH / 2, 9, 0, Math.PI * 2);
      ctx.fillStyle = c;
      ctx.fill();
    });
    ctx.font = `500 24px ${t.mono}`;
    const uw = ctx.measureText(input.url).width;
    roundRect(ctx, PAD + 140, frameTop + 13, uw + 44, barH - 26, (barH - 26) / 2);
    ctx.fillStyle = "rgba(244,241,234,.14)";
    ctx.fill();
    ctx.fillStyle = t.border;
    ctx.textBaseline = "middle";
    ctx.fillText(input.url, PAD + 162, frameTop + barH / 2 + 2);
    ctx.textBaseline = "alphabetic";

    // Viewport: fit width, crop overflow past the height cap.
    const vpTop = frameTop + barH;
    const drawH = frameH - barH - 4;
    ctx.save();
    roundRect(ctx, PAD + 4, vpTop, maxW - 8, drawH, 4);
    ctx.clip();
    ctx.fillStyle = "#fff";
    ctx.fillRect(PAD + 4, vpTop, maxW - 8, drawH);
    ctx.drawImage(
      img,
      0, 0, img.width, Math.min(img.height, drawH / scale),
      PAD + 4, vpTop, maxW - 8, drawH,
    );
    ctx.restore();
  }

  // ---- Footer: quiet attribution + the invitation ----
  const footY = cardH - 62;
  drawBurst(ctx, PAD, footY - 28, 30, t.accent);
  ctx.font = `500 26px ${t.mono}`;
  ctx.fillStyle = t.ink;
  ctx.fillText("clapback.run", PAD + 42, footY);
  const cw = ctx.measureText("clapback.run").width;
  ctx.font = `400 26px ${t.body}`;
  ctx.fillStyle = t.muted;
  ctx.fillText("· roast your site free", PAD + 42 + cw + 12, footY);

  return canvas;
}
