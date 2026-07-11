"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Small copy-to-clipboard button used by prompt cards and ticket templates.
 * The copyable text itself always lives in the server-rendered markup; this
 * button only mirrors it to the clipboard.
 */
export default function CopyButton({
  text,
  label = "Copy",
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be unavailable (permissions, http); fail silently.
    }
  }, [text]);

  return (
    <button
      onClick={copy}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.04em",
        color: copied ? "#2f6b46" : "var(--text-muted)",
        background: copied ? "#e7f0e9" : "var(--surface)",
        border: `1px solid ${copied ? "#bcd6c4" : "var(--border)"}`,
        borderRadius: 7,
        padding: "6px 12px",
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      {copied ? "✓ Copied" : label}
    </button>
  );
}
