// Central registry for every Receipts article. The [slug] route, the listing
// page, the sitemap, and per-article OG images all read from here so metadata
// lives in exactly one place.

export type ArticleFaq = { q: string; a: string };

export type ArticleMeta = {
  slug: string;
  /** SEO <title>, tuned for the query. */
  title: string;
  /** On-page headline. Same claim as `title`, allowed to be roastier. */
  h1: string;
  /** Meta description. */
  description: string;
  /** Standfirst under the headline, and the hook on listing cards. */
  excerpt: string;
  /** Eyebrow label, also used to group cards on the listing page. */
  category: string;
  datePublished: string;
  dateModified: string;
  readingMinutes: number;
  keywords: string[];
  /** Rendered as an FAQ section and emitted as FAQPage JSON-LD. */
  faq?: ArticleFaq[];
  /** Slugs of related articles, linked from the article footer. */
  related: string[];
};

export const BLOG_NAME = "Receipts";
export const BLOG_TAGLINE =
  "UX evidence for people who ship. No vibes, no 40-slide decks.";

export const ARTICLES: ArticleMeta[] = [
  {
    slug: "what-is-an-ai-ux-audit",
    title: "What is an AI UX audit? The four kinds, and what they miss",
    h1: "What an AI UX audit actually is (and what it can't catch)",
    description:
      "AI UX audits split into four methods: heatmap predictors, screenshot reviews, synthetic users, and agents that use your product. What each finds, costs, and misses.",
    excerpt:
      "Four very different technologies sell under one label. The difference that matters: does the AI look at your product, or does it use it? Receipts included, ours too.",
    category: "AI audits",
    datePublished: "2026-07-10",
    dateModified: "2026-07-10",
    readingMinutes: 9,
    keywords: [
      "AI UX audit",
      "automated UX audit",
      "AI usability testing",
      "AI UX audit tools",
      "can AI do a UX audit",
      "AI website audit",
    ],
    faq: [
      {
        q: "Can AI replace a UX researcher?",
        a: "No. AI audits find rule-checkable defects (broken flows, contrast failures, missing feedback) fast and cheap. Understanding why users behave the way they do still requires research with real people, as NN/g's synthetic-users guidance makes explicit.",
      },
      {
        q: "How accurate are AI UX audits?",
        a: "It depends on the method. Baymard measured an 80% false-positive rate for screenshot-based ChatGPT-4 audits in 2023, and found the model caught only 14% of live-page issues because roughly half of real issues require interacting with the page. Agent-based audits that operate the product avoid that structural blind spot, and citing named rules makes each finding checkable.",
      },
      {
        q: "How long does an AI UX audit take?",
        a: "Minutes for most products, under an hour for large ones, versus 1 to 6 weeks for a typical human-run audit. Agent-based runs spend most of that time actually using the product: signing up, submitting forms, and breaking flows.",
      },
      {
        q: "How much does an AI UX audit cost?",
        a: "Subscription tools run from free tiers to $199 per month depending on the method family. ClapBack is a one-time scan from $49. Human audits advertise anywhere from $35 gig listings to $15,000 agency packages, per our analysis of 20 published rate cards.",
      },
    ],
    related: [
      "ai-agents-vs-synthetic-users-vs-real-users",
      "ux-audit-cost",
      "chatgpt-ux-audit-prompts",
    ],
  },
  {
    slug: "heuristic-evaluation-example",
    title: "Heuristic evaluation example: a full 10-heuristic UX roast",
    h1: "A complete heuristic evaluation, run on the worst app we could imagine",
    description:
      "A worked heuristic evaluation example: all 10 Nielsen heuristics applied to a fictional SaaS, with drawn screens, severity ratings, and ticket-ready fixes.",
    excerpt:
      "Most guides list Nielsen's 10 heuristics and stop. This one runs the entire method on Driftly, a fictional project tracker that violates every single one, and shows the report card.",
    category: "Teardown",
    datePublished: "2026-07-10",
    dateModified: "2026-07-10",
    readingMinutes: 11,
    keywords: [
      "heuristic evaluation example",
      "Nielsen heuristics examples",
      "10 usability heuristics",
      "SaaS UX mistakes",
      "bad UX examples",
      "usability audit example",
    ],
    faq: [
      {
        q: "What are the 10 usability heuristics?",
        a: "Jakob Nielsen's 10 usability heuristics (1994): visibility of system status, match between system and the real world, user control and freedom, consistency and standards, error prevention, recognition rather than recall, flexibility and efficiency of use, aesthetic and minimalist design, help users recognize, diagnose, and recover from errors, and help and documentation.",
      },
      {
        q: "How long does a heuristic evaluation take?",
        a: "A single-evaluator pass over 3 core flows takes half a day to two days depending on product size. Traditional multi-evaluator studies take longer; agent-based tools compress the walk-through to under an hour.",
      },
      {
        q: "What severity scale should I use for usability problems?",
        a: "NN/g rates severity 0 to 4 based on frequency, impact, and persistence. In practice, three tiers map cleanly to a ticket queue: Blocker (users fail or lose work), Major (users struggle), Minor (friction).",
      },
      {
        q: "Is a heuristic evaluation the same as a UX audit?",
        a: "A heuristic evaluation is one method inside a UX audit. Audits typically combine heuristics with accessibility checks (WCAG), analytics review, and flow walk-throughs.",
      },
    ],
    related: [
      "founder-ux-audit-checklist",
      "ux-findings-to-jira-tickets",
      "why-users-abandon-signup",
    ],
  },
  {
    slug: "ux-statistics-sources",
    title: "Famous UX statistics, traced to their sources: 17 verdicts",
    h1: "We traced 17 famous UX statistics to their sources. Five have none.",
    description:
      "We traced 17 famous UX statistics to primary sources. 5 are untraceable, 5 distorted. Every verdict has the citation chain and a copy-ready safe version.",
    excerpt:
      "The $1-to-$100 Forrester stat has no Forrester report behind it. The Stanford 75% is really 46.1% of comments. A filterable ledger of every verdict, with primary sources and citations that hold up.",
    category: "Receipts",
    datePublished: "2026-07-10",
    dateModified: "2026-07-10",
    readingMinutes: 10,
    keywords: [
      "UX statistics",
      "UX ROI statistics",
      "UX statistics sources",
      "is the 1 to 100 UX ROI stat real",
      "cart abandonment statistics",
      "UX research statistics",
      "debunked UX statistics",
    ],
    faq: [
      {
        q: "Is the every $1 in UX returns $100 statistic real?",
        a: "No. The earliest findable instance is a 2015 Forbes Council post by a UX-agency CEO, with no Forrester report behind it. It is most likely a mutation of an unsourced rule of thumb from a 2001 IBM marketing page.",
      },
      {
        q: "Do 5 users really find 85% of usability problems?",
        a: "Only under conditions. Nielsen and Landauer's 1993 model gives 85% when the average user exposes 31% of problems; with harder-to-detect problems five users find far less, and Spool and Schroeder measured about 35% on complex sites. It is guidance for iterative qualitative testing, not a law.",
      },
      {
        q: "What percentage of users judge credibility by design?",
        a: "Stanford's actual finding (Fogg et al., 2003, n=2,684) is that design look was mentioned in 46.1% of participants' comments about site credibility, the most-cited single factor. The widely quoted 75% appears in no Stanford publication.",
      },
      {
        q: "What is the current average cart abandonment rate?",
        a: "Baymard's running meta-average across 50 studies is 70.22% as of 2026. The often-quoted 70.19% is an older snapshot of the same living number.",
      },
      {
        q: "How many homepages fail contrast requirements?",
        a: "83.9% of the top one million home pages had text failing WCAG 2 AA contrast in the 2026 WebAIM Million report, the most common accessibility failure for the eighth straight year.",
      },
    ],
    related: [
      "why-users-abandon-signup",
      "ux-audit-cost",
      "heuristic-evaluation-example",
    ],
  },
  {
    slug: "ux-audit-cost",
    title: "UX audit cost in 2026: real prices from 20 published offers",
    h1: "UX audit cost in 2026: the median is $500, not $25,000",
    description:
      "A UX audit costs $35 to $15,000. ClapBack analyzed 20 published rate cards (July 2026): median $500. Real prices by provider type, and what's worth it.",
    excerpt:
      "Agency blogs say $3,000 to $75,000. The 20 sellers who actually publish prices say median $500. We pulled every rate card we could find and show the math, the caveats, and which tier fits your stage.",
    category: "Money",
    datePublished: "2026-07-10",
    dateModified: "2026-07-10",
    readingMinutes: 8,
    keywords: [
      "UX audit cost",
      "how much does a UX audit cost",
      "UX audit pricing",
      "UX audit price 2026",
      "is a UX audit worth it",
      "UX audit cost for startup",
      "website UX audit cost",
      "how long does a UX audit take",
    ],
    faq: [
      {
        q: "How much does a UX audit cost?",
        a: "Advertised prices run $35 to $15,000. Across 20 published offers ClapBack analyzed in July 2026, the median was $500, or $1,775 excluding gig marketplaces. Agencies that quote on request typically cite $3,000 to $25,000 and up.",
      },
      {
        q: "How much does a UX audit cost for a startup?",
        a: "For a live product without a UX hire, $49 to roughly $1,100 covers the useful range: agent-based audits start at $49 one-time, Fiverr gigs run $35 to $500, and productized services have a median of $1,114. Save agency budgets ($1,650 to $15,000 on published rate cards) for when you need research with real users.",
      },
      {
        q: "How long does a UX audit take?",
        a: "Human-run audits take 48 hours to 30 business days depending on tier; Baymard's full-site audit takes 17 to 25 business days. AI and agent-based audits return findings in minutes. Add your own hours for kickoff, access setup, and turning findings into tickets.",
      },
      {
        q: "Is a UX audit worth it?",
        a: "No recent independent study proves a specific ROI. NN/g's self-reported data showed average usability KPI improvements of 135% in 2003, falling to 83% in a later survey, and Baymard backs its audits with a positive-ROI-or-free guarantee. Price the audit against the funnel problem it targets, and ignore the unverifiable claim that $1 in UX returns $100.",
      },
      {
        q: "What is included in a UX audit?",
        a: "At $35 to $500: one reviewer's walkthrough with written or video feedback. At roughly $500 to $3,200: annotated reports, Figma redesigns of key sections, and sometimes a user test. At $1,650 to $15,000: heuristic evaluation, usability testing with real users, heatmap analysis, wireframes, and competitor review.",
      },
    ],
    related: [
      "what-is-an-ai-ux-audit",
      "founder-ux-audit-checklist",
      "ux-statistics-sources",
    ],
  },
  {
    slug: "founder-ux-audit-checklist",
    title: "The founder's UX audit checklist: 24 checks, no designer",
    h1: "The founder's UX audit checklist: 24 checks, 3 flows, one afternoon",
    description:
      "A DIY UX audit checklist for founders: 24 yes/no checks across signup, onboarding, and your core flow, each tied to a named rule. Score yourself as you go.",
    excerpt:
      "Whole-product audits are noise before product-market fit. Audit the 3 flows every user actually hits: signup, first session, core loop. 24 falsifiable checks, each with a named rule, scored live as you tick.",
    category: "Do it yourself",
    datePublished: "2026-07-10",
    dateModified: "2026-07-10",
    readingMinutes: 10,
    keywords: [
      "UX audit checklist",
      "DIY UX audit",
      "how to do a UX audit yourself",
      "UX audit without a designer",
      "founder UX audit",
      "self-serve UX audit",
      "SaaS onboarding audit",
    ],
    faq: [
      {
        q: "How do I do a UX audit without a designer?",
        a: "Scope to the 3 flows every user hits: signup, first session, and your core loop. Walk each one in an incognito browser and on a real phone while screen-recording, then answer a set of falsifiable checks tied to named rules (Nielsen's heuristics, WCAG 2.2, Laws of UX). Write every failure as a ticket with a severity.",
      },
      {
        q: "How long does a DIY UX audit take?",
        a: "An afternoon: roughly 1 hour per flow for 3 flows, plus an hour turning failures into tickets. Whole-product audits take days and, at pre-PMF stage, mostly surface low-priority noise.",
      },
      {
        q: "How often should I audit my product's UX?",
        a: "Re-run the 3-flow audit whenever signup or onboarding changes materially, and quarterly otherwise. Re-test safety nets like password reset and undo monthly; they break silently and users rarely report them.",
      },
      {
        q: "What should a UX audit checklist include?",
        a: "Falsifiable yes/no checks tied to named rules: signup field count, inline validation, visible password rules, a tested reset flow, visible labels, 4.5:1 contrast, 24px tap targets, visible focus, undo for destructive actions, progress indicators, empty states, and consistently placed help.",
      },
      {
        q: "Can I audit my own product's UX, or am I too biased?",
        a: "You can reliably catch rule violations: contrast, missing undo, hidden password rules. You cannot catch comprehension problems, because familiarity has made you blind to them. For those, add fresh eyes: 5 real users or an agent that walks in cold.",
      },
    ],
    related: [
      "heuristic-evaluation-example",
      "why-users-abandon-signup",
      "ux-findings-to-jira-tickets",
    ],
  },
  {
    slug: "why-users-abandon-signup",
    title: "Why users abandon signup (and the numbers everyone misquotes)",
    h1: "Your signup is a bouncer, and the line outside is leaving",
    description:
      "A step-by-step teardown of the SaaS signup gauntlet: form fields, password rules, verification walls, with primary-source numbers other blogs misquote.",
    excerpt:
      "Every signup post recycles the same abandonment stats, and half are stale. We walk the five-step signup gauntlet with primary-source receipts, correct the famous 26% myth to Baymard's current 19%, and ship each fix as a ticket.",
    category: "Teardown",
    datePublished: "2026-07-10",
    dateModified: "2026-07-10",
    readingMinutes: 8,
    keywords: [
      "why users abandon signup",
      "signup flow best practices",
      "signup form abandonment",
      "forced account creation",
      "email verification drop-off",
      "signup form fields",
      "password rules UX",
    ],
    faq: [
      {
        q: "How many form fields should a signup have?",
        a: "As few as the first session genuinely needs, often just email and password. For scale: Baymard's 2024 checkout benchmark found an average of 11.3 fields where about 8 are needed. The relationship is not linear (motivated users tolerate long forms, per CXL's review of A/B data), so cut what you don't need rather than chasing a magic number.",
      },
      {
        q: "Does forced account creation hurt conversion?",
        a: "Yes. In Baymard's current survey of US online shoppers (page updated September 2025), 19% cited 'the site wanted me to create an account' as a reason they abandoned a checkout. The 24% figure many blogs still quote is from Baymard's 2021 to 2022 survey wave; a later round said 26%.",
      },
      {
        q: "Should I require email verification before login?",
        a: "Avoid it before first value where you can. No rigorous public study quantifies verification drop-off, but the failure mode is measured: Baymard observed 18.75% abandonment when a flow stalled waiting for a password-reset email. Verify in the background and gate only the actions that need a proven address.",
      },
      {
        q: "What is the best signup flow for SaaS?",
        a: "Show value before demanding an account, ask only what the first session needs, disclose password rules up front with a show-password toggle, validate inline on blur, defer email verification, and land new users on a first screen with one obvious action instead of an empty dashboard.",
      },
      {
        q: "What is a good activation rate after signup?",
        a: "In a 2022 survey of 500+ products by Lenny Rachitsky and Yuriy Timen, average activation was 34% and the median 25% (SaaS: 36% average, 30% median). Definitions are self-reported and vary by company, so treat these as orientation, not targets.",
      },
    ],
    related: [
      "founder-ux-audit-checklist",
      "heuristic-evaluation-example",
      "ux-statistics-sources",
    ],
  },
  {
    slug: "chatgpt-ux-audit-prompts",
    title: "ChatGPT UX audit prompts: 4 that work, and the wall they hit",
    h1: "4 ChatGPT UX audit prompts that work (and the wall they all hit)",
    description:
      "4 copy-paste ChatGPT UX audit prompts with hallucination controls built in, plus the honest limit: what no prompt can find without using your product.",
    excerpt:
      "Free, genuinely good prompts for landing pages, forms, copy, and heuristic passes. Then the receipts on what no prompt can see: Baymard clocked screenshot audits at 14% of live-page issues.",
    category: "AI audits",
    datePublished: "2026-07-10",
    dateModified: "2026-07-10",
    readingMinutes: 9,
    keywords: [
      "ChatGPT UX audit prompt",
      "ChatGPT UX audit",
      "AI design review prompt",
      "UX review prompt",
      "can ChatGPT review my website UX",
      "ChatGPT heuristic evaluation prompt",
    ],
    faq: [
      {
        q: "Can ChatGPT do a UX audit?",
        a: "It can do a useful UX review of whatever you show it: a screenshot, pasted copy, a described flow. It cannot do a full audit, because most UX failures (error states, multi-page flows, latency, what happens after submit) only appear during interaction. Baymard's benchmark found ChatGPT-4 screenshot audits caught just 14% of live-page issues.",
      },
      {
        q: "What is the best prompt for a UX review?",
        a: "One that assigns a reviewer role, names the rulebook (Nielsen's 10 heuristics, WCAG 2.2, Laws of UX), and demands a named rule, a severity, and a confidence level for every finding, with an instruction to say 'cannot assess' instead of guessing. That last clause matters most: unconstrained prompts produce confident hallucinations.",
      },
      {
        q: "Is ChatGPT accurate for UX feedback?",
        a: "Mixed. Baymard's October 2023 study measured an 80% false-positive rate on ChatGPT-4 screenshot audits, and Jakob Nielsen counted roughly 11 hallucinations per screenshot. Models have improved since 2023 and tight prompts cut the noise, but treat every finding as a hypothesis to verify, not a verdict.",
      },
      {
        q: "ChatGPT vs an AI UX audit tool: what's the difference?",
        a: "ChatGPT reviews artifacts you paste into a chat. Agent-based audit tools operate the product itself: they sign up, fill forms, trigger error states, and move through multi-page flows. That interaction layer is where roughly half of UX issues live, and it is the part a chat window structurally cannot reach.",
      },
      {
        q: "Can ChatGPT review my website from a URL?",
        a: "Partly. It can fetch a page and give a first-impression read on copy, hierarchy, and clarity. But it does not experience the page: no clicks, no form submits, no latency, no movement between pages. For anything beyond a static read, use a method that interacts with the live product.",
      },
    ],
    related: [
      "what-is-an-ai-ux-audit",
      "ai-agents-vs-synthetic-users-vs-real-users",
      "founder-ux-audit-checklist",
    ],
  },
  {
    slug: "ai-agents-vs-synthetic-users-vs-real-users",
    title: "AI agents vs synthetic users vs real users for UX testing",
    h1: "AI agents, synthetic users, real users, or your own eyes: four ways to find out your UX sucks",
    description:
      "An honest comparison of AI agents, synthetic users, real usability testing, and heuristic evaluation: what each method catches, misses, and costs.",
    excerpt:
      "Synthetic users simulate opinions. Agents execute your flows. Real people remain the only source of truth. One big table with the misses column left in, plus a picker that tells you which method to run this month.",
    category: "AI audits",
    datePublished: "2026-07-10",
    dateModified: "2026-07-10",
    readingMinutes: 8,
    keywords: [
      "AI usability testing",
      "synthetic users UX research",
      "AI agents usability testing",
      "can AI replace usability testing",
      "synthetic users vs real users",
      "AI UX research methods",
    ],
    faq: [
      {
        q: "Can AI replace usability testing?",
        a: "No. NN/g's position is that UX without real-user research isn't UX, and even UXAgent's authors frame agent simulation as a way to pilot studies, not replace them. AI agents complement real testing by catching interaction defects cheaply and early; real users remain the only source of truth about real behavior and motivation.",
      },
      {
        q: "What are synthetic users?",
        a: "Synthetic users are LLM-generated personas that answer interview or survey questions in character, without ever touching your product. NN/g recommends treating their output strictly as unvalidated hypotheses: useful for drafting interview guides and proto-personas, dangerous as the basis for design or business decisions, because their answers show consistently lower variance than real humans.",
      },
      {
        q: "What is the difference between an AI agent and a synthetic user?",
        a: "A synthetic user produces simulated opinions: interview answers you cannot replay or falsify. An AI agent performs executed interactions: it operates your product in a real browser and reports what happened, with screenshots and cited rules, so every finding can be checked by replaying it.",
      },
      {
        q: "How many real users do you need for a usability test?",
        a: "Nielsen's model says 5 users surface roughly 85% of findable problems, based on the average user revealing about 31% and the formula N(1-(1-L)^n). It is a model with assumptions, not a guarantee, and Nielsen's own advice was to run several small tests rather than one large one.",
      },
      {
        q: "Are AI usability tests accurate?",
        a: "It depends on whether the AI interacts with the product. Baymard found screenshot-only ChatGPT-4 caught just 14% of the issues present on live pages with an 80% false-positive rate, while agent-based approaches are built to reach the roughly half of real issues that only appear during interaction (the premise behind WebProber and UXBench). Accuracy also varies meaningfully by model.",
      },
    ],
    related: [
      "what-is-an-ai-ux-audit",
      "chatgpt-ux-audit-prompts",
      "ux-audit-cost",
    ],
  },
  {
    slug: "ux-findings-to-jira-tickets",
    title: "How to turn UX findings into Jira tickets devs actually fix",
    h1: "The anatomy of a UX ticket an engineer accepts without a meeting",
    description:
      "How to write UX issues as Jira or Linear tickets: behavior-naming titles, severity vs priority, steps to reproduce, cited rules, and copy-paste templates.",
    excerpt:
      "Your audit found 20 real problems and every one is dying in a Google Doc. The 5 fields that get a UX finding through triage without a meeting, plus copy-paste templates for Jira and Linear.",
    category: "Workflow",
    datePublished: "2026-07-10",
    dateModified: "2026-07-10",
    readingMinutes: 7,
    keywords: [
      "UX findings to Jira tickets",
      "UX bug ticket template",
      "design feedback to Jira",
      "UX debt backlog",
      "severity vs priority UX",
      "how to write UX issues as tickets",
    ],
    faq: [
      {
        q: "What should a UX bug ticket include?",
        a: "A title naming the broken behavior (not the emotion), a severity from a scale the team agreed on, where it happens, numbered steps to reproduce, what happens vs what should happen, the named rule it violates (a Nielsen heuristic, WCAG criterion, or UX law), a concrete suggested fix, an effort estimate, and an annotated screenshot.",
      },
      {
        q: "What is the difference between severity and priority?",
        a: "Severity measures how badly users are hurt; NN/g rates it 0 to 4 from frequency, impact, and persistence. Priority is a business decision about when to fix it, layering revenue, traffic, and deadlines on top of severity. A Major issue on a rarely visited settings page can rank below a Minor one inside checkout.",
      },
      {
        q: "How do you prioritize UX issues?",
        a: "Rate severity first: Blocker (users fail or lose work), Major (users struggle, some give up), Minor (friction). Then queue by default: Blockers as P1 this sprint, Majors as P2 next sprint, Minors batched into the backlog per screen. Adjust for business context like traffic to the flow and revenue at stake.",
      },
      {
        q: "How many tickets should a UX audit produce?",
        a: "A focused audit of 3 core flows typically produces 10 to 25 findings. File every Blocker and Major as its own ticket; batch Minor issues into one ticket per screen with a checklist, so the backlog stays navigable instead of turning into confetti.",
      },
    ],
    related: [
      "heuristic-evaluation-example",
      "founder-ux-audit-checklist",
      "ux-audit-cost",
    ],
  },
  {
    slug: "vibe-coded-app-ux",
    title: "Vibe-coded app UX: the 7 defects AI ships every time",
    h1: "Vibe-coded app UX: the 7 defects AI ships every time",
    description:
      "Vibe-coded apps ship predictable UX defects: gray text, dead focus states, lying ARIA, silent errors. The 20-minute pre-launch pass that catches them.",
    excerpt:
      "Lovable, Bolt, v0, and Cursor all ship the same UX defects, because they learned frontend from a web where 95.9% of the top million home pages fail WCAG checks. The upside of predictable: you can catch the whole set in a 20-minute keyboard-and-contrast pass, no designer required.",
    category: "Field guide",
    datePublished: "2026-07-10",
    dateModified: "2026-07-10",
    readingMinutes: 8,
    keywords: [
      "vibe coded app UX",
      "AI generated website accessibility",
      "Lovable app accessibility",
      "vibe coding problems",
      "AI code UX issues",
      "vibe coded app checklist",
      "WCAG 2.2 AI generated code",
    ],
    faq: [
      {
        q: "Are vibe-coded apps accessible?",
        a: "Rarely out of the box. A W4A 2024 study found 84% of ChatGPT-generated websites contained accessibility violations, and LLMs fail hardest on ARIA and keyboard-level issues. The defects are predictable, though: contrast, focus states, ARIA, error states, target sizes. Most are quick fixes once found.",
      },
      {
        q: "What should I check before launching an AI-built app?",
        a: "Five checks on your money flow, about 20 minutes total: a keyboard-only walk-through (unplug the mouse), a contrast pass, a screen-reader smoke test with VoiceOver or NVDA, submitting every form empty, and going offline mid-save to hunt silent failures.",
      },
      {
        q: "Do automated accessibility checkers catch everything?",
        a: "No. They only see machine-detectable failures. In Axess Lab's May 2026 audit, a Lovable-built site scored 100% on automated axe checks while a blind screen-reader user hit serious barriers within minutes: focus lost behind modals, unannounced menu state, and a mismatched aria-label.",
      },
      {
        q: "Can I get sued over my app's accessibility?",
        a: "If you sell to EU consumers, the European Accessibility Act has been enforceable since 28 June 2025 (baseline incorporates WCAG 2.1 AA); in the US, ADA Title II holds state and local government sites to WCAG 2.1 AA by 2027-2028. Treat WCAG 2.1 AA as the floor, not FUD.",
      },
    ],
    related: [
      "what-is-an-ai-ux-audit",
      "founder-ux-audit-checklist",
      "chatgpt-ux-audit-prompts",
    ],
  },
];

export function getArticle(slug: string): ArticleMeta | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
