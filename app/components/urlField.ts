import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";
import { displayUrl } from "@/lib/url";

// The ids the URL boxes render under. A CTA that isn't sitting next to a box —
// the navbar's, the toast's — has to be able to name the one it means.
export const HERO_URL_FIELD = "roast-url";
export const FINAL_URL_FIELD = "roast-url-final";
export const LAUNCHER_URL_FIELD = "roast-url-vertical";

// Take the visitor to the box and put the cursor in it. This is the answer to
// every CTA press with nothing behind it: the thing being asked for is a roast,
// a roast needs a URL, so the honest response is the field — not a modal asking
// for an email instead.
export function focusUrlField(id: string): void {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLInputElement)) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  // The smooth scroll above is already on its way; letting focus scroll too
  // fights it and lands the field somewhere else.
  el.focus({ preventScroll: true });
}

// Behaviour shared by the two URL boxes (Hero and FinalCta): the same field,
// rendered twice against the same `url` state in page.tsx.
//
// Normalizing on paste and blur rather than on every change is what leaves a
// path typeable: strip the trailing slash on each keystroke and "example.com/"
// collapses to "example.com" before "example.com/pricing" can ever be typed.
export function urlFieldProps(
  url: string,
  onUrlChange: (value: string) => void,
  onSubmit: () => void,
) {
  return {
    value: url,

    onChange: (e: ChangeEvent<HTMLInputElement>) => onUrlChange(e.target.value),

    onPaste: (e: ClipboardEvent<HTMLInputElement>) => {
      // Splice into the current selection by hand rather than replacing the
      // whole value, so pasting a domain onto a half-typed one still behaves.
      const el = e.currentTarget;
      const next =
        url.slice(0, el.selectionStart ?? url.length) +
        e.clipboardData.getData("text") +
        url.slice(el.selectionEnd ?? url.length);
      e.preventDefault();
      onUrlChange(displayUrl(next));
    },

    // Catches a scheme that was typed out instead of pasted.
    onBlur: () => onUrlChange(displayUrl(url)),

    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") onSubmit();
    },
  };
}
