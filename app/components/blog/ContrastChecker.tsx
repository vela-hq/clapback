"use client";

import { useMemo, useState } from "react";

/* Live WCAG 2.x contrast checker. Pure client math, no dependencies:
   relative luminance per WCAG definition, ratio = (L1 + 0.05) / (L2 + 0.05). */

function channel(v: number) {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function luminance(hex: string) {
  const h = hex.replace("#", "");
  const full =
    h.length === 3 ? h.split("").map((c) => c + c).join("") : h.padEnd(6, "0");
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function ratio(a: string, b: string) {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

const box: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  padding: "22px 24px",
  margin: "26px 0",
};

const label: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11.5,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--text-muted)",
};

function Verdict({ pass, name, need }: { pass: boolean; name: string; need: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "9px 0",
        borderTop: "1px solid var(--border-soft)",
        fontSize: 14.5,
      }}
    >
      <span>
        <strong style={{ color: "var(--ink)", fontWeight: 600 }}>{name}</strong>
        <span style={{ color: "var(--text-faint)" }}> · needs {need}</span>
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          fontWeight: 600,
          padding: "3px 12px",
          borderRadius: 100,
          background: pass ? "#e7f0e9" : "var(--accent-strong)",
          color: pass ? "#2f6b46" : "#fff",
        }}
      >
        {pass ? "PASS" : "FAIL"}
      </span>
    </div>
  );
}

export default function ContrastChecker() {
  const [fg, setFg] = useState("#9aa0a6");
  const [bg, setBg] = useState("#ffffff");

  const r = useMemo(() => ratio(fg, bg), [fg, bg]);
  const rounded = Math.round(r * 100) / 100;

  return (
    <div style={box}>
      <div style={{ ...label, marginBottom: 14, color: "var(--accent)" }}>
        Try it · WCAG contrast checker
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={label}>Text</span>
          <input
            type="color"
            value={fg}
            onChange={(e) => setFg(e.target.value)}
            aria-label="Text color"
            style={{ width: 44, height: 34, border: "1px solid var(--border)", borderRadius: 8, padding: 2, background: "var(--surface)", cursor: "pointer" }}
          />
          <code style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>{fg}</code>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={label}>Background</span>
          <input
            type="color"
            value={bg}
            onChange={(e) => setBg(e.target.value)}
            aria-label="Background color"
            style={{ width: 44, height: 34, border: "1px solid var(--border)", borderRadius: 8, padding: 2, background: "var(--surface)", cursor: "pointer" }}
          />
          <code style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>{bg}</code>
        </label>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          margin: "18px 0 14px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            background: bg,
            color: fg,
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "14px 22px",
            fontSize: 16,
            minWidth: 220,
          }}
        >
          Sign up free →
        </div>
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 34,
              letterSpacing: "-0.02em",
              color: r >= 4.5 ? "#2f6b46" : "var(--accent)",
              lineHeight: 1,
            }}
          >
            {rounded}:1
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
            contrast ratio
          </div>
        </div>
      </div>

      <Verdict pass={r >= 4.5} name="Normal text · AA" need="4.5:1" />
      <Verdict pass={r >= 3} name="Large text (24px+) · AA" need="3:1" />
      <Verdict pass={r >= 3} name="UI components, icons, borders" need="3:1" />
      <Verdict pass={r >= 7} name="Normal text · AAA" need="7:1" />

      <div style={{ fontSize: 13, color: "var(--text-faint)", marginTop: 12 }}>
        Ratio per WCAG 2.2, success criterion 1.4.3 (text) and 1.4.11 (non-text).
        Defaults shown: the gray-on-white an AI code generator loves to ship.
      </div>
    </div>
  );
}
