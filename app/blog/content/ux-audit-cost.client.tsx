"use client";

import { useState } from "react";

/* CostPicker: advertised UX audit prices by provider type.
   All numbers are hardcoded from the ClapBack rate-card analysis of
   2026-07-10 (research fact pack B, "UX Audit Cost in 2026": 20 published
   offers, 12 providers; EUR converted at 1.10). Every figure was observed
   as a published price on the linked page on that date. Update the pack
   first, then this table. */

type Tier = {
  id: string;
  label: string;
  headline: string;
  headlineNote: string;
  rows: { label: string; value: string }[];
  includes: string[];
  sources: { label: string; href: string }[];
};

const TIERS: Tier[] = [
  {
    id: "marketplace",
    label: "Marketplace gigs",
    headline: "$188",
    headlineNote: "median of 8 Fiverr gigs, July 2026",
    rows: [
      { label: "Advertised range", value: "$35-$500" },
      { label: "Turnaround", value: "Set per gig by the seller" },
    ],
    includes: [
      "One reviewer walking your site or app",
      "Written notes or a video review",
      "Scope and depth vary wildly between sellers",
    ],
    sources: [
      {
        label: "Fiverr UX audit gigs",
        href: "https://www.fiverr.com/gigs/ux-audit",
      },
    ],
  },
  {
    id: "productized",
    label: "Productized",
    headline: "$1,114",
    headlineNote: "median of 8 published offers, July 2026",
    rows: [
      { label: "Advertised range", value: "$95-$3,179" },
      { label: "Turnaround", value: "48 hours to 30 business days" },
    ],
    includes: [
      "Video teardown or annotated report (Roastd, Uxitt)",
      "Redesigned sections in Figma (Uxitt, Oddit)",
      "Top tiers add user tests and support windows (CheckMyUX)",
    ],
    sources: [
      { label: "Roastd", href: "https://www.roastd.io/" },
      { label: "Uxitt", href: "https://www.uxitt.com/pricing" },
      { label: "CheckMyUX", href: "https://checkmyux.com/pricing/" },
      { label: "Oddit", href: "https://oddit.co/collections/ux-audit" },
    ],
  },
  {
    id: "agency",
    label: "Agency",
    headline: "$1,650-$15,000",
    headlineNote: "published rate cards (only 4 offers; most agencies quote on request)",
    rows: [
      { label: "Turnaround", value: "1 to 6 weeks" },
      { label: "Agency-blog quotes", value: "$3,000-$75,000+" },
    ],
    includes: [
      "Heuristic evaluation or cognitive walkthrough",
      "Wireframe concepts and opportunity analysis",
      "Top tiers: unmoderated testing, heatmaps, competitor review",
    ],
    sources: [
      {
        label: "Miquido",
        href: "https://www.miquido.com/services/ux-audit/",
      },
      {
        label: "Scenic West",
        href: "https://www.scenicwest.co/services/ux-audit",
      },
      {
        label: "ArtVersion",
        href: "https://artversion.com/blog/what-does-a-ux-audit-cost/",
      },
    ],
  },
  {
    id: "ai",
    label: "AI tools",
    headline: "$0-$49/mo",
    headlineNote: "self-serve tools, no human in the loop",
    rows: [
      { label: "Turnaround", value: "Instant" },
      {
        label: "Examples",
        value:
          "Roastd free audit · Attention Insight from $31/mo (Basic, monthly) · Contentsquare free to $49/mo",
      },
    ],
    includes: [
      "Predictive attention heatmaps",
      "Session replays and funnels",
      "Automated screenshot feedback; no severity calls, no tickets",
    ],
    sources: [
      {
        label: "Attention Insight",
        href: "https://attentioninsight.com/pricing/",
      },
      { label: "Contentsquare", href: "https://contentsquare.com/pricing/" },
      {
        label: "Roastd AI audit",
        href: "https://www.roastd.io/website-audit-tool-free",
      },
    ],
  },
];

const mono: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11.5,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
};

export default function CostPicker() {
  const [active, setActive] = useState("marketplace");
  const tier = TIERS.find((t) => t.id === active) ?? TIERS[0];

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
          padding: "14px 22px",
          background: "var(--surface-soft)",
          borderBottom: "1px solid var(--border-soft)",
        }}
      >
        <span style={{ ...mono, color: "var(--accent)" }}>
          What a UX audit actually costs · pick a provider type
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          padding: "16px 22px 0",
        }}
      >
        {TIERS.map((t) => {
          const on = t.id === active;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              aria-pressed={on}
              style={{
                ...mono,
                padding: "8px 14px",
                borderRadius: 8,
                border: on
                  ? "1px solid var(--accent)"
                  : "1px solid var(--border)",
                background: on ? "var(--accent)" : "var(--surface-soft)",
                color: on ? "#fff" : "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div style={{ padding: "18px 22px 6px" }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 34,
            lineHeight: 1.1,
            color: "var(--ink)",
          }}
        >
          {tier.headline}
        </div>
        <div
          style={{
            fontSize: 13.5,
            color: "var(--text-muted)",
            marginTop: 4,
          }}
        >
          {tier.headlineNote}
        </div>
      </div>

      <div style={{ padding: "10px 22px 4px" }}>
        {tier.rows.map((row) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              gap: 14,
              alignItems: "baseline",
              padding: "9px 0",
              borderTop: "1px solid var(--border-soft)",
            }}
          >
            <span
              style={{
                ...mono,
                color: "var(--text-faint)",
                flexShrink: 0,
                minWidth: 140,
              }}
            >
              {row.label}
            </span>
            <span style={{ fontSize: 15, color: "var(--text)" }}>
              {row.value}
            </span>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "baseline",
            padding: "9px 0",
            borderTop: "1px solid var(--border-soft)",
          }}
        >
          <span
            style={{
              ...mono,
              color: "var(--text-faint)",
              flexShrink: 0,
              minWidth: 140,
            }}
          >
            What you get
          </span>
          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              fontSize: 15,
              lineHeight: 1.6,
              color: "var(--text)",
            }}
          >
            {tier.includes.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "baseline",
            padding: "9px 0",
            borderTop: "1px solid var(--border-soft)",
          }}
        >
          <span
            style={{
              ...mono,
              color: "var(--text-faint)",
              flexShrink: 0,
              minWidth: 140,
            }}
          >
            Receipts
          </span>
          <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
            {tier.sources.map((s, i) => (
              <span key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--accent)" }}
                >
                  {s.label}
                </a>
                {i < tier.sources.length - 1 && " · "}
              </span>
            ))}
          </span>
        </div>
      </div>

      <div
        style={{
          padding: "12px 22px 16px",
          fontSize: 12.5,
          lineHeight: 1.55,
          color: "var(--text-faint)",
        }}
      >
        ClapBack analysis of 20 published rate cards, July 2026. Advertised
        prices only; sellers who publish prices skew toward the cheap end.
        EUR converted at 1.10.
      </div>
    </div>
  );
}
