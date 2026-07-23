# ClapBack SEO strategy

_Analysis + a realistic, prioritized plan. Last updated 2026-07-23._

## TL;DR

- **Your technical SEO is already strong.** Metadata, sitemap, robots, JSON-LD,
  per-page OG images, and a genuinely good 10-article blog are all in place. This
  is not a "fix the foundation" job.
- **The head "roast my website" terms are saturated** with tool landing pages and
  one strong incumbent (roastmylandingpage.com). You win those on **brand +
  backlinks**, not content.
- **The realistic wins are the long-tail `roast my {vertical}` pages** (thin,
  beatable competitors) and **directory/comparison listings** — plus the fact
  that in this niche, **rankings follow virality**: the Hacker News / Product
  Hunt / Indie Hackers launch loop is what builds the links that make SEO work.
- **Your defensible wedge is real:** Claude Opus + inline annotated screenshots,
  vs. a field of GPT-3.5/4 text wrappers. That's both a conversion edge and the
  credible hook for the launch communities that hand out backlinks.

> **Caveat on numbers:** research was done without a paid keyword tool
> (Ahrefs/Semrush). Volume/difficulty reads below are qualitative — grounded in
> who actually ranks, Google autocomplete depth, and SERP maturity, not verified
> MSV/KD. Validate the shortlist in a real tool before heavy content spend, or
> just ship the low-cost pages and let Search Console show real impressions.

---

## 1. Where you stand today (audit)

**Already done well:**
- Root + per-page metadata, OpenGraph, Twitter cards, `metadataBase`, canonicals.
- `sitemap.ts`, `robots.ts`, favicon (`icon.svg`).
- JSON-LD: `SoftwareApplication` + `Organization` site-wide; `Article` +
  `BreadcrumbList` + `FAQPage` on blog posts.
- Dynamic OG images (root + per-article), with font-fetch retry hardening.
- A 10-article SSG blog (`Receipts`) targeting real informational UX queries —
  high quality, long-form, genuinely useful. This is your topical-authority engine.
- Homepage copy is crawlable: even though `page.tsx` is a client component, Next
  SSRs the static hero/section/FAQ copy into the HTML. Nothing important is hidden.

**Gaps that existed — now closed in this pass (see §4):**
- No homepage `FAQPage` structured data (blog had it; homepage didn't).
- No Google Search Console verification wired in.
- No web manifest / apple-touch-icon.
- Only `/` + `/blog` as ranking surfaces — no programmatic long-tail pages.

**Still open (needs you / a decision):**
- **Google Search Console** must actually be verified + sitemap submitted (the
  code is wired; you set the token — see §6).
- No GA4 (only Vercel Analytics + Mixpanel). Fine if intentional; means no
  Google-side query data beyond Search Console.
- Production requires `COOPER_URL`/`COOPER_KEY` for `/api/roast` to serve — the
  roast has to actually work before you drive launch traffic to it.

---

## 2. The keyword landscape (realistic read)

### Head terms — saturated, compete on brand not content
`roast my website`, `roast my landing page`, `ai website roast`, `ai ux audit
tool`. Page 1 is a wall of tool pages + one strong incumbent
(roastmylandingpage.com: $350 human service, YouTube channel, documented HN
virality). **Don't build content strategy around these.** You'll appear here over
time via brand and the directory/alternatives pages, not by out-writing anyone.

### The real opening — `roast my {vertical}` long-tail
The head is taken, but the vertical-modified terms are served by thin GPT
wrappers, hobby Vercel demos, and forum threads. Same playful/high intent, weak
incumbents. **This is the highest-leverage realistic SEO play**, and it's what
the new `/roast/*` pages target. Priority order (best opportunity first):

| # | Page | Why | Watch out |
|---|------|-----|-----------|
| 1 | **/roast/website** | Highest real volume ("...ai/free/reddit/gpt" all autocomplete); incumbents are thin wrappers you beat with a real engine + screenshots | Category head — expect months, not weeks |
| 2 | **/roast/portfolio** | Strong designer/dev audience fit; design-specific competition is essentially absent (page 1 is *investment* tools) | Must disambiguate from finance portfolios |
| 3 | **/roast/shopify-store** | Only cluster with proven **transactional** intent (a $9 competitor exists); highest value per visitor | Term muddied by "ROAS"/"Roastify" coffee app |
| 4 | **/roast/saas** | Perfect audience fit, zero real incumbent (Gumroad/GPTs only) | Low search volume — treat as a cheap spoke |
| 5 | **/roast/ui** | Beatable thin wrappers + designer audience | Small clean-intent volume |
| 6 | **/roast/startup** | Big demand + weak comp | Reframed to *website/landing page*, not idea validation |

**Deliberately excluded:** `roast my landing page` (strong incumbent), `roast my
app` (polluted by "roast my Apple Music" consumer searches), `roast my
resume/cv` (huge volume but wrong audience — job-seekers, not site owners).

### Informational pillars — you already do this; keep going
`why is my landing page not converting`, `website usability checklist`, `how to
improve website UX`. Authority-gated (Forbes/Landingi/agencies rank), so these
mature at month 6+. Your blog is the right vehicle; publish an **original
checklist asset** as link-bait. Don't expect fast wins here.

---

## 3. Competitive difficulty & the growth engine

- **Tier 1 (hard):** roastmylandingpage.com, roastmyweb.com — real brands with
  backlinks/PH/YouTube. Don't fight head-on.
- **Tier 2/3 (beatable):** roastd, roastmypage, bugsmash, and a long tail of GPT
  wrappers (yeschat GPTs, mindstudio agents, Figma plugins). A real hosted tool
  with annotated screenshots outclasses these.

**The key insight: SEO here is downstream of virality.** The backlinks that move
rankings in this niche come from launch moments, not from the audit output. So
the SEO plan and the launch plan are the same plan. Full copy-paste kit is in
[`launch-assets.md`](./launch-assets.md):
- **Show HN** — highest leverage; the original roast tool hit the HN front page
  and reportedly drove ~£10k in 48h. Lead with "Claude Opus + real annotated
  screenshots, not a GPT wrapper."
- **Product Hunt** — durable directory backlink + featured-tool listings.
- **Indie Hackers / Reddit / X** — distribution + branded search + the occasional
  followed link. Make the roast **output** screenshot-worthy so sharing is the loop.
- **Directory submissions** — AlternativeTo, theresanaiforthat, Futurepedia, G2,
  etc. Low-effort backlinks + a fast way to rank for "best AI roast tools."

---

## 4. What was shipped in this pass (code)

All committed to the `clapback/` repo, build-verified (`next build` → 44/44
static pages), typecheck clean. Nothing here touches the working homepage flow.

**Technical SEO fixes**
- `app/components/Faq.tsx` — homepage now emits `FAQPage` JSON-LD (rich-result
  eligibility for the 6 homepage Q&As).
- `app/layout.tsx` — `metadata.verification.google` wired to
  `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (no-op until you set the env var).
- `app/manifest.ts` — web app manifest.
- `app/apple-icon.tsx` — apple-touch icon from the brand burst (no font fetch, so
  it can't break a build the way the OG images once did).

**Programmatic vertical pages (the main SEO lever)**
- `app/roast/verticals.ts` — content registry for all 6 verticals (mirrors the
  `blog/articles.ts` pattern). Each has unique intro copy, a checklist of
  vertical-specific checks tied to named UX rules, and its own FAQ — **real
  content, not doorway pages** (Google penalizes thin doorways).
- `app/roast/[vertical]/page.tsx` — SSG route; per-page metadata, canonical, and
  `SoftwareApplication` + `BreadcrumbList` + `FAQPage` JSON-LD.
- `app/roast/[vertical]/opengraph-image.tsx` — per-vertical share cards.
- `app/roast/page.tsx` — `/roast` hub index (links all verticals).
- `app/roast/RoastLauncher.tsx` — client island reusing the real `RoastRun` +
  `WaitlistModal` flow, so each vertical page **converts on its own** instead of
  bouncing to the homepage.
- `app/sitemap.ts` — hub + all verticals added.
- `app/components/Footer.tsx` — site-wide internal link to `/roast`.

New indexable URLs: `/roast`, `/roast/website`, `/roast/portfolio`,
`/roast/shopify-store`, `/roast/saas`, `/roast/ui`, `/roast/startup`.

---

## 5. Prioritized roadmap

**Now (shipped — just needs deploy + GSC):**
1. Deploy this branch. Verify Search Console, submit `/sitemap.xml`.
2. Confirm `/api/roast` is live and cost-guarded before any launch traffic.

**Weeks 1–4 (fast, high-leverage):**
3. **Launch loop** (see `launch-assets.md`): Product Hunt → Show HN → Indie
   Hackers, then work the directory checklist while traffic is warm. This is what
   earns the backlinks the `/roast/*` pages need to rank.
4. Watch Search Console: which `/roast/*` pages get impressions? Expand copy /
   add a second vertical page for the ones that gain traction.

**Months 2–4 (compounding):**
5. **Comparison content:** "Best AI website roast tools 2026", "[competitor]
   alternative" pages — mirrors the listicle format that owns the "best tools"
   SERPs and intercepts competitor-brand searches.
6. Keep publishing informational pillars on the blog; add an original
   **link-bait checklist** asset.
7. Add more verticals only if the first six show traction (e.g. `/roast/webflow`,
   `/roast/newsletter`, `/roast/notion-site`) — same registry, ~20 min each.

**Ongoing:**
8. Make every roast **output** shareable (score + one savage line + annotated
   shot) → branded search → links → rankings.

---

## 6. What I need from you (tools / access)

I did what I can from the code side. These need you (I can't do them from here):

- **Google Search Console** — verify the property, then set
  `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel (the metadata tag is already
  wired) and submit `https://clapback.run/sitemap.xml`. This is the single most
  important open item — without it you're flying blind on what you rank for.
- **A keyword tool (optional but valuable)** — Ahrefs / Semrush / Mangools, or
  even the free Google Keyword Planner (needs a Google Ads account). Gives real
  MSV/KD to confirm the vertical priority order. Without it we're going on
  qualitative reads + Search Console once it's live.
- **Launch execution** — I drafted the Show HN / Product Hunt / directory assets
  in `launch-assets.md`, but **you** post them (accounts, timing, live Q&A). This
  is the growth engine; the code is just the thing you're driving traffic to.
- **Bing Webmaster Tools** (5 min, free) — same sitemap submission; a little extra
  reach, and it also feeds ChatGPT/Copilot search.
- **Decision:** do you want GA4 added alongside Vercel/Mixpanel for Google-side
  data? Not required, but it's the other half of the Search Console picture.

If you get me a keyword-tool export (even a CSV of MSV/KD for the shortlist), I'll
turn the vertical priority into a hard-numbers content map and tell you exactly
which pages to expand first.
