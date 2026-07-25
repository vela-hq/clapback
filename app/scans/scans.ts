// Registry for Product Scans: long-form walks of a real multi-step flow on a
// real site, mapped as a graph, with every finding pinned to a dated
// screenshot. Receipts (app/blog/articles.ts) is the article series; this is
// the research series, and it needs metadata articles don't have: the subject,
// the flow walked, the date it was walked, and the severity tally.
//
// Same contract as ARTICLES: the [slug] route, the index, the sitemap, and the
// OG image all read from here so metadata lives in exactly one place.

export type ScanFaq = { q: string; a: string };

/** One stage of the walked funnel. Coordinates are the FlowMap's own space. */
export type ScanNode = {
  id: string;
  label: string;
  sub: string;
  /** Findings filed against this stage. Omitted when none. */
  findings?: number;
  /** Chapter anchor this node scrolls to. */
  target?: string;
  /** A refusal detour: a screen that exists only to re-ask a question. */
  detour?: boolean;
  /** The boundary the walk stopped at. */
  stop?: boolean;
  x: number;
  y: number;
  w: number;
};

export type ScanMeta = {
  slug: string;
  /** Episode number in the series. */
  number: number;
  /** SEO <title>. */
  title: string;
  /** On-page headline. */
  h1: string;
  description: string;
  /** Standfirst under the headline, and the hook on listing cards. */
  excerpt: string;
  /** The site walked, as a bare host. */
  host: string;
  /** The flow walked, in plain words. */
  flow: string;
  /** When the walk happened. Distinct from datePublished on purpose: the
      screenshots are evidence and evidence is dated. */
  scanDate: string;
  datePublished: string;
  dateModified: string;
  readingMinutes: number;
  keywords: string[];
  /** Header chips: the scan in three facts. */
  chips: string[];
  /** The counted ratios the piece is built on. */
  stats: { num: string; sup?: string; label: string }[];
  tally: { blocker: number; major: number; minor: number };
  nodes: ScanNode[];
  faq?: ScanFaq[];
  /** Receipts articles worth reading next. */
  relatedArticles: string[];
};

export const SERIES_NAME = "Scans";
export const SERIES_TAGLINE =
  "We walk one real checkout end to end and count every time it asks you to say no.";

export const SCANS: ScanMeta[] = [
  {
    slug: "ryanair-booking-flow",
    number: 1,
    title: "Ryanair checkout teardown: 23 clicks and 13 refusals for a £19.99 seat",
    h1: "The £19.99 gauntlet: buying Ryanair's cheapest ticket",
    description:
      "We walked Ryanair's booking flow end to end and counted every upsell. 23 clicks, 13 refusals, 2 warning screens to decline one seat, and a pre-ticked consent box. Dated screenshots for all of it.",
    excerpt:
      "We walked the London Stansted to Dublin booking flow with one rule: buy the advertised fare and decline everything else. It took 23 clicks, 13 refusals, and two separate warnings about a middle seat.",
    host: "ryanair.com",
    flow: "search to payment, one way, cheapest fare",
    scanDate: "2026-07-25",
    datePublished: "2026-07-25",
    dateModified: "2026-07-25",
    readingMinutes: 12,
    keywords: [
      "Ryanair dark patterns",
      "Ryanair booking flow",
      "checkout dark patterns",
      "dark patterns examples 2026",
      "airline upsell UX",
      "pre-checked consent box",
      "confirmshaming examples",
      "UX teardown",
    ],
    chips: ["13 screens", "22 findings", "nothing purchased"],
    stats: [
      { num: "23", sup: "1", label: "clicks from homepage to payment page, cheapest path" },
      { num: "13", sup: "2", label: "explicit refusals of add-ons, upgrades or account creation" },
      { num: "3×", label: "the same priority boarding product, pitched three times" },
      { num: "4.8×", label: "the priciest bundle versus the base fare (£95.48 on £19.99)" },
    ],
    tally: { blocker: 4, major: 8, minor: 10 },
    nodes: [
      { id: "home", label: "Homepage", sub: "3 interrupts", findings: 2, target: "ch1", x: 8, y: 70, w: 96 },
      { id: "search", label: "Search", sub: "ToS checkbox", findings: 1, target: "ch1", x: 125, y: 70, w: 96 },
      { id: "results", label: "Results", sub: "7 scarcity tags", findings: 1, target: "ch2", x: 242, y: 70, w: 96 },
      { id: "fare", label: "Fare wall", sub: "4 bundles", findings: 3, target: "ch2", x: 359, y: 70, w: 96 },
      { id: "pax", label: "Passenger", sub: "login skippable", x: 476, y: 70, w: 96 },
      { id: "seats", label: "Seats", sub: "£8.50 to £22.50", findings: 3, target: "ch3", x: 593, y: 70, w: 96 },
      { id: "bags", label: "Bags", sub: "forced choice", findings: 2, target: "ch4", x: 710, y: 70, w: 96 },
      { id: "extras1", label: "Extras 1/2", sub: "upsell page", findings: 3, target: "ch4", x: 827, y: 70, w: 96 },
      { id: "extras2", label: "Extras 2/2", sub: "transport", findings: 1, target: "ch4", x: 944, y: 70, w: 96 },
      { id: "pay", label: "Review & Pay", sub: "stop line", findings: 6, target: "ch5", stop: true, x: 1061, y: 70, w: 104 },
      { id: "reask", label: "Upgrade re-ask", sub: "“REGULAR is ideal”", target: "ch2", detour: true, x: 360, y: 190, w: 110 },
      { id: "warn1", label: "Seat warning 1", sub: "4 fear appeals", target: "ch3", detour: true, x: 515, y: 190, w: 110 },
      { id: "warn2", label: "Seat warning 2", sub: "choice demoted", target: "ch3", detour: true, x: 650, y: 190, w: 110 },
    ],
    faq: [
      {
        q: "Does Ryanair use dark patterns?",
        a: "On the walk we ran on 25 July 2026, yes, several. The marketing consent checkbox on the payment page arrives pre-ticked with copy explaining how to untick it (preselection). Declining a paid seat requires refusing twice through two warning screens (obstruction). Seven of eight flights carried a \"3 seats left at this price\" badge (scarcity at a volume that makes it meaningless). Ryanair's advertised price held honestly at £19.99 through to checkout, so the issue is the cost in attention, not the cost in money.",
      },
      {
        q: "How many clicks does it take to book a Ryanair flight?",
        a: "Roughly 23 clicks and 24 keystrokes from homepage to payment page on the cheapest possible path, with every optional purchase declined. 13 of those interactions exist only to refuse something: an upgrade, an add-on, or an account. Four more refusals are still waiting on the payment page when the walk stops.",
      },
      {
        q: "Why does Ryanair ask twice before you skip seat selection?",
        a: "Two consecutive interstitials re-litigate the same decision. The first lists four reasons to buy a seat; the second re-lists the consequences and demotes your actual choice to a text link under a yellow \"Select seats now\" button. The consequence with teeth is functional rather than persuasive: without a paid seat, online check-in opens 24 hours before departure instead of 60 days.",
      },
      {
        q: "Is a pre-ticked marketing consent box legal in the EU?",
        a: "Consent gathered from a pre-ticked box is not valid consent under the GDPR standard of a freely given, specific, informed and unambiguous indication by a clear affirmative action, and the Court of Justice said so directly in Planet49 (C-673/17, October 2019). We are describing what the page did on the day we walked it, not issuing a legal opinion about Ryanair's compliance position.",
      },
      {
        q: "How do you count clicks and refusals in a scan?",
        a: "A click is one deliberate pointer action on a control, with keystrokes counted separately and only the quickest correct route counted. A refusal is any interaction whose only purpose is declining a purchase, an upgrade, or an account. The rules are fixed before the walk so the numbers stay comparable across scans, and they are restated in the methodology footnotes of every piece.",
      },
    ],
    relatedArticles: [
      "why-users-abandon-signup",
      "heuristic-evaluation-example",
      "founder-ux-audit-checklist",
    ],
  },
];

export function getScan(slug: string): ScanMeta | undefined {
  return SCANS.find((s) => s.slug === slug);
}
