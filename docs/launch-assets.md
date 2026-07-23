# ClapBack launch & distribution assets

Copy-paste kit for the launch moments that actually build the backlinks and
branded search SEO depends on in this niche. **You post these. I can't.**
Ranking for "roast my website" terms is won on brand + links, and in this
category links come from launches (Hacker News, Product Hunt, Indie Hackers),
not from the audit output itself.

Your defensible hook everywhere below: **Claude Opus critique + real annotated
screenshots**, versus a field of GPT-3.5/4 text wrappers. Lead with it: the HN
/ PH / IH crowd can smell a wrapper, and this is the thing they can't.

---

## 1. Show HN

HN is the highest-leverage single post (the original roast-landing-page tool hit
the HN front page and reportedly drove ~£10k in 48h). Rules: title starts with
`Show HN:`, you're in the thread all day answering, no marketing fluff, link
straight to the working tool (no email wall before value).

**Title options (pick one, keep it plain; HN punishes hype):**

- `Show HN: ClapBack – an AI agent that uses your site like a user and roasts the UX`
- `Show HN: I built an AI that roasts your website's UX with annotated screenshots`
- `Show HN: AI UX audits with receipts – cited rules, not vibes`

**First comment (post immediately after submitting):**

> I got tired of "AI website audit" tools that paste a screenshot into GPT-4 and
> hand back 15 confident hallucinations. Baymard measured screenshot-only audits
> at ~14% of real issues with an 80% false-positive rate. Roughly half of UX
> problems only show up when you actually use the product: submit the form, hit
> the error state, move between pages.
>
> So ClapBack drives a real headless browser with Claude Opus. It signs up, fills
> forms, breaks flows, and screenshots what it finds. Every finding cites a named
> rule (Nielsen heuristic or WCAG criterion) and ships as a Jira/Linear-ready
> ticket with the annotated shot, so you can check it in a few seconds instead of
> trusting a vibe.
>
> Paste any URL (yours or a competitor's) and you get a free roast. Happy to run
> it live on anything people drop in the thread. I'd also like to hear where it
> gets things wrong.

**Prep before you submit:**
- Make sure `/api/roast` is live (needs `COOPER_URL` + `COOPER_KEY` set in prod).
- Have capacity/cost guardrails. HN traffic plus a real Opus run per URL costs money.
- Post Tue–Thu, ~8–10am ET. Don't ask for upvotes (fastest way to get flagged).
- Reply to *every* "roast mine" with a real result. That thread is your backlink.

---

## 2. Product Hunt

Gets you a durable directory backlink + "featured tool" listings that then rank
for the head terms. Competitors (Roast My Web, Roast My Website) all launched here.

- **Tagline (60 char):** `AI that uses your site like a user and roasts the UX`
- **Description:**
  > ClapBack is an AI agent that actually uses your product. It signs up, fills
  > forms, breaks flows, and roasts every UX problem it hits. It runs Claude
  > Opus in a real browser, not a screenshot wrapper. Each finding cites a named
  > usability rule, shows the annotated screenshot, and exports as a Jira or
  > Linear ticket. Paste a URL, get receipts in minutes. Free roast to start.
- **First comment (maker):** short origin story: the "14% of issues" stat, why
  interaction beats screenshots, invite people to drop URLs.
- **Gallery:** lead with an annotated-screenshot finding (the shareable artifact),
  then the ticket export, then the score summary. Make slide 1 screenshot-worthy.
- **Assets:** thumbnail = brand burst on ink; first gallery image = a real roast.
- Line up a handful of people to try it for real on launch morning (00:01 PT).

---

## 3. Indie Hackers

Evergreen distribution + social proof. The category's biggest success documented
its whole revenue journey here.

- Post format: `I built an AI that roasts your website's UX. Roast mine back?`
- Offer free roasts in-thread; share a real (anonymized) finding as the hook.
- Recurring "roast my {SaaS/app/landing page}" threads already exist. Reply to
  them with a ClapBack run instead of cold-posting.
- Build-in-public angle: post the launch metrics after HN/PH. IH rewards candor.

---

## 4. Reddit (demand + share loops, mostly nofollow)

Links are nofollow so this is for demand and branded search, not link juice.
Read each sub's self-promo rules first; lead with value, not the URL.

- r/SaaS, r/startups, r/EntrepreneurRidealong: "roast my SaaS" posts recur; run
  ClapBack on volunteers and share the annotated finding.
- r/web_design, r/webdev, r/Frontend: the "your contrast fails WCAG, here's the
  screenshot" finding lands well with this crowd.
- r/userexperience: be careful; this sub is skeptical of AI-audit tooling. Lead
  with the honest limitation ("AI catches rule-checkable defects, not why users
  behave the way they do"). That candor is what earns credibility here.

---

## 5. Directory submissions (fast backlinks + referral traffic)

Low effort, do all of them in an afternoon. Each is a backlink + a page that can
itself rank for "best AI roast tools." Every competitor is on most of these.

- [ ] Product Hunt (see above)
- [ ] There's An AI For That (theresanaiforthat.com)
- [ ] AlternativeTo: list ClapBack, and add it as an alternative on Roast My Web /
      roastmylandingpage entries
- [ ] Futurepedia
- [ ] G2 (create the product profile)
- [ ] Creati.ai / AI tool aggregators
- [ ] SaaSHub, StackShare
- [ ] Toolify, AI Tools Directory, Insidr AI
- [ ] Uneed, Fazier (indie launch platforms)

---

## 6. X / Twitter (fuels branded search → SEO)

The roast output *is* the ad. Design it to be screenshot-worthy: score + one
savage line + the annotated shot. Every share drives branded "clapback" searches
and the occasional followed link.

- Run ClapBack on famous/notoriously-bad sites (with taste) and post the finding.
- "Roast my landing page, reply with your URL" threads. Do them live.
- Build-in-public cadence around the HN/PH launch.

---

## Sequencing

1. **Before launch:** ship the technical SEO fixes, verify Search Console, submit
   sitemap, make sure `/api/roast` is live and cost-guarded.
2. **Launch week:** Product Hunt (Tue), Show HN same/next morning, Indie Hackers,
   then work the directory checklist while traffic is warm.
3. **After:** post metrics on IH/X, keep replying to "roast my X" threads, and let
   the programmatic `/roast/{vertical}` pages catch the long-tail the launch
   surfaced.
