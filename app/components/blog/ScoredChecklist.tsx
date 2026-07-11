"use client";

import { useMemo, useState } from "react";

/* Interactive scored checklist. All check text is rendered server-side on
   first paint (client components still SSR), so crawlers see every item.
   State is check/uncheck only; the verdict tiers carry the roast. */

export type CheckItem = {
  id: string;
  text: string;
  rule: string;
};

export type CheckGroup = {
  title: string;
  items: CheckItem[];
};

export type VerdictTier = {
  /** Minimum share of passed checks (0..1) for this tier. */
  min: number;
  title: string;
  body: string;
};

const mono: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11.5,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
};

export default function ScoredChecklist({
  groups,
  tiers,
  storageNote = "Score updates as you check. Nothing is saved or sent anywhere.",
}: {
  groups: CheckGroup[];
  tiers: VerdictTier[];
  storageNote?: string;
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const total = useMemo(
    () => groups.reduce((n, g) => n + g.items.length, 0),
    [groups],
  );
  const passed = Object.values(checked).filter(Boolean).length;
  const share = total === 0 ? 0 : passed / total;

  const tier = useMemo(() => {
    const sorted = [...tiers].sort((a, b) => b.min - a.min);
    return sorted.find((t) => share >= t.min) ?? sorted[sorted.length - 1];
  }, [tiers, share]);

  const toggle = (id: string) =>
    setChecked((c) => ({ ...c, [id]: !c[id] }));

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
          position: "sticky",
          top: 59,
          zIndex: 5,
        }}
      >
        <span style={{ ...mono, color: "var(--accent)" }}>Score yourself</span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 18,
            color: "var(--ink)",
          }}
        >
          {passed}
          <span style={{ color: "var(--text-faint)", fontWeight: 500 }}>
            {" "}/ {total} pass
          </span>
        </span>
      </div>

      {groups.map((group) => (
        <div key={group.title} style={{ padding: "16px 22px 6px" }}>
          <div style={{ ...mono, color: "var(--text-muted)", marginBottom: 10 }}>
            {group.title}
          </div>
          {group.items.map((item) => {
            const on = Boolean(checked[item.id]);
            return (
              <label
                key={item.id}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderTop: "1px solid var(--border-soft)",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(item.id)}
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
                  <span style={{ color: on ? "var(--text-faint)" : "var(--text)" }}>
                    {item.text}
                  </span>{" "}
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11.5,
                      color: "var(--text-faint)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.rule}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      ))}

      <div
        style={{
          margin: "10px 22px 22px",
          background: share >= 0.85 ? "#e7f0e9" : share >= 0.6 ? "#fdf3d7" : "rgba(232, 68, 42, 0.08)",
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
          {tier.title}
        </div>
        <div style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--text)" }}>
          {tier.body}
        </div>
      </div>

      <div
        style={{
          padding: "0 22px 16px",
          fontSize: 12.5,
          color: "var(--text-faint)",
        }}
      >
        {storageNote}
      </div>
    </div>
  );
}
