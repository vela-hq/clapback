import type { Shot } from "../components/Mockup";

export type Severity = "Blocker" | "Major" | "Minor";
export type Effort = "Quick win" | "Deep fix";

export type Finding = {
  sev: Severity;
  cat: string;
  rule: string;
  ruleShort: string;
  title: string;
  shot: Shot;
  why: string;
  fix: string;
  effort: Effort;
};

export const FINDINGS: Finding[] = [
  {
    sev: "Blocker",
    cat: "Forms",
    rule: "Nielsen #9 · Recover from errors",
    ruleShort: "Nielsen #9",
    title: "Creating an account is a guessing game",
    shot: "signup-error",
    why: "Your form rejects the password with a generic error. Users have no idea it needs a number, so they assume your product is broken and leave.",
    fix: "Inline, field-level validation that shows the requirements before submit, not a vague banner after.",
    effort: "Quick win",
  },
  {
    sev: "Blocker",
    cat: "Accessibility",
    rule: "WCAG 1.4.3 · Contrast (Minimum)",
    ruleShort: "WCAG 1.4.3",
    title: "1 in 12 men can't see your buy button",
    shot: "dashboard-cta",
    why: "Your most important button sits at 2.1:1 contrast. Roughly 1 in 12 men literally cannot find the thing you most want them to click.",
    fix: "Raise contrast to at least 4.5:1. Realistically this is one CSS variable.",
    effort: "Quick win",
  },
  {
    sev: "Major",
    cat: "Cognitive load",
    rule: "Hick's Law",
    ruleShort: "Hick's Law",
    title: "Six pricing tiers, chosen by nobody",
    shot: "pricing-page",
    why: "Six tiers with eleven feature rows each. Paradox of choice kicks in and people pick nothing. Your pricing page is a decision-paralysis machine.",
    fix: "Collapse to three tiers, highlight one, push the full matrix below the fold.",
    effort: "Deep fix",
  },
  {
    sev: "Major",
    cat: "Onboarding",
    rule: "Nielsen #1 · Visibility of status",
    ruleShort: "Nielsen #1",
    title: "Onboarding is a road with no end in sight",
    shot: "onboarding-step3",
    why: "There's no stepper, so users can't tell if they're almost done or stuck in an infinite hellscape. Most bail right at step 3.",
    fix: "Add a stepper with explicit “step X of 5” labeling and a clear finish line.",
    effort: "Quick win",
  },
  {
    sev: "Minor",
    cat: "Visual hierarchy",
    rule: "Law of Proximity",
    ruleShort: "Proximity",
    title: "Saving and self-destruct look identical",
    shot: "settings-account",
    why: "Settings groups unrelated toggles together and splits related ones apart. A destructive action is one pixel from Save, so someone will rage-quit by accident.",
    fix: "Regroup by function, add spacing, and gate the destructive action behind a confirm.",
    effort: "Quick win",
  },
  {
    sev: "Minor",
    cat: "Trust signals",
    rule: "Law of Familiarity",
    ruleShort: "Familiarity",
    title: "Your checkout page looks like a scam",
    shot: "checkout-payment",
    why: "No security badges, no card-type icons, and the footer says 2021. The page looks abandoned, so users hesitate to enter card details.",
    fix: "Add familiar trust markers, card icons, and (please) fix the copyright year.",
    effort: "Quick win",
  },
];

export const SEVERITY_STYLE: Record<
  Severity,
  { bg: string; fg: string; border: string }
> = {
  Blocker: { bg: "var(--accent)", fg: "#fff", border: "none" },
  Major: { bg: "var(--yellow)", fg: "var(--ink)", border: "none" },
  Minor: { bg: "transparent", fg: "var(--text-muted)", border: "1px solid #d8d2c6" },
};

export const EFFORT_STYLE: Record<
  Effort,
  { bg: string; fg: string; label: string }
> = {
  "Quick win": { bg: "#e7f0e9", fg: "#2f6b46", label: "⚡ Quick win · ~1 hr" },
  "Deep fix": { bg: "#f3e9e4", fg: "#9a4a2c", label: "⚒ Deep fix · ~2 days" },
};
