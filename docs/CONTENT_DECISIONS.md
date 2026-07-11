# Receipts: content decisions

Why these 10 articles, why they look like this, and what makes them rank. July 2026.

## Strategy in one paragraph

The head keywords ("UX audit", "usability heuristics") are owned by NN/g, Baymard, Contentsquare, Maze. We don't fight them; we cite them, which fits the brand (receipts = borrowed authority). The open territory found by SERP research: AI-native queries with no editorial incumbent, workflow topics nobody claims, and honesty plays nobody else can afford. Every article is founder/PM-facing; the incumbents all write for professional UX researchers.

## The slate and why each earns its slot

| # | Article | Why it wins |
|---|---------|-------------|
| 1 | What is an AI UX audit | Exact-match pillar. SERP is tool homepages, zero editorial. Defines the category taxonomy on our terms (look-at vs use), with our product's category as the defensible best slot. |
| 2 | UX audit cost 2026 | Highest commercial intent. All ranking content is agency-authored and anchors $1k-$75k. We published the only buyer-side number: median $500 across 20 real rate cards we compiled ourselves. Original, checkable data no one else has. |
| 3 | ChatGPT UX audit prompts | Near-zero competition, reader is our buyer one step earlier. We give away genuinely good prompts (goodwill + AI-engine citations), then show the structural wall with Baymard's published numbers. No fake "we tested" claims. |
| 4 | Agents vs synthetic users vs real users | Rising query asked to ChatGPT constantly. The comparison table is the citation asset. Original idea: simulated opinions vs executed interactions. Honest about real users being irreplaceable. |
| 5 | Founder's UX audit checklist | Format weapon: every competitor checklist is a static listicle; ours is interactive and scored, with a roast verdict. Scoped to 3 flows because that's true advice, not because it's cute. |
| 6 | UX statistics traced to sources | The brand-defining piece. We traced 17 famous stats to primary sources (Wayback recovery of the 2001 IBM page, PDF extraction of the Gomez paper). 5 are untraceable, 5 distorted. Nobody else does this; it's the page other writers will cite, and mentions beat backlinks for AI visibility (Ahrefs r=0.664 vs 0.218). |
| 7 | Heuristic evaluation example | "Example/template" tier around NN/g's canon is soft (a tiny roast tool ranks top-3). Full 10-heuristic evaluation of a declared-fictional SaaS with drawn screens and tap-to-reveal annotations. Doubles as a product demo: findings rendered as ClapBack cards. |
| 8 | UX findings into Jira tickets | Functionally unclaimed SERP (a gist and forum threads). 100% ICP. Explains our exact output format, making the product legible. Backed by real research (Bettenburg FSE 2008 on what devs need in bug reports). |
| 9 | Why users abandon signup | High pain-match teardown. Differentiator: we correct the famous numbers inline (the "24-26% forced account" stat is currently 19% on Baymard's live page) instead of recycling them. |
| 10 | Vibe-coded app UX | Newest open topic, perfect ICP (vibe-coders have no designer by definition). Anchored by the Axess Lab case: 100% automated-check score, unusable with a screen reader. Live contrast checker in the article. |

## Honesty constraints we enforced (and why they're also strategy)

- No invented statistics, no fake experiments. Everything traces to a research pack with primary-source URLs; four packs compiled by research agents, then an independent fact-check agent re-verified articles against packs and live URLs.
- The only "original data" claims are things we actually did: compiling 20 published rate cards (article 2, methodology shown) and tracing 17 citation chains (article 6, chains shown).
- Fictional examples (Driftly) are declared fictional in the second paragraph.
- Stale famous numbers are corrected against live sources (Baymard 70.22%/19%, WebAIM 2026 83.9%) rather than recycled. This is also the moat: it's the one thing listicle mills can't copy without doing the work.

## Writing rules (anti-slop)

A strict style guide was derived from the landing page copy and enforced twice (mechanical grep + adversarial editor agent): no emdashes, no "isn't just X" constructions, no filler transitions, no hedge mush, paragraph caps, roast-then-receipt rhythm, at most a few uses of "roast/receipts" per article, humor never replacing information. Titles and headings in sentence case matching the site.

## SEO/GEO mechanics (evidence-based, not folklore)

Based on a research pass over 2025-26 studies (Princeton GEO, Ahrefs causal schema test, Profound/SEL citation analyses, Google's official AI guide):

- Answer capsule as first sentence under title and question-H2s (72% of ChatGPT-cited posts have one; 44% of citations come from the first third of a page).
- Statistic + named source + year inline, densely (Princeton's strongest tactic, +30-40% visibility).
- Real HTML tables for prices/comparisons (AI engines reproduce tables).
- Question-phrased H2s covering the query fan-out; visible FAQ blocks per article.
- Schema as parsing layer, not ranking lever (Ahrefs found no causal citation lift): Article + BreadcrumbList + FAQPage JSON-LD per article, Organization site-wide. Skipped: HowTo (deprecated), speakable, llms.txt (97% get zero bot traffic; Google says unused).
- Everything server-rendered; interactive widgets are client islands whose text still SSRs, so crawlers see all content.
- Truthful dates: all articles published 2026-07-10 (launch day), no fake backdating; dateModified will only move with real updates.
- One-time infra: per-article OG images in brand style, sitemap generation from the registry, related-article links forming three internal clusters (AI audits, method, teardown) with articles 6 and 8 as hubs.

## Presentation choices

- The blog is named "Receipts" (footer tagline made structural). Categories are eyebrows: Teardown, Receipts, Money, Workflow, AI audits, Do it yourself, Field guide.
- House grammar unique to ClapBack: paired Roast/Receipt callouts (spicy claim, then checkable evidence), findings as product-style cards, advice rendered as Jira-style tickets with severity pills, sources recap box ("Receipts for this article") at the end of every piece.
- No stock images anywhere. All visuals are code-drawn in the site's wireframe language (like the landing page's Mockup component): Driftly's ten screens, the agent run log, the ticket blocks.
- One interactive element per article where it earns its place: scored checklist, contrast checker, stat ledger with copyable citations, cost picker, friction ledger, method picker, prompt copy cards, annotation pins. All built with zero new dependencies.
- CTA discipline: the layout provides one end-of-article CTA; bodies contain at most two product mentions, always with a defensible qualifier.

## Validation performed

1. Mechanical: emdash/ban-list grep across all content; TypeScript + full production build; all 10 routes, OG images, sitemap (12 URLs), and JSON-LD verified on a running production server.
2. Editorial pass: adversarial review agent against the style guide found 27 issues (3 must-fix, including a typo in an answer capsule and evidence-block recycling across the AI-audit cluster). All addressed.
3. Fact-check pass: independent agent verified every number, quote, and URL against the research packs, live-fetched the 10 load-bearing sources, and caught 19 issues (including a stale survey figure and two dropped statistical qualifiers). All addressed.
4. Verification pass: a third agent re-checked all 46 findings against the fixed tree: 42 fixed, 0 unfixed, 2 deliberate waivers, plus 5 residuals it caught, which were then fixed and re-verified in the rendered HTML.

## What's deliberately not here (next moves, not now)

- "Best UX audit tools" listicle: skipped until we can honestly test competitors' outputs; a disguised ad would undercut the receipts brand. The pillar's taxonomy table covers the intent honestly meanwhile.
- Original benchmark data ("we audited N apps: the most common violations"): the Baymard-moat play, requires the product's audit pipeline at scale.
- Off-site GEO (G2/Capterra/Product Hunt listings, Reddit/HN presence, YouTube): out of scope for a repo commit, but the research says mentions beat backlinks; worth doing at launch.
