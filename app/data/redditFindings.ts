import type { CSSProperties } from "react";
import type { Severity, Effort } from "./findings";

// The mini roast for reddit.com is a scripted demo: instead of the waitlist we
// fake a 12s scan and land these six findings, taken verbatim from a real
// `cooper reddit.com` run. Every claim cites a named Law of UX (lawsofux.com).
export type RedditFinding = {
  sev: Severity;
  law: string; // the Law of UX the finding is grounded in
  title: string;
  why: string;
  fix: string;
  effort: Effort;
  url: string; // lawsofux.com reference for this law
};

export const REDDIT_FINDINGS: RedditFinding[] = [
  {
    sev: "Blocker",
    law: "Flow",
    title: "Read two posts, get body-blocked by a login wall",
    why: "A logged-out visitor is barely scrolling before a full-screen 'sign up / continue in the app' modal slams down mid-read, killing the exact immersion that would have turned a curious first-timer into a returning user. Interrupting people while they're engaged is the fastest way to make them close the tab.",
    fix: "Kill the scroll-triggered interstitial. Let anonymous users browse freely and move the sign-up nudge to a persistent, non-blocking bar or an offer that appears only on an intentional action (commenting, voting).",
    effort: "Quick win",
    url: "https://lawsofux.com/flow/",
  },
  {
    sev: "Major",
    law: "Doherty Threshold",
    title: "A text-and-links site that loads like a AAA game",
    why: "The redesigned feed ships a mountain of JavaScript, so posts pop in late, scrolling stutters, and taps feel laggy well past the 400ms where attention holds. People blame the whole product for feeling sluggish, and old.reddit.com exists precisely because so many fled the slowness.",
    fix: "Server-render the initial feed, trim client JS, and add real skeleton states plus optimistic voting so interactions feel instant instead of buffering.",
    effort: "Deep fix",
    url: "https://lawsofux.com/doherty-threshold/",
  },
  {
    sev: "Major",
    law: "Selective Attention",
    title: "Your ads dress up as posts, so nobody sees either",
    why: "Promoted posts are styled almost identically to organic ones, so users learn to auto-skip anything vaguely ad-shaped — and that banner blindness bleeds onto real content in the same slots. Ads that hide get ignored; content that looks like an ad gets ignored too. Everyone loses.",
    fix: "Give sponsored content a clearly distinct, honestly-labeled treatment so organic posts visually earn the attention users are trying to give them.",
    effort: "Quick win",
    url: "https://lawsofux.com/selective-attention/",
  },
  {
    sev: "Major",
    law: "Hick's Law",
    title: "Five ways to sort an infinite pile you'll never finish",
    why: "Before a newcomer has read a single post they're hit with Best / Hot / Top / New / Rising, a wall of 'popular communities,' and a bottomless feed — every extra choice slows the one decision that matters: start reading. Decision paralysis at the door means a higher bounce.",
    fix: "Default anonymous users to one smart sort, collapse the rest behind a single control, and defer the community firehose until after they've engaged.",
    effort: "Quick win",
    url: "https://lawsofux.com/hicks-law/",
  },
  {
    sev: "Minor",
    law: "Cognitive Load",
    title: "The sidebar is a junk drawer with a scrollbar",
    why: "Dense rails of recent communities, popular topics, resources, and legal links crowd the periphery with noise that has nothing to do with the post someone came to read. Every extraneous element taxes limited attention and makes the page feel busier than the content warrants.",
    fix: "Prune the sidebars to a couple of genuinely useful modules and let the feed breathe.",
    effort: "Quick win",
    url: "https://lawsofux.com/cognitive-load/",
  },
  {
    sev: "Minor",
    law: "Jakob's Law",
    title: "So unfamiliar its own users kept the old site alive",
    why: "The redesign reinvented card layouts, navigation, and interaction patterns that long-time users already had muscle memory for, forcing them to relearn basics — the reason old.reddit.com still has a loyal following. Novelty that makes people relearn a site they already knew costs you trust.",
    fix: "Realign core navigation and post interactions with the conventions users expect from feed-based sites and from Reddit's own prior design.",
    effort: "Deep fix",
    url: "https://lawsofux.com/jakobs-law/",
  },
];

// Severity chip styling, matching the roast mockup (Blocker = accent fill,
// Major = yellow fill, Minor = hollow).
export const REDDIT_SEV_STYLE: Record<Severity, CSSProperties> = {
  Blocker: { background: "var(--accent)", color: "#fff", border: "1px solid var(--accent)" },
  Major: { background: "var(--yellow)", color: "var(--ink)", border: "1px solid var(--yellow)" },
  Minor: { background: "transparent", color: "var(--text-muted)", border: "1px solid #cfc8ba" },
};

export const REDDIT_EFFORT_STYLE: Record<Effort, { label: string; style: CSSProperties }> = {
  "Quick win": {
    label: "⚡ Quick win",
    style: { background: "#e7f0e9", color: "#2f6b46" },
  },
  "Deep fix": {
    label: "⚒ Deep fix",
    style: { background: "#f3e9e4", color: "#9a4a2c" },
  },
};

// A run detects reddit.com or any of its subdomains (old./www./np./sh. etc.),
// with or without a scheme, path, or query. Anything else falls through to the
// normal waitlist flow.
export function isRedditUrl(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return false;
  // Grab the host: strip scheme, then take everything up to the first / ? #.
  const host = trimmed
    .replace(/^[a-z]+:\/\//i, "")
    .replace(/^www\./i, "")
    .split(/[/?#]/)[0]
    .toLowerCase();
  return host === "reddit.com" || host.endsWith(".reddit.com");
}

// Severity tally for the results header, e.g. "1 Blocker · 3 Major · 2 Minor".
export function severityTally(findings: RedditFinding[]): { sev: Severity; count: number }[] {
  const order: Severity[] = ["Blocker", "Major", "Minor"];
  return order
    .map((sev) => ({ sev, count: findings.filter((f) => f.sev === sev).length }))
    .filter((entry) => entry.count > 0);
}
