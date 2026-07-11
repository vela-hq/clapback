"use client";

import { useState } from "react";

/* The signup friction ledger. Deliberately does NOT compute a fake
   "abandonment percentage": stacking survey stats from different studies
   into one number would be exactly the kind of invented math this article
   calls out. Each toggled friction shows its real evidence tag instead,
   and the verdict is graded by count. All row text renders server-side. */

type Friction = {
  id: string;
  label: string;
  evidence: string;
};

const FRICTIONS: Friction[] = [
  {
    id: "forced-account",
    label: "Account required before the product shows any value",
    evidence:
      "Baymard 2025: 19% of US online shoppers cite “the site wanted me to create an account” as a reason they abandoned (checkout survey).",
  },
  {
    id: "fields",
    label: "More than 8 form fields before you're in",
    evidence:
      "Baymard 2024: checkouts average 11.3 fields where ~8 are needed. Direction documented; the per-field percentages other blogs quote are not.",
  },
  {
    id: "password-rules",
    label: "Password rules revealed only after a failed submit",
    evidence:
      "Baymard: complex password rules cost up to ~19% of returning users. NN/g: disclose constraints up front.",
  },
  {
    id: "verification-wall",
    label: "Email verification wall before first value",
    evidence:
      "No rigorous benchmark exists. Closest measured analog: 18.75% abandoned when a flow stalled on a reset email (Baymard).",
  },
  {
    id: "redundant",
    label: "Asks for the same information twice",
    evidence:
      "WCAG 3.3.7 Redundant Entry (Level A). A written standard, not a statistic: this one fails an audit outright.",
  },
  {
    id: "no-inline",
    label: "No inline validation: errors appear only on submit",
    evidence:
      "Wroblewski/Etre 2009: inline validation gave +22% success and -42% completion time. Small sample; documented direction, magnitude varies.",
  },
  {
    id: "no-toggle",
    label: "No show-password toggle",
    evidence:
      "NN/g 2009: masking with no reveal option hurts usability. Documented direction, no reliable magnitude.",
  },
];

type Verdict = { title: string; body: string; bg: string };

function verdictFor(count: number): Verdict {
  if (count === 0) {
    return {
      title: "Clean gauntlet",
      body: "Either your signup is genuinely lean, or you graded it from memory. Have someone who has never seen it run it while you watch.",
      bg: "#e7f0e9",
    };
  }
  if (count <= 2) {
    return {
      title: "Leaking",
      body: "Not fatal, but every toggled row carries its own receipt. Most of these are about an hour of work to remove.",
      bg: "#fdf3d7",
    };
  }
  if (count <= 4) {
    return {
      title: "Your signup is a bouncer",
      body: "You are vetting people before they have seen the party. Each check above is a documented reason for them to walk.",
      bg: "rgba(232, 68, 42, 0.08)",
    };
  }
  return {
    title: "The product better be incredible",
    body: "Only users who already decided they need you will survive this. Everyone still deciding is gone, and they never tell you why.",
    bg: "rgba(232, 68, 42, 0.14)",
  };
}

const mono: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11.5,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
};

export default function FrictionLedger() {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const count = FRICTIONS.filter((f) => on[f.id]).length;
  const verdict = verdictFor(count);

  const toggle = (id: string) => setOn((c) => ({ ...c, [id]: !c[id] }));

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        margin: "26px 0",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "14px 22px",
          background: "var(--surface-soft)",
          borderBottom: "1px solid var(--border-soft)",
        }}
      >
        <span style={{ ...mono, color: "var(--accent)" }}>
          The signup friction ledger
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 18,
            color: "var(--ink)",
          }}
        >
          {count}
          <span style={{ color: "var(--text-faint)", fontWeight: 500 }}>
            {" "}/ {FRICTIONS.length} frictions
          </span>
        </span>
      </div>

      <div style={{ padding: "10px 22px 6px" }}>
        {FRICTIONS.map((f) => {
          const checked = Boolean(on[f.id]);
          return (
            <label
              key={f.id}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                padding: "12px 0",
                borderTop: "1px solid var(--border-soft)",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(f.id)}
                style={{
                  width: 17,
                  height: 17,
                  marginTop: 3,
                  accentColor: "var(--accent)",
                  flexShrink: 0,
                  cursor: "pointer",
                }}
              />
              <span style={{ fontSize: 15.5, lineHeight: 1.55 }}>
                <span
                  style={{
                    color: checked ? "var(--ink)" : "var(--text)",
                    fontWeight: checked ? 600 : 400,
                  }}
                >
                  {f.label}
                </span>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    lineHeight: 1.5,
                    marginTop: 4,
                    paddingLeft: 10,
                    borderLeft: checked
                      ? "2px solid var(--accent)"
                      : "2px solid var(--border-soft)",
                    color: checked ? "var(--text-muted)" : "var(--text-faint)",
                  }}
                >
                  {f.evidence}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      <div
        style={{
          margin: "10px 22px 18px",
          background: verdict.bg,
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "16px 20px",
        }}
      >
        <div style={{ ...mono, color: "var(--text-muted)", marginBottom: 6 }}>
          Verdict
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 19,
            color: "var(--ink)",
            marginBottom: 4,
          }}
        >
          {verdict.title}
        </div>
        <div style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--text)" }}>
          {verdict.body}
        </div>
      </div>

      <div
        style={{
          padding: "0 22px 16px",
          fontSize: 12.5,
          color: "var(--text-faint)",
        }}
      >
        No invented math: each line shows its actual evidence, or admits the
        magnitude is unmeasured. Nothing is saved or sent anywhere.
      </div>
    </div>
  );
}
