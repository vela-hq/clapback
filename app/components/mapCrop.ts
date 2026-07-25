// Cut a finding's close-up out of the whole-page map.
//
// Every finding already has a region — where on the page it lives, in the
// page's own CSS pixels — and the map is a picture of that same coordinate
// space. So a crop is arithmetic, not a second screenshot: scale the region by
// however much the map image was reduced, and draw that rectangle.
//
// This exists because the crop is the one thing the map can't replace. A share
// card wants the offending button at a legible size, not a 7,000px page shrunk
// into a thumbnail. Cooper still sends real crops at 2x when the byte budget
// allows, and those are better — sharper, and outlined in red where the anchor
// matched. This is the fallback for when it doesn't, and for archived runs
// whose crops were dropped to keep the map.

import type { PageMap, Region } from "@/app/data/roast";

// Don't hand back a sliver. Below this the "crop" is a texture swatch, and a
// share card is better off with no image than with an unreadable one.
const MIN_EDGE = 24;

// Cap the output so a region covering half a long page doesn't allocate a
// canvas the size of the page. The share card renders at 1080 wide.
const MAX_EDGE = 1600;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Same-origin in both modes (a data: URI on a live roast, our own /r/…/shot
    // route on a stored one), so the canvas never taints and toDataURL works.
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("map image failed to load"));
    img.src = src;
  });
}

/**
 * A PNG data: URI of `region` cut from the page map, or null when the region
 * can't be cut — it sits past the bottom of the map image, or resolves to
 * something too small to read.
 */
export async function cropFromMap(
  mapSrc: string,
  page: PageMap,
  region: Region,
): Promise<string | null> {
  // The map stops before the document does on a very long page. A region below
  // that line was never photographed, and stretching the last row of pixels to
  // stand in for it would be a picture of the wrong thing.
  if (region.y >= page.shotH) return null;

  const img = await loadImage(mapSrc);
  // The image's own pixels per page pixel. Cooper reduces the device scale on
  // tall pages, so this is not always 1 — and it is the only place that matters.
  const k = img.naturalWidth / page.w;

  const sx = Math.max(0, Math.round(region.x * k));
  const sy = Math.max(0, Math.round(region.y * k));
  const sw = Math.min(img.naturalWidth - sx, Math.round(region.w * k));
  const sh = Math.min(img.naturalHeight - sy, Math.round(region.h * k));
  if (sw < MIN_EDGE || sh < MIN_EDGE) return null;

  // Upscale a small crop toward the share card's width. The pixels aren't there
  // to recover, but a 360px-wide button drawn at 360px into a 1080px card looks
  // like a mistake, and the browser's smoothing is kinder than nearest-neighbour.
  const grow = Math.min(MAX_EDGE / sw, MAX_EDGE / sh, 2);
  const dw = Math.round(sw * grow);
  const dh = Math.round(sh * grow);

  const canvas = document.createElement("canvas");
  canvas.width = dw;
  canvas.height = dh;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh);
  return canvas.toDataURL("image/png");
}
