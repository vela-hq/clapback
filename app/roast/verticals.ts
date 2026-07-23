// Central registry for the programmatic /roast/[vertical] landing pages. The
// route, the /roast hub, the sitemap, and per-vertical OG images all read from
// here, exactly like blog/articles.ts drives the Receipts blog.
//
// Each vertical targets a distinct "roast my {x}" search cluster. These are
// real content pages, not doorway pages: every entry carries unique intro copy,
// a vertical-specific checklist tied to named rules, and its own FAQ (emitted
// as FAQPage structured data). Keep the copy substantive and specific to the
// vertical or Google treats the set as thin/duplicated.

export type VerticalCheck = {
  /** Named rule the check maps to — keeps findings falsifiable, not vibes. */
  rule: string;
  label: string;
  body: string;
};

export type VerticalFaq = { q: string; a: string };

export type Vertical = {
  slug: string;
  /** The bare noun, e.g. "website" — used in running copy and CTAs. */
  noun: string;
  /** SEO <title>, tuned for the query. */
  title: string;
  /** On-page headline. */
  h1: string;
  /** Meta description (~150 chars). */
  description: string;
  /** Standfirst under the H1. */
  lede: string;
  /** Unique body paragraphs — the anti-thin-content substance. */
  intro: string[];
  checksTitle: string;
  checks: VerticalCheck[];
  faq: VerticalFaq[];
  /** Placeholder for the URL box. */
  placeholder: string;
  /** Two-line headline for the share card. */
  ogHeadline: [string, string];
  /** Slugs of sibling verticals to cross-link. */
  related: string[];
};

export const VERTICALS: Vertical[] = [
  {
    slug: "website",
    noun: "website",
    title: "Roast My Website: Free AI UX Roast, With Screenshots",
    h1: "Roast my website.",
    description:
      "Paste a URL and an AI agent roasts your website's UX like a real user: cited rules, annotated screenshots, ticket-ready fixes. Free mini roast, no login.",
    lede:
      "An AI agent uses your site like a first-time visitor and roasts everything that trips it up, with a screenshot for every complaint. A real browser session, not a screenshot pasted into ChatGPT.",
    intro: [
      "Most \"AI website roast\" tools paste a single screenshot into a language model and hand you back fifteen confident guesses. That misses about half of what's actually wrong, because half of a website's UX failures only appear when something gets *used*: a form submitted, an error triggered, a second page loaded. When Baymard put screenshot-only reviews to the test, they caught 14% of real issues and were wrong 80% of the time.",
      "ClapBack puts Claude Opus in a real headless browser. It scrolls, clicks, and reads your site like a stranger who has never seen it before, then reports each problem with the screenshot that proves it and the named usability rule it breaks. You can verify any finding in a few seconds instead of taking our word for it.",
    ],
    checksTitle: "What the roast looks for on a website",
    checks: [
      {
        rule: "Nielsen · Visibility of system status",
        label: "First-impression clarity",
        body: "Can a stranger tell what you do and what to do next within five seconds? Vague hero copy and mystery-meat navigation are the most common reasons visitors bounce before they ever scroll.",
      },
      {
        rule: "WCAG 2.2 · 1.4.3 Contrast",
        label: "Contrast & readability",
        body: "83.9% of the top million home pages ship text that fails WCAG AA contrast. Gray-on-gray body copy and low-contrast buttons cost you the users who most need to read them.",
      },
      {
        rule: "Fitts's Law · Laws of UX",
        label: "Tap targets & mobile layout",
        body: "Buttons too small to hit, content that overflows on a phone, a menu that hides your primary action. The roast walks the mobile layout, not just the desktop one.",
      },
      {
        rule: "Nielsen · Error prevention",
        label: "Forms that don't fight you",
        body: "It submits your forms empty, with junk, and correctly, hunting for missing labels, silent validation failures, and dead ends that lose the lead you worked to earn.",
      },
      {
        rule: "Jakob's Law · Laws of UX",
        label: "Trust & credibility signals",
        body: "Missing social proof, a broken link, a 2019 copyright year: small cracks that tell a first-time visitor nobody's home. It flags the ones that cost conversions.",
      },
      {
        rule: "Doherty Threshold · Laws of UX",
        label: "Speed & feedback",
        body: "Slow first paint and buttons that give no feedback on click read as \"broken\" long before a user blames their connection. The agent notices what a stopwatch can't describe.",
      },
    ],
    faq: [
      {
        q: "How do I get my website roasted for free?",
        a: "Paste your URL above and the agent runs a free mini roast of your homepage in a minute or two, returning findings with screenshots. No signup, no card. The full roast crawls every page and tests every flow.",
      },
      {
        q: "Is this just ChatGPT looking at a screenshot?",
        a: "No. ClapBack drives a real browser with Claude Opus and interacts with the live page. It scrolls, clicks, and submits forms, which is where roughly half of UX issues live. Screenshot-only tools can't see those.",
      },
      {
        q: "Will the roast be mean?",
        a: "The tone is savage; the findings are not made up. Every complaint cites a named rule and shows the screenshot. We punch at the product, never at the person who built it.",
      },
      {
        q: "Is it safe to run on my live site?",
        a: "It browses like an ordinary visitor and won't change your data. If live writes make you nervous, point it at a staging URL instead.",
      },
    ],
    placeholder: "your-website.com",
    ogHeadline: ["Roast my", "website."],
    related: ["saas", "shopify-store", "startup"],
  },
  {
    slug: "portfolio",
    noun: "portfolio",
    title: "Roast My Portfolio: Brutally Honest AI Design Critique",
    h1: "Roast my portfolio.",
    description:
      "Free AI critique of your design or dev portfolio: an agent reviews it like a hiring manager and roasts the UX, layout, and case studies. Screenshots included.",
    lede:
      "For designers and developers, not stock pickers. An AI agent reviews your portfolio the way a hiring manager skimming forty tabs would, then tells you exactly where it loses them.",
    intro: [
      "A portfolio gets about ten seconds before a reviewer decides to keep reading or close the tab. The work might be great, but if the case studies bury the outcome, the contrast makes the captions unreadable, or the first project is your weakest, that ten seconds goes to waste.",
      "ClapBack reads your portfolio like a cold reviewer and flags what costs you the callback. Maybe the hero doesn't say what you do. Maybe your best case study never states a result, or the project grid makes people dig for the good work. Every note comes with the screenshot and the reason, so you can fix it before the next application instead of after the rejection.",
    ],
    checksTitle: "What the roast looks for on a portfolio",
    checks: [
      {
        rule: "Nielsen · Recognition over recall",
        label: "The 10-second read",
        body: "Does the top of the page say who you are, what you do, and what you want, before anyone scrolls? Reviewers don't dig; they decide. The roast flags a hero that makes them guess.",
      },
      {
        rule: "Von Restorff Effect · Laws of UX",
        label: "Lead with your best",
        body: "The first project is the one everyone sees. If your strongest work is third in the grid and a side project is first, you're spending your one impression badly.",
      },
      {
        rule: "Case-study structure",
        label: "Outcomes, not just visuals",
        body: "Pretty mockups with no problem, role, or result read as decoration. The roast checks whether each case study actually tells the story a hiring manager is scanning for.",
      },
      {
        rule: "WCAG 2.2 · 1.4.3 Contrast",
        label: "Readable captions & body",
        body: "Designers love light-gray 13px captions. Reviewers over 35, or on a laptop in a bright room, can't read them. It flags the text that fails contrast.",
      },
      {
        rule: "Nielsen · User control & freedom",
        label: "Navigation & dead ends",
        body: "A case study with no way back, a resume link that 404s, contact info you have to hunt for. Small frictions like these end a review early.",
      },
      {
        rule: "Doherty Threshold · Laws of UX",
        label: "Heavy images & load time",
        body: "Portfolios are image-heavy by nature. A hero that takes six seconds to paint loses the reviewer before your work ever appears.",
      },
    ],
    faq: [
      {
        q: "Is this for design portfolios or investment portfolios?",
        a: "Design and developer portfolios, meaning the website where you show your work. It reviews UX, layout, and case-study structure, not stocks or crypto.",
      },
      {
        q: "Will it critique my actual work or just the site?",
        a: "It roasts the portfolio as an experience: whether the site presents your work clearly and persuasively to a reviewer. It won't grade your visual taste, but it will tell you where the presentation is getting in the way of it.",
      },
      {
        q: "How is this different from posting on Reddit for feedback?",
        a: "You get a structured critique in minutes instead of waiting for replies, every point cites a named UX rule and shows the screenshot, and it won't get distracted arguing about your color choices.",
      },
      {
        q: "Does it work for Webflow, Framer, and custom sites?",
        a: "Yes. It uses the live URL like any visitor, so it doesn't matter what you built it with.",
      },
    ],
    placeholder: "your-portfolio.com",
    ogHeadline: ["Roast my", "portfolio."],
    related: ["ui", "website", "startup"],
  },
  {
    slug: "shopify-store",
    noun: "Shopify store",
    title: "Roast My Shopify Store: Free AI Conversion & UX Roast",
    h1: "Roast my Shopify store.",
    description:
      "An AI agent shops your Shopify store like a real customer and roasts the UX killing your conversion rate: product pages, cart, checkout. Screenshots and fixes.",
    lede:
      "An AI agent shops your store like a real customer. It browses, adds to cart, starts checkout, and roasts every point of friction between a visitor and a completed order.",
    intro: [
      "The average online store loses roughly 70% of carts before checkout completes, and most of that is fixable UX, not pricing. Forced account creation, hidden shipping costs, a product page that doesn't answer the obvious question: each one sends buyers to a competitor without a word.",
      "ClapBack runs the buyer's journey on your live store and finds where it leaks. A product page with no trust signals. A cost that first appears at step three of checkout. A mobile cart that turns into a pixel hunt. Every finding shows the screenshot and the rule, so you're fixing a measured leak instead of guessing at your theme.",
    ],
    checksTitle: "What the roast looks for on a store",
    checks: [
      {
        rule: "Baymard · Checkout usability",
        label: "The checkout gauntlet",
        body: "Forced account creation is cited by 19% of shoppers who abandon a checkout. The agent walks your flow looking for mandatory accounts, surprise costs, and too many steps.",
      },
      {
        rule: "Nielsen · Match to the real world",
        label: "Product page persuasion",
        body: "Does the page answer size, materials, shipping, and returns without a hunt? Missing that information is a silent add-to-cart killer, especially on mobile.",
      },
      {
        rule: "Von Restorff Effect · Laws of UX",
        label: "A clear add-to-cart",
        body: "The single most important button on the page shouldn't blend into the theme. It flags weak, low-contrast, or below-the-fold primary CTAs.",
      },
      {
        rule: "Nielsen · Visibility of system status",
        label: "Cart & shipping transparency",
        body: "Shipping cost that only appears at the final step is the number-one cited reason for abandonment. The roast surfaces costs the customer discovers too late.",
      },
      {
        rule: "Fitts's Law · Laws of UX",
        label: "Mobile shopping",
        body: "Most store traffic is mobile. Tiny tap targets, a cropped product image, a quantity stepper you can't hit. It tests the phone layout, because that's where the money is.",
      },
      {
        rule: "Jakob's Law · Laws of UX",
        label: "Trust & risk reduction",
        body: "No reviews, no return policy, no visible support. These are the missing signals that make a first-time buyer hesitate at exactly the wrong moment.",
      },
    ],
    faq: [
      {
        q: "Will it actually go through my checkout?",
        a: "The free mini roast reviews your storefront and product experience. The full roast walks deeper into the cart and checkout flow, stopping short of placing a real order. It hunts for friction, it doesn't buy anything.",
      },
      {
        q: "Does it work on Shopify themes and headless stores?",
        a: "Yes. It uses your live URL like any shopper, so any Shopify theme, app stack, or headless setup works the same way.",
      },
      {
        q: "Will running it affect my analytics or inventory?",
        a: "It browses like one ordinary visitor and doesn't complete purchases, so it won't touch inventory. It may register as a single session in your analytics, the same as any visit.",
      },
      {
        q: "Is this an SEO audit?",
        a: "No, it's a UX and conversion roast. It looks at what makes shoppers leave without buying, not your keyword rankings or backlinks.",
      },
    ],
    placeholder: "your-store.com",
    ogHeadline: ["Roast my", "Shopify store."],
    related: ["website", "startup", "saas"],
  },
  {
    slug: "saas",
    noun: "SaaS",
    title: "Roast My SaaS: AI UX & Conversion Roast for Founders",
    h1: "Roast my SaaS.",
    description:
      "An AI agent signs up for your SaaS like a new user and roasts the UX: landing page, signup, onboarding, empty states. Cited rules, screenshots, ticket-ready fixes.",
    lede:
      "An AI agent signs up for your product like a brand-new user and roasts the whole first-run experience: landing page, signup, and that first empty screen where activation goes to die.",
    intro: [
      "For a SaaS, the expensive UX failures aren't on the marketing page; they're in the gap between \"clicked sign up\" and \"got value.\" A long form, a verification wall, an empty dashboard with no obvious first action. Each one costs activation, and average activation sits around 34%, so most signups never become users.",
      "ClapBack walks that path as a first-time user and roasts every place it stalls: the field you don't need, the password rules hidden until you fail them, the onboarding that dumps people into a blank screen. Every finding cites the rule it breaks and ships as a Jira- or Linear-ready ticket, so it lands in your backlog instead of a Google Doc.",
    ],
    checksTitle: "What the roast looks for on a SaaS",
    checks: [
      {
        rule: "Nielsen · Visibility of system status",
        label: "Landing-page clarity",
        body: "Does the page say what the product does and who it's for, or is it a wall of abstract benefit-speak? Vague positioning is the first leak in the funnel.",
      },
      {
        rule: "Baymard · Form usability",
        label: "The signup form",
        body: "It counts your fields, checks for inline validation, and hunts for hidden password rules and forced steps. That friction turns intent into a bounce before the account even exists.",
      },
      {
        rule: "Nielsen · Recognition over recall",
        label: "First-run & empty states",
        body: "The moment after signup decides activation. An empty dashboard with no next action, no sample data, no path to value is where most trials go to die. The roast flags it.",
      },
      {
        rule: "Nielsen · Help users recover from errors",
        label: "Error & edge states",
        body: "It submits bad input on purpose to see whether your errors explain the fix or just say \"invalid.\" Silent or cryptic failures are activation killers you never see in analytics.",
      },
      {
        rule: "Jakob's Law · Laws of UX",
        label: "Pricing & trust",
        body: "Confusing plans, a hidden \"contact us,\" no clear free path. It flags the pricing-page friction that stalls buyers who were otherwise ready.",
      },
      {
        rule: "Doherty Threshold · Laws of UX",
        label: "Perceived speed & feedback",
        body: "Actions with no loading feedback and slow first paint read as broken. It notices the moments where a user assumes the product hung.",
      },
    ],
    faq: [
      {
        q: "Will it sign up for my product?",
        a: "The full roast walks your signup and onboarding as a new user, which is exactly where most SaaS UX problems hide. The free mini roast focuses on your landing page. Point it at staging if a test signup on production is a concern.",
      },
      {
        q: "Does it export to Jira or Linear?",
        a: "Yes. Every finding is written as a ticket with a severity, a screenshot, and a concrete fix, so it drops straight into your backlog without a triage meeting.",
      },
      {
        q: "How is this different from a human UX audit?",
        a: "A consultant takes weeks and a retainer and hands you a slide deck. ClapBack takes minutes and a URL and hands you tickets. It catches rule-checkable defects fast; it won't replace research into why your users behave the way they do.",
      },
      {
        q: "Can it get past my login?",
        a: "The mini roast reviews what's public. For the full roast of gated flows, you can run it against a staging environment or a demo account so it sees the product a real user sees.",
      },
    ],
    placeholder: "your-app.com",
    ogHeadline: ["Roast my", "SaaS."],
    related: ["website", "startup", "ui"],
  },
  {
    slug: "ui",
    noun: "UI",
    title: "Roast My UI: Instant AI Design Feedback, With Receipts",
    h1: "Roast my UI.",
    description:
      "Instant AI feedback on your interface: an agent roasts your UI against named usability rules for hierarchy, contrast, spacing, and states. Annotated screenshots.",
    lede:
      "Instant, structured feedback on your interface. An AI agent roasts your UI against named usability laws for hierarchy, contrast, states, and spacing, and shows the screenshot behind every call.",
    intro: [
      "\"Roast my UI\" posts usually get you a handful of contradictory opinions and an argument about a button radius. What you actually want is a structured pass against the rules real interfaces are judged by: visual hierarchy, contrast, feedback on interaction, consistency. With receipts to back each note.",
      "ClapBack looks at your live interface and roasts it against those named laws, not personal taste. It flags the CTA that doesn't stand out, the states you forgot (hover, focus, empty, error), the contrast that fails, and the spacing that reads as noise. Each note carries the screenshot and the rule, so the feedback is checkable instead of a matter of opinion.",
    ],
    checksTitle: "What the roast looks for in a UI",
    checks: [
      {
        rule: "Von Restorff Effect · Laws of UX",
        label: "Visual hierarchy",
        body: "Is the primary action unmistakably primary? When everything shouts, nothing does. The roast flags interfaces where the most important element doesn't win the eye.",
      },
      {
        rule: "WCAG 2.2 · 1.4.3 Contrast",
        label: "Contrast & legibility",
        body: "It checks real contrast ratios, not vibes. It catches the light-gray text and tinted buttons that look refined in Figma and fail on a real screen.",
      },
      {
        rule: "Nielsen · Consistency & standards",
        label: "Consistency",
        body: "Three button styles, four shades of the same gray, inconsistent spacing. That drift makes a UI feel amateur even when each screen looks fine on its own.",
      },
      {
        rule: "Nielsen · Visibility of system status",
        label: "Interaction states",
        body: "Hover, focus, active, loading, disabled, empty, error: the states that get skipped. Missing focus states in particular are both an accessibility failure and a keyboard-user trap.",
      },
      {
        rule: "Law of Proximity · Laws of UX",
        label: "Spacing & grouping",
        body: "Related things should sit together and unrelated things apart. Cramped or arbitrary spacing makes users work to parse the layout.",
      },
      {
        rule: "Miller's Law · Laws of UX",
        label: "Density & cognitive load",
        body: "Too many choices, too much on screen at once. It flags the interfaces that overwhelm before they orient.",
      },
    ],
    faq: [
      {
        q: "Can it review a Figma file or just a live URL?",
        a: "It reviews a live URL: a deployed app, a prototype, or a staging link. It evaluates real rendered contrast and interaction states, which a static Figma frame can't fully show. A public prototype URL works.",
      },
      {
        q: "Is the feedback just opinion?",
        a: "No. Every note maps to a named rule (a Nielsen heuristic, a WCAG criterion, or a Law of UX) and comes with the screenshot, so you can check it rather than take our word for it.",
      },
      {
        q: "Will it help with accessibility?",
        a: "Partly. It catches machine-checkable and visible issues like contrast failures and missing focus states, which are common and costly. A full accessibility audit with a screen-reader user goes further than any automated pass.",
      },
      {
        q: "How fast is it?",
        a: "The free mini roast returns in a minute or two. It's built for the moment before you ship, not a two-week engagement.",
      },
    ],
    placeholder: "your-app.com",
    ogHeadline: ["Roast my", "UI."],
    related: ["portfolio", "saas", "website"],
  },
  {
    slug: "startup",
    noun: "startup's website",
    title: "Roast My Startup's Website: AI Roast of Your Landing Page",
    h1: "Roast my startup's website.",
    description:
      "An AI agent roasts your startup's landing page and site the way a skeptical first-time visitor would: positioning, clarity, signup, trust. Screenshots and fixes.",
    lede:
      "Your idea might be great. Your website is what strangers actually judge. An AI agent roasts your startup's landing page the way a skeptical first-time visitor would, in the ten seconds you actually get.",
    intro: [
      "Plenty of tools will roast your startup idea. This one roasts the thing standing between the idea and a signup: the website. Founders are too close to their own product to see that the hero explains the tech instead of the value, that the CTA is buried, or that nothing on the page tells a stranger why to trust you.",
      "ClapBack reads your landing page and site as a cold, skeptical visitor and marks where you lose them. Muddy positioning, a call to action that hides, missing proof, a signup that asks for too much too soon. Every finding cites the rule it breaks and shows the screenshot, so you can fix the page that's been capping your conversion.",
    ],
    checksTitle: "What the roast looks for on a startup site",
    checks: [
      {
        rule: "Nielsen · Match to the real world",
        label: "Positioning in one line",
        body: "Can a stranger tell what you do and who it's for, in plain words, above the fold? Founders default to describing the tech; visitors need the value. This is the most common startup-site failure.",
      },
      {
        rule: "Von Restorff Effect · Laws of UX",
        label: "One obvious next step",
        body: "A landing page should have one clear primary action. Five competing CTAs, or a buried \"sign up,\" splits attention and drops conversion.",
      },
      {
        rule: "Jakob's Law · Laws of UX",
        label: "Trust for an unknown brand",
        body: "You have no brand equity yet, so proof matters more: logos, testimonials, real numbers, a human founder. The roast flags the missing signals a skeptic looks for.",
      },
      {
        rule: "Baymard · Form usability",
        label: "Signup / waitlist friction",
        body: "Asking for a company size and phone number before anyone's seen value kills early signups. It counts what you ask for versus what the first step actually needs.",
      },
      {
        rule: "WCAG 2.2 · 1.4.3 Contrast",
        label: "Readable, not just on-brand",
        body: "Trendy low-contrast palettes and tiny type look modern and read badly. It flags the text a real visitor squints at.",
      },
      {
        rule: "Doherty Threshold · Laws of UX",
        label: "Load speed & polish",
        body: "A slow, janky first paint reads as \"early and fragile\" to exactly the investors and customers you're trying to convince.",
      },
    ],
    faq: [
      {
        q: "Does it roast my idea or my website?",
        a: "Your website. It won't tell you whether to build the company. It tells you where your landing page and site are failing to sell the idea you already have, which makes it far more actionable than idea-validation bots.",
      },
      {
        q: "My site is a rushed MVP. Is it worth roasting?",
        a: "Especially then. Early sites make predictable, fixable mistakes: buried CTAs, tech-first copy, missing proof. Catching them takes minutes and can lift conversion before you spend on traffic.",
      },
      {
        q: "Can it roast a competitor's site too?",
        a: "Yes. Paste any URL, your own or a competitor you'd like to learn from. It roasts whatever you point it at.",
      },
      {
        q: "Do I get something I can act on?",
        a: "Yes. Every finding is a concrete, ticket-ready fix with a severity and a screenshot, not a vague \"improve your messaging.\" You can hand it straight to whoever owns the site.",
      },
    ],
    placeholder: "your-startup.com",
    ogHeadline: ["Roast my", "startup."],
    related: ["saas", "website", "portfolio"],
  },
];

export const ROAST_HUB = {
  title: "Roast My Website, Portfolio, SaaS & More: Free AI UX Roasts",
  description:
    "Free AI UX roasts by target: website, portfolio, Shopify store, SaaS, UI, and startup landing page. An agent uses your site like a real user and shows the receipts.",
  tagline:
    "Pick your target. An AI agent uses it like a real user, roasts what sucks, and backs every call with a screenshot.",
};

export function getVertical(slug: string): Vertical | undefined {
  return VERTICALS.find((v) => v.slug === slug);
}
