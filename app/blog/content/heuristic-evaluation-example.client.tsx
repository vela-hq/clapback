"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

/* Client island for the Driftly heuristic evaluation: a drawn screen with a
   numbered pin that toggles the annotation, mirroring how findings are pinned
   to screenshots in a real ClapBack report. The annotation text is rendered
   in the initial HTML (hidden via CSS only when closed on the client). */

export default function AnnotatedShot({
  n,
  pinTop,
  pinLeft,
  note,
  children,
}: {
  n: number;
  pinTop: string;
  pinLeft: string;
  note: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const pin: CSSProperties = {
    position: "absolute",
    top: pinTop,
    left: pinLeft,
    width: 26,
    height: 26,
    borderRadius: "50%",
    background: "var(--accent)",
    color: "#fff",
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #fff",
    boxShadow: "0 4px 10px -3px rgba(232, 68, 42, 0.6)",
    cursor: "pointer",
    zIndex: 3,
    transition: "transform 0.15s ease",
    transform: open ? "scale(1.12)" : "none",
  };

  return (
    <div style={{ position: "relative" }}>
      {children}
      <button
        style={pin}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`Finding ${n}: ${open ? "hide" : "show"} annotation`}
      >
        {n}
      </button>
      <div
        style={{
          position: "absolute",
          left: 12,
          right: 12,
          bottom: 12,
          background: "rgba(26, 24, 21, 0.94)",
          color: "#f4f1ea",
          borderRadius: 10,
          padding: "12px 16px",
          fontSize: 13.5,
          lineHeight: 1.5,
          zIndex: 4,
          opacity: open ? 1 : 0,
          transform: open ? "none" : "translateY(6px)",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10.5,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--yellow)",
            display: "block",
            marginBottom: 4,
          }}
        >
          What the agent saw
        </span>
        {note}
      </div>
      {!open && (
        <div
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            fontFamily: "var(--font-mono)",
            fontSize: 10.5,
            color: "var(--text-muted)",
            background: "rgba(255,255,255,0.85)",
            border: "1px solid var(--border)",
            borderRadius: 100,
            padding: "3px 10px",
            pointerEvents: "none",
          }}
        >
          tap the pin
        </div>
      )}
    </div>
  );
}
