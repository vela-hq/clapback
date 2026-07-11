import Link from "next/link";
import {
  ShortVersion,
  Roast,
  Receipt,
  PullStat,
  Ticket,
  Sources,
} from "../../components/blog/Widgets";
import ScoredChecklist, {
  type CheckGroup,
  type VerdictTier,
} from "../../components/blog/ScoredChecklist";
import CopyButton from "../../components/blog/CopyButton";

const GROUPS: CheckGroup[] = [
  {
    title: "Flow 1 · Signup",
    items: [
      {
        id: "s1",
        text: "Your signup form has 5 fields or fewer, and you can defend each one out loud.",
        rule: "Nielsen #8 · Minimalist design",
      },
      {
        id: "s2",
        text: "Your password rules are visible before the user fails them once.",
        rule: "Nielsen #5 · Error prevention",
      },
      {
        id: "s3",
        text: "There is a show-password toggle, and pasting from a password manager works.",
        rule: "WCAG 3.3.8 · Accessible authentication",
      },
      {
        id: "s4",
        text: "Fields validate when the user leaves them, not only after submitting the whole form.",
        rule: "Nielsen #1 · Visibility of status",
      },
      {
        id: "s5",
        text: "Every error names the field and the fix. “Invalid input” appears nowhere.",
        rule: "Nielsen #9 · Recover from errors",
      },
      {
        id: "s6",
        text: "You never ask for anything twice, and that includes “confirm password”.",
        rule: "WCAG 3.3.7 · Redundant entry",
      },
      {
        id: "s7",
        text: "A visitor can see the product working before you demand an account for it.",
        rule: "Nielsen #3 · User control and freedom",
      },
      {
        id: "s8",
        text: "Every field keeps a visible label while the user types. Placeholders don't count.",
        rule: "WCAG 3.3.2 · Labels or instructions",
      },
    ],
  },
  {
    title: "Flow 2 · First session",
    items: [
      {
        id: "o1",
        text: "A new user's first screen has one obvious next step, not a tie between 6 buttons.",
        rule: "Hick's Law",
      },
      {
        id: "o2",
        text: "Every empty state says what belongs there and contains the button that creates it.",
        rule: "Nielsen #6 · Recognition over recall",
      },
      {
        id: "o3",
        text: "Multi-step setup shows which step the user is on and how many remain.",
        rule: "Nielsen #1 · Visibility of status",
      },
      {
        id: "o4",
        text: "Onboarding is skippable, and everything it teaches can be found again later.",
        rule: "Nielsen #3 · User control and freedom",
      },
      {
        id: "o5",
        text: "Buttons and labels use your customer's words, not your database schema's.",
        rule: "Nielsen #2 · Match the real world",
      },
      {
        id: "o6",
        text: "The first task starts from a template or sample data, not a blank canvas.",
        rule: "Nielsen #7 · Flexibility and efficiency",
      },
      {
        id: "o7",
        text: "Anything that takes longer than a second shows progress. Nothing spins in silence.",
        rule: "Nielsen #1 · Visibility of status",
      },
      {
        id: "o8",
        text: "Help sits in the same place on every screen, even if it's just a mailto link.",
        rule: "WCAG 3.2.6 · Consistent help",
      },
    ],
  },
  {
    title: "Flow 3 · Core flow + safety nets",
    items: [
      {
        id: "c1",
        text: "Every destructive action has an undo, or at minimum a confirm plus a way back.",
        rule: "Nielsen #3 · User control and freedom",
      },
      {
        id: "c2",
        text: "You ran your own password reset this month. The email landed within a minute and the link worked.",
        rule: "Nielsen #9 · Recover from errors",
      },
      {
        id: "c3",
        text: "A failed save or submit never throws away what the user typed.",
        rule: "Nielsen #9 · Recover from errors",
      },
      {
        id: "c4",
        text: "Body text and primary buttons pass 4.5:1 contrast, verified with a checker, not by squinting.",
        rule: "WCAG 1.4.3 · Contrast (minimum)",
      },
      {
        id: "c5",
        text: "Every tap target on mobile is at least 24 by 24 px, including icon buttons and close X's.",
        rule: "WCAG 2.5.8 · Target size (minimum)",
      },
      {
        id: "c6",
        text: "You can Tab through the core flow and always see which element has focus.",
        rule: "WCAG 2.4.7 · Focus visible",
      },
      {
        id: "c7",
        text: "The same action has the same name everywhere. Save is never also Apply or Commit.",
        rule: "Nielsen #4 · Consistency and standards",
      },
      {
        id: "c8",
        text: "The core action is the biggest, nearest target on the screen, not a text link in a corner.",
        rule: "Fitts's Law",
      },
    ],
  },
];

const TIERS: VerdictTier[] = [
  {
    min: 0.9,
    title: "Ship it.",
    body: "22 or more out of 24. Your funnel is tighter than most of what gets pasted into a roast box. Turn the last misses into tickets and go worry about something that deserves it, like your pricing page.",
  },
  {
    min: 0.7,
    title: "Solid, with leaks",
    body: "The obvious stuff is handled. What remains is the quiet kind of friction users never report: they retry once, sigh, and churn three weeks later. Every unchecked box above is already a ticket. Write it down while you can still see it.",
  },
  {
    min: 0.5,
    title: "Your users are working harder than your product",
    body: "Around half of these checks fail, which means your users are compensating for the product instead of the other way around. The good news: most of these fixes are about an hour each. Start with the signup group; nothing downstream matters if people never get in.",
  },
  {
    min: 0,
    title: "Stop adding features",
    body: "More than half the basics are missing, and no roadmap item pays off like fixing that. Freeze the feature branch for a week, work down this list from the top, and re-score. The product you already built deserves to be usable.",
  },
];

const CHECKLIST_MD = `# Founder UX audit checklist · 24 checks, 3 flows

## Signup
- [ ] 5 fields or fewer, each one defensible out loud (Nielsen #8)
- [ ] Password rules visible before the first failure (Nielsen #5)
- [ ] Show-password toggle exists, paste is allowed (WCAG 3.3.8)
- [ ] Fields validate on leaving them, not only on submit (Nielsen #1)
- [ ] Errors name the field and the fix, never "invalid input" (Nielsen #9)
- [ ] Nothing asked twice, including "confirm password" (WCAG 3.3.7)
- [ ] Product value visible before the account wall (Nielsen #3)
- [ ] Visible labels that stay put, not placeholder-only (WCAG 3.3.2)

## First session
- [ ] One obvious next step on the first screen (Hick's Law)
- [ ] Empty states say what goes here + hold the create button (Nielsen #6)
- [ ] Multi-step setup shows step X of Y (Nielsen #1)
- [ ] Onboarding skippable and findable again later (Nielsen #3)
- [ ] Customer words, not schema words (Nielsen #2)
- [ ] First task starts from a template or sample data (Nielsen #7)
- [ ] Anything over 1 second shows progress (Nielsen #1)
- [ ] Help in the same place on every screen (WCAG 3.2.6)

## Core flow + safety nets
- [ ] Destructive actions have undo, or confirm + recovery (Nielsen #3)
- [ ] Password reset tested this month, email under 1 min (Nielsen #9)
- [ ] Failed saves never discard the user's input (Nielsen #9)
- [ ] Text and primary buttons pass 4.5:1 contrast (WCAG 1.4.3)
- [ ] Mobile tap targets at least 24x24 px (WCAG 2.5.8)
- [ ] Tab through the flow with focus always visible (WCAG 2.4.7)
- [ ] Same action, same name, everywhere (Nielsen #4)
- [ ] Core action is the biggest, nearest target (Fitts's Law)`;

export default function Body() {
  return (
    <>
      <p>
        A founder UX audit is a self-run check of your product&rsquo;s 3 money
        flows (signup, first session, core loop) against named usability
        rules. You get 24 yes/no checks below, each tagged with the Nielsen
        heuristic, WCAG criterion, or Law of UX it enforces. No designer, no
        $10k engagement, no 40-slide deck. One afternoon.
      </p>

      <ShortVersion>
        <li>
          Audit 3 flows only: signup, first session, core loop. Pre-PMF, every
          user passes through all 3; almost nobody is in your settings
          page.
        </li>
        <li>
          24 checks, each answerable yes or no in 2 minutes by looking at your
          own product. Each one cites the rule it enforces.
        </li>
        <li>
          The stakes: 3 in 4 signups never reach value at the typical product,
          and a day-7 return rate of 7% already puts you in the top quartile.
        </li>
        <li>
          Score yourself in the interactive checklist below, or copy the
          markdown version straight into Notion.
        </li>
        <li>
          Budget an afternoon: about 1 hour per flow, plus 1 hour turning
          failures into tickets.
        </li>
      </ShortVersion>

      <h2>Why you only audit 3 flows</h2>
      <p>
        Because before product-market fit, every single user passes through
        signup, the first session, and the core loop, and almost nobody goes
        anywhere else. A bug on your settings page hurts the handful of users
        who find it. A bug in signup hurts 100% of everyone you will ever
        acquire.
        Same fix effort, wildly different payoff.
      </p>
      <p>
        The activation numbers say this is where products actually die.{" "}
        <a
          href="https://www.lennysnewsletter.com/p/what-is-a-good-activation-rate"
          target="_blank"
          rel="noopener noreferrer"
        >
          Lenny Rachitsky and Yuriy Timen&rsquo;s survey of 500+ products
        </a>{" "}
        put median activation barely above 1 in 4 signups. The other 3 never
        reach value, and that loss happens inside exactly the flows this
        checklist covers. The full numbers, caveats included, are in{" "}
        <Link href="/blog/why-users-abandon-signup">
          why users abandon your signup flow
        </Link>
        .
      </p>
      <PullStat num="7%">
        A day-7 return rate of just 7% of new users puts a product in the top
        25% of{" "}
        <a
          href="https://amplitude.com/resources/product-benchmark-report"
          target="_blank"
          rel="noopener noreferrer"
        >
          Amplitude&rsquo;s 2,600-company benchmark
        </a>
        . The bar is on the floor. Most products trip over it anyway.
      </PullStat>
      <p>
        Fixing this early compounds: in the same Amplitude data, 69% of
        products in the top quartile at day 7 were still top performers at
        3 months. A whole-product audit, meanwhile, hands you a 60-item
        list where item 41 is a footer link color. At your stage that is
        noise wearing a high-visibility vest. Scope ruthlessly: 3 flows, 24
        checks. (Signup deserves its own teardown, and it has one:{" "}
        <Link href="/blog/why-users-abandon-signup">
          why users abandon signup
        </Link>
        .)
      </p>

      <h2>How to run the audit</h2>
      <p>
        Fresh browser, real phone, screen recorder on, one flow at a time: the
        setup takes 10 minutes and the walk takes an afternoon. The order
        matters less than the discipline.
      </p>
      <ol>
        <li>
          <strong>Get the cleanest eyes you can.</strong> New browser profile
          or incognito, logged out, autofill off. Your cookies have been
          hiding your own signup from you for months.
        </li>
        <li>
          <strong>Repeat on a real phone.</strong> Devtools emulation lies
          about thumbs. Your actual phone will find the 18px close button
          that your mouse never noticed.
        </li>
        <li>
          <strong>Record both passes.</strong> Loom, QuickTime, whatever.
          Timestamps beat memory, and clips become ticket evidence later.
        </li>
        <li>
          <strong>Walk in with a job, not a wander.</strong> &ldquo;I run a
          3-person agency and I need to send one invoice before lunch.&rdquo;
          Type realistic data. Make deliberate mistakes: wrong password twice,
          back button mid-flow, double-click on submit.
        </li>
        <li>
          <strong>Log findings as one-liners while you walk.</strong> Where,
          what happened, gut severity. Do not stop to fix anything; the audit
          dies the first time you open your editor.
        </li>
      </ol>
      <p>
        Then sit down with the checklist below and answer all 24 honestly.
        House rule: if you have to think about a check for more than 2
        minutes, the answer is no.
      </p>

      <h2>The 24-point founder UX audit checklist</h2>
      <p>
        24 checks across signup, first session, and core flow: each one is
        falsifiable, answerable in about 2 minutes, and tagged with the rule
        it enforces. The tags come from{" "}
        <a
          href="https://www.nngroup.com/articles/ten-usability-heuristics/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nielsen&rsquo;s 10 usability heuristics
        </a>
        ,{" "}
        <a
          href="https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/"
          target="_blank"
          rel="noopener noreferrer"
        >
          WCAG 2.2
        </a>{" "}
        (which added 9 criteria in October 2023, several tailor-made for
        exactly these flows), and{" "}
        <a
          href="https://lawsofux.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Laws of UX
        </a>
        . If you want to see the full heuristic method run end to end first,
        we did it on{" "}
        <Link href="/blog/heuristic-evaluation-example">
          a fictional app that violates all 10
        </Link>
        .
      </p>

      <ScoredChecklist groups={GROUPS} tiers={TIERS} />

      <h3>The receipts behind the checks</h3>
      <p>
        These are not vibes; the checks with measurable stakes have published
        numbers behind them:
      </p>
      <ul>
        <li>
          <strong>Field count.</strong>{" "}
          <a
            href="https://baymard.com/blog/checkout-flow-average-form-fields"
            target="_blank"
            rel="noopener noreferrer"
          >
            Baymard&rsquo;s checkout benchmark
          </a>{" "}
          puts the average flow at 11.3 form fields when most sites need only
          8. Your signup deserves the same scrutiny: every field is a place
          to lose someone.
        </li>
        <li>
          <strong>Forced account creation.</strong> In{" "}
          <a
            href="https://baymard.com/lists/cart-abandonment-rate"
            target="_blank"
            rel="noopener noreferrer"
          >
            Baymard&rsquo;s abandonment survey
          </a>{" "}
          (updated September 2025), 19% of US shoppers who abandoned a
          checkout cited &ldquo;the site wanted me to create an account&rdquo;
          as a reason.
        </li>
        <li>
          <strong>Inline validation.</strong>{" "}
          <a
            href="https://alistapart.com/article/inline-validation-in-web-forms/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Luke Wroblewski&rsquo;s study with Etre
          </a>{" "}
          measured a 22% higher success rate, 22% fewer errors, and 42%
          faster completion with inline validation versus validate-on-submit.
          Small eye-tracking study, so treat the exact numbers gently, and
          note its own caveat: validate when the user leaves a field, not on
          every keystroke.
        </li>
        <li>
          <strong>Contrast.</strong>{" "}
          <a
            href="https://webaim.org/projects/million/"
            target="_blank"
            rel="noopener noreferrer"
          >
            WebAIM&rsquo;s 2026 scan of 1 million home pages
          </a>{" "}
          keeps finding low-contrast text as the web&rsquo;s single most
          common accessibility failure. Assume you have it until a checker
          says otherwise.
        </li>
      </ul>

      <Roast>
        Your password reset is a safety net you have never once jumped into.
        You are trusting your churn rate to a transactional email you last
        thought about at setup.
      </Roast>
      <Receipt rule="Nielsen #9 · Recover from errors">
        In{" "}
        <a
          href="https://baymard.com/blog/password-requirements-and-password-reset"
          target="_blank"
          rel="noopener noreferrer"
        >
          Baymard&rsquo;s testing
        </a>
        , hitting a password reset mid-checkout cost nearly 1 in 5 orders,
        with reset emails delayed or in spam even at Amazon and ASOS (the
        exact numbers are in{" "}
        <Link href="/blog/why-users-abandon-signup">the signup teardown</Link>
        ). That is why check 18 exists. Running it takes 4 minutes: incognito
        window, &ldquo;Forgot password&rdquo;, start a timer, open the email
        on your phone, click the link. If any step makes you wince, that
        wince is a ticket.
      </Receipt>

      <h3>Take it with you</h3>
      <p>
        Prefer to score in your own tool? Here is the terse version for
        Notion, Linear, or a plain text file.
      </p>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          overflow: "hidden",
          margin: "20px 0 28px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "10px 14px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.04em",
              color: "var(--text-muted)",
            }}
          >
            founder-ux-audit.md
          </span>
          <CopyButton text={CHECKLIST_MD} label="Copy markdown" />
        </div>
        <pre
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            lineHeight: 1.55,
            whiteSpace: "pre-wrap",
            padding: "16px 18px",
            margin: 0,
            color: "var(--text)",
          }}
        >
          {CHECKLIST_MD}
        </pre>
      </div>

      <h2>How to score what you found</h2>
      <p>
        Every failed check becomes a finding with one of 3 severities:
        Blocker (users fail or lose work), Major (users struggle, some give
        up), or Minor (friction and irritation). This maps onto{" "}
        <a
          href="https://www.nngroup.com/articles/how-to-rate-the-severity-of-usability-problems/"
          target="_blank"
          rel="noopener noreferrer"
        >
          NN/g&rsquo;s 0 to 4 severity scale
        </a>
        , which weighs 3 factors: how often the problem occurs, how hard
        it is to overcome, and whether it bites once or every time. Fix
        Blockers this week, Majors this sprint, and Minors when you are
        already touching that screen.
      </p>
      <p>
        Write each finding so it can go straight into the backlog. Like this:
      </p>
      <Ticket
        id="AUD-18"
        sev="Major"
        title="Password reset email takes 4 minutes and lands in spam"
        fields={[
          {
            label: "Evidence",
            value:
              "Ran check 18 in a fresh incognito session: reset requested at 00:00, email arrived at 03:41, in the spam folder. Recording attached.",
          },
          { label: "Rule", value: "Nielsen #9 · Recover from errors" },
          {
            label: "Fix",
            value:
              "Send resets from the primary domain with SPF/DKIM aligned; after 30 seconds, show a check-your-spam note and a resend button.",
          },
          { label: "Effort", value: "⚡ Quick win · ~1 hr" },
        ]}
      />
      <p>
        The full format, including steps to reproduce and why devs reject
        tickets without them, is in{" "}
        <Link href="/blog/ux-findings-to-jira-tickets">
          how to turn UX findings into tickets devs actually fix
        </Link>
        .
      </p>

      <h2>What this checklist cannot catch</h2>
      <p>
        It cannot catch the problems you have gone blind to: a checklist
        verifies rules, and you will pass yourself on anything ambiguous. You
        built this product. You know which icon opens the exporter and what
        &ldquo;workspace&rdquo; means here, so you physically cannot
        experience the confusion of someone who does not. Blindness from
        familiarity, not incompetence, and no amount of honest box-ticking
        cures it.
      </p>
      <p>
        A checklist also only sees violations, never comprehension. Your
        signup can pass all 8 checks while the headline above it convinces
        people they are in the wrong place. Catching that takes eyes that
        have never seen the product: 5 real users on a call, or an agent that
        walks in cold. We compared the options in{" "}
        <Link href="/blog/ai-agents-vs-synthetic-users-vs-real-users">
          AI agents vs synthetic users vs real users
        </Link>
        . If you want the agent version, <Link href="/">ClapBack</Link> runs
        exactly this kind of pass from a URL: it signs up, breaks your flows,
        and returns findings as tickets with a severity and a cited rule, in
        minutes instead of an afternoon.
      </p>
      <p>
        Either way, run the afternoon audit first. It is free, it clears the
        embarrassing stuff, and it makes whatever fresh eyes you bring in
        later spend their time on problems only fresh eyes can find.
      </p>

      <Sources
        items={[
          {
            label:
              "Lenny's Newsletter · What is a good activation rate? (500+ product survey, 2022)",
            href: "https://www.lennysnewsletter.com/p/what-is-a-good-activation-rate",
          },
          {
            label: "Amplitude · The 7% rule (Product Benchmark Report)",
            href: "https://amplitude.com/resources/product-benchmark-report",
          },
          {
            label: "Baymard · Checkout flows average 11.3 form fields",
            href: "https://baymard.com/blog/checkout-flow-average-form-fields",
          },
          {
            label: "Baymard · Cart abandonment rate and reasons",
            href: "https://baymard.com/lists/cart-abandonment-rate",
          },
          {
            label: "Baymard · Password requirements and password reset",
            href: "https://baymard.com/blog/password-requirements-and-password-reset",
          },
          {
            label: "A List Apart · Inline validation in web forms (Wroblewski/Etre)",
            href: "https://alistapart.com/article/inline-validation-in-web-forms/",
          },
          {
            label: "WebAIM · The WebAIM Million, 2026 edition",
            href: "https://webaim.org/projects/million/",
          },
          {
            label: "W3C WAI · What's new in WCAG 2.2",
            href: "https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/",
          },
          {
            label: "NN/g · 10 usability heuristics for user interface design",
            href: "https://www.nngroup.com/articles/ten-usability-heuristics/",
          },
          {
            label: "NN/g · How to rate the severity of usability problems",
            href: "https://www.nngroup.com/articles/how-to-rate-the-severity-of-usability-problems/",
          },
          {
            label: "Laws of UX · Hick's Law and Fitts's Law",
            href: "https://lawsofux.com/",
          },
        ]}
      />
    </>
  );
}
