"use client";

import { useState } from "react";
import CopyButton from "../../components/blog/CopyButton";

/* The stat ledger: all 17 traced statistics, filterable by verdict, each with
   the citation chain summary and a copyable safe-to-cite version. All text is
   in the initial HTML (client components server-render); the client only adds
   filtering and expand/collapse. Data compiled from the pack-c dossier;
   sources verified 2026-07-10. */

type Verdict = "Verified" | "Distorted" | "Untraceable" | "Outdated";

type Stat = {
  claim: string;
  attributedTo: string;
  verdict: Verdict;
  caveat?: string;
  reality: string;
  safeCite: string | null;
  source?: { label: string; href: string };
};

const STATS: Stat[] = [
  {
    claim: "Every $1 invested in UX returns $100",
    attributedTo: "Forrester",
    verdict: "Untraceable",
    reality:
      "The earliest findable instance is a 2015 Forbes Council post by a UX-agency CEO, with Forrester misspelled and no report linked. No Forrester publication contains the figure. Most plausible origin: a mutation of IBM's 2001 'rule of thumb' marketing line.",
    safeCite: null,
    source: {
      label: "Forbes Council post, 2015 (patient zero)",
      href: "https://www.forbes.com/sites/forbestechcouncil/2015/11/19/good-ux-is-good-business-how-to-reap-its-benefits/",
    },
  },
  {
    claim: "Better UI raises conversion up to 200%; better UX up to 400%",
    attributedTo: "Forrester",
    verdict: "Distorted",
    reality:
      "A real 2009 Forrester blog post by Mike Gualtieri compares well-designed vs poorly designed sites: up to 200% higher visit-to-order and over 400% higher visit-to-lead conversion. Two different funnel metrics, best-vs-worst gaps, unpublished underlying data, and nothing about redesign lift or a UI/UX split.",
    safeCite:
      "In 2009, Forrester analyst Mike Gualtieri wrote that well-designed sites can have up to 200% higher visit-to-order and over 400% higher visit-to-lead conversion rates than poorly designed ones; the underlying data was never published.",
    source: {
      label: "Forrester blog, Oct 2009",
      href: "https://www.forrester.com/blogs/09-10-15-leaving_user_experience_to_chance_hurts_companies/",
    },
  },
  {
    claim: "88% of consumers are less likely to return after a bad experience",
    attributedTo: "Gomez / Econsultancy",
    verdict: "Distorted",
    reality:
      "The number is real but it comes from a 2010 white paper by web-performance vendor Gomez (Equation Research survey, n=1,500), where 'bad experience' means slow or failing pages at peak traffic. Self-reported intent, 16 years old, sold as a general UX statistic ever since.",
    safeCite:
      "In a 2010 survey of 1,500 consumers commissioned by web-performance vendor Gomez, 88% said they would be less likely to return to a site after a bad experience, where bad experience meant slow or failing pages.",
    source: {
      label: "Gomez white paper PDF (2010)",
      href: "https://montereypremier.com/wp-content/uploads/2019/10/201110_why_web_performance_matters.pdf",
    },
  },
  {
    claim: "Users form an opinion about a website in 50 milliseconds",
    attributedTo: "Lindgaard et al., 2006",
    verdict: "Verified",
    caveat: "scope caveat",
    reality:
      "Real, peer-reviewed, and correctly attributed. The judgment formed in 50ms is specifically visual appeal of a static screenshot, not usability or trust. The paper's point is that the snap aesthetic judgment can bias everything after it.",
    safeCite:
      "Lindgaard et al. (2006, Behaviour & Information Technology) found that people form a stable judgment of a web page's visual appeal within 50 milliseconds, and that first impression can color later judgments.",
    source: {
      label: "Lindgaard et al., 2006",
      href: "https://www.tandfonline.com/doi/abs/10.1080/01449290500330448",
    },
  },
  {
    claim: "94% of first impressions are design-related",
    attributedTo: "Stanford (wrongly)",
    verdict: "Distorted",
    reality:
      "The real study is Sillence et al. (CHI 2004, Northumbria University, not Stanford): 15 women evaluating health websites. 94% of comments about sites they rejected concerned design. Trust in the sites they kept was driven by content. A niche mistrust finding became a universal law through repetition.",
    safeCite:
      "In Sillence et al.'s 2004 study of 15 women evaluating health websites, 94% of comments about rejected sites concerned design, while trust in kept sites was driven by content.",
    source: {
      label: "Sillence et al., CHI 2004",
      href: "https://dl.acm.org/doi/10.1145/985692.985776",
    },
  },
  {
    claim: "70% of online businesses fail because of bad usability",
    attributedTo: "Nobody, ever",
    verdict: "Untraceable",
    reality:
      "Traces to an unsourced line in a UX-agency listicle, copy-pasted for a decade. No study defines 'online businesses', 'fail', or measures usability as the cause. Real business-failure data (US BLS) shows about 20% of new businesses fail in year one, for many reasons.",
    safeCite: null,
    source: {
      label: "The listicle that spread it",
      href: "https://uxeria.com/en/15-statistics-that-will-convince-your-boss-to-invest-in-ux/",
    },
  },
  {
    claim: "Users read only 20 to 28% of the words on a page",
    attributedTo: "Nielsen, 2008",
    verdict: "Verified",
    caveat: "modeled estimate",
    reality:
      "Correctly attributed. Nielsen derived it from Weinreich et al.'s logs of 25 users' real browsing: time-on-page allows reading at most 28% of an average page's words at 250wpm, roughly 20% in practice. An upper-bound model, not eyetracking, and Nielsen says so himself.",
    safeCite:
      "Analyzing logs of 25 users' real-world browsing, Nielsen (2008) estimated that visitors have time to read at most 28% of the words on an average page, about 20% in practice.",
    source: {
      label: "NN/g · How Little Do Users Read?",
      href: "https://www.nngroup.com/articles/how-little-do-users-read/",
    },
  },
  {
    claim: "5 users find 85% of usability problems",
    attributedTo: "Nielsen & Landauer, 1993",
    verdict: "Verified",
    caveat: "conditions apply",
    reality:
      "The model is real: N(1-(1-L)^n) with L averaging 0.31 across the analyzed projects gives 85% at n=5. But L ranged from roughly 0.12 to 0.58; at L=0.15 five users find about 56%. It applies to iterative qualitative testing with homogeneous users, and Spool & Schroeder (2001) found 5 users catching about 35% on complex sites.",
    safeCite:
      "Nielsen & Landauer's 1993 model implies about 5 users surface 85% of the problems a given qualitative test can find, assuming an average per-user detection rate of 31%; with harder-to-detect problems, five users find far less.",
    source: {
      label: "NN/g · Why You Only Need to Test with 5 Users",
      href: "https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/",
    },
  },
  {
    claim: "Every extra form field costs 3 to 5% (or 10%) of conversions",
    attributedTo: "Studies show",
    verdict: "Untraceable",
    reality:
      "No study measures a per-field constant. The roots are single-site anecdotes: Imaginary Landscape cut its contact form from 11 fields to 4 and conversions rose 120% (circa 2008, one company, no controls), plus HubSpot's correlational scan of 40,000 landing pages. Modern A/B tests show cutting fields sometimes does nothing or hurts lead quality.",
    safeCite:
      "In one oft-cited case study (circa 2008), web firm Imaginary Landscape cut its contact form from 11 fields to 4 and conversions rose 120%; controlled tests since show the effect is not universal.",
    source: {
      label: "Imaginary Landscape case study PDF",
      href: "https://www.imagescape.com/media/filer_public/06/94/0694c7f4-8914-4598-8871-b857fbc12737/form_case_study.pdf",
    },
  },
  {
    claim: "24% abandon checkout because they were forced to create an account",
    attributedTo: "Baymard",
    verdict: "Outdated",
    reality:
      "Genuine Baymard survey finding, but from the 2021-2022 wave. Baymard re-runs the survey; the current published figure is 19%, behind extra costs at 39%. Self-reported, multi-select, and excludes people who were just browsing.",
    safeCite:
      "In Baymard's latest survey of US online shoppers, 19% cited forced account creation as a reason for abandoning a checkout; earlier waves put it at 24 to 26%.",
    source: {
      label: "Baymard · cart abandonment (live page)",
      href: "https://baymard.com/lists/cart-abandonment-rate",
    },
  },
  {
    claim: "70.19% average cart abandonment rate",
    attributedTo: "Baymard",
    verdict: "Verified",
    caveat: "stale decimal",
    reality:
      "Baymard's running meta-average across cart-abandonment studies. The 70.19% snapshot fossilized into thousands of posts; the live figure is 70.22% across 50 studies as of 2026. Two decimals on a moving aggregate is false precision, but roughly 7 in 10 carts holds.",
    safeCite:
      "Baymard's running meta-average across 50 studies puts cart abandonment at 70.22% as of 2026, roughly 7 in 10 carts, barely moved since 2020.",
    source: {
      label: "Baymard · cart abandonment (live page)",
      href: "https://baymard.com/lists/cart-abandonment-rate",
    },
  },
  {
    claim: "83.6% of homepages have low-contrast text",
    attributedTo: "WebAIM Million",
    verdict: "Verified",
    caveat: "year-stamp it",
    reality:
      "Correct methodology, correct attribution, stale year. 83.6% was 2023; 79.1% was 2025; the 2026 report says 83.9%, the most common detected accessibility failure for the eighth straight year. Automated detection on homepages only, so it undercounts.",
    safeCite:
      "In the 2026 WebAIM Million report, 83.9% of the top one million home pages had text failing WCAG 2 AA contrast, the most common accessibility failure for the eighth straight year.",
    source: {
      label: "WebAIM Million (current)",
      href: "https://webaim.org/projects/million/",
    },
  },
  {
    claim: "75% of users judge a company's credibility by its website design",
    attributedTo: "Stanford",
    verdict: "Distorted",
    reality:
      "Stanford's real credibility research (Fogg et al., 2,684 participants) found 'design look' mentioned in 46.1% of participants' comments about site credibility, the single most-cited factor. No Stanford publication contains a 75% figure; it appears to be 46.1% inflated through retellings.",
    safeCite:
      "In Stanford's web credibility research (Fogg et al., 2002-2003, 2,684 participants), design look was the most-cited factor in credibility judgments, mentioned in 46.1% of participants' comments.",
    source: {
      label: "Fogg et al., 2003",
      href: "https://dl.acm.org/doi/10.1145/997078.997097",
    },
  },
  {
    claim: "IBM: every dollar invested in ease of use returns $10 to $100",
    attributedTo: "IBM research",
    verdict: "Distorted",
    reality:
      "IBM really published the line, on a 2001 'Cost Justifying Ease of Use' marketing page (recovered via the Wayback Machine), explicitly as a rule of thumb. Its own citations are project-specific usability ROI case studies and a defect-cost ratio about bug fixing. Marketing copy, not a study. Probably the ancestor of the $1-to-$100 Forrester myth.",
    safeCite:
      "A 2001 IBM ease-of-use marketing page offered the rule of thumb that a dollar invested in ease of use returns $10 to $100; an advocacy claim, not a study.",
    source: {
      label: "IBM page, 2001 (Wayback Machine)",
      href: "https://web.archive.org/web/20010410125659/http://www-3.ibm.com/ibm/easy/eou_ext.nsf/Publish/23",
    },
  },
  {
    claim: "Fixing a bug after release costs 100x more than in design",
    attributedTo: "IBM Systems Sciences Institute",
    verdict: "Untraceable",
    reality:
      "The canonical zombie citation of software engineering. The 'IBM Systems Sciences Institute' was an internal training program, not a research institute, and no underlying study has ever been produced (Bossavit; Hillel Wayne; The Register, 2021). Later-is-costlier has directional support in Boehm's 1981 data; the tidy 100x constant does not.",
    safeCite:
      "Defects generally cost more to fix the later they are found (Boehm, 1981, project-specific data), but the famous 100x chart attributed to the IBM Systems Sciences Institute traces to no findable study.",
    source: {
      label: "The Register on the debunk (2021)",
      href: "https://www.theregister.com/2021/07/22/bugs_expense_bs/",
    },
  },
  {
    claim: "75% of new SaaS users churn within the first week",
    attributedTo: "Industry data",
    verdict: "Untraceable",
    reality:
      "No named dataset exists. Almost certainly Quettra's 2015 mobile-app retention data (average Android app loses 77% of daily active users within 3 days of install) rebranded as a SaaS fact. Mobile DAU decay and SaaS account churn are different animals.",
    safeCite:
      "Quettra's 2015 analysis found the average Android app loses 77% of daily active users within 3 days of install; the '75% of SaaS users churn in week one' version of this claim has no traceable source.",
    source: {
      label: "Quettra data via Andrew Chen",
      href: "https://andrewchen.com/new-data-shows-why-losing-80-of-your-mobile-users-is-normal-and-that-the-best-apps-do-much-better/",
    },
  },
  {
    claim: "40 to 60% of free-trial users use the product once and never return",
    attributedTo: "Patrick McKenzie",
    verdict: "Verified",
    caveat: "expert anecdote",
    reality:
      "Correctly attributed and honestly framed by its author: an operator's estimate from his own products and clients, popularized through Intercom's onboarding book. No dataset behind it, and McKenzie never claimed one. Quote it as a practitioner's rule of thumb, never as 'studies show'.",
    safeCite:
      "Patrick McKenzie's rule of thumb from running and advising SaaS businesses: 40 to 60% of free-trial signups use the product once and never come back. A credible operator's anecdote, not a study.",
    source: {
      label: "Intercom on Onboarding (PDF)",
      href: "https://assets.ctfassets.net/xny2w179f4ki/4PQNPvvOxsGlGYYum4LIbM/13c80de059d4866837da972661f8cdaa/intercom-on-onboarding.pdf",
    },
  },
];

const VERDICT_STYLE: Record<Verdict, { bg: string; fg: string; border: string }> = {
  Verified: { bg: "#e7f0e9", fg: "#2f6b46", border: "#bcd6c4" },
  Distorted: { bg: "#fdf3d7", fg: "#8a6d0a", border: "#eede9d" },
  Untraceable: { bg: "rgba(232, 68, 42, 0.1)", fg: "#b0331c", border: "rgba(232, 68, 42, 0.35)" },
  Outdated: { bg: "var(--bg-alt)", fg: "var(--text-muted)", border: "var(--border)" },
};

const FILTERS: (Verdict | "All")[] = [
  "All",
  "Verified",
  "Distorted",
  "Untraceable",
  "Outdated",
];

const mono: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11.5,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

function Badge({ verdict, caveat }: { verdict: Verdict; caveat?: string }) {
  const s = VERDICT_STYLE[verdict];
  return (
    <span
      style={{
        ...mono,
        fontWeight: 600,
        background: s.bg,
        color: s.fg,
        border: `1px solid ${s.border}`,
        borderRadius: 100,
        padding: "3px 10px",
        whiteSpace: "nowrap",
      }}
    >
      {verdict}
      {caveat ? ` · ${caveat}` : ""}
    </span>
  );
}

export default function StatLedger() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [open, setOpen] = useState<number | null>(null);

  const visible = STATS.map((s, i) => ({ ...s, i })).filter(
    (s) => filter === "All" || s.verdict === filter,
  );

  const counts = FILTERS.map((f) => ({
    f,
    n: f === "All" ? STATS.length : STATS.filter((s) => s.verdict === f).length,
  }));

  return (
    <div style={{ margin: "26px 0" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {counts.map(({ f, n }) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setOpen(null);
            }}
            style={{
              ...mono,
              fontWeight: 600,
              padding: "7px 13px",
              borderRadius: 100,
              border: `1px solid ${filter === f ? "var(--ink)" : "var(--border)"}`,
              background: filter === f ? "var(--ink)" : "var(--surface)",
              color: filter === f ? "#fff" : "var(--text-muted)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {f} · {n}
          </button>
        ))}
      </div>

      {visible.map((stat) => {
        const isOpen = open === stat.i;
        return (
          <div
            key={stat.i}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              marginBottom: 10,
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : stat.i)}
              aria-expanded={isOpen}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 14,
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                padding: "14px 18px",
                cursor: "pointer",
              }}
            >
              <span style={{ flex: 1 }}>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 15.5,
                    lineHeight: 1.3,
                    color: "var(--ink)",
                  }}
                >
                  &ldquo;{stat.claim}&rdquo;
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: 12.5,
                    color: "var(--text-faint)",
                    marginTop: 3,
                  }}
                >
                  usually attributed to: {stat.attributedTo}
                </span>
              </span>
              <Badge verdict={stat.verdict} caveat={stat.caveat} />
              <span
                aria-hidden="true"
                style={{
                  color: "var(--text-faint)",
                  transform: isOpen ? "rotate(90deg)" : "none",
                  transition: "transform 0.15s ease",
                }}
              >
                ▸
              </span>
            </button>

            <div style={{ display: isOpen ? "block" : "none", padding: "0 18px 16px" }}>
              <p
                style={{
                  fontSize: 14.5,
                  lineHeight: 1.6,
                  color: "var(--text)",
                  margin: "0 0 12px",
                }}
              >
                {stat.reality}
              </p>
              {stat.safeCite ? (
                <div
                  style={{
                    background: "var(--surface-soft)",
                    border: "1px solid var(--border-soft)",
                    borderRadius: 9,
                    padding: "10px 14px",
                    marginBottom: 10,
                  }}
                >
                  <div style={{ ...mono, color: "var(--text-muted)", marginBottom: 6 }}>
                    Safe to cite
                  </div>
                  <p style={{ fontSize: 13.5, lineHeight: 1.55, margin: "0 0 10px" }}>
                    {stat.safeCite}
                  </p>
                  <CopyButton text={stat.safeCite} label="Copy citation" />
                </div>
              ) : (
                <div
                  style={{
                    ...mono,
                    color: "#b0331c",
                    marginBottom: 10,
                  }}
                >
                  No defensible version exists. Do not cite.
                </div>
              )}
              {stat.source && (
                <a
                  href={stat.source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 13, color: "var(--text-muted)" }}
                >
                  Primary source: {stat.source.label} ↗
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
