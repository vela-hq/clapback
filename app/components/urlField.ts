import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";
import { displayUrl } from "@/lib/url";

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
