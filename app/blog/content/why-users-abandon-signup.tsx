import Link from "next/link";
import {
  ShortVersion,
  Roast,
  Receipt,
  PullStat,
  Ticket,
  Sources,
} from "../../components/blog/Widgets";
import FrictionLedger from "./why-users-abandon-signup.client";

export default function Body() {
  return (
    <>
      <p>
        Users abandon signup when the form demands more than your product has
        yet earned: too many fields, opaque password rules, verification walls
        before value. Most of the hard evidence below comes from checkout
        research, chiefly Baymard Institute&rsquo;s, because nobody has studied
        SaaS signup friction with the same rigor. Checkout is the closest
        measured proxy, and we&rsquo;ll say so each time instead of passing its
        numbers off as signup benchmarks.
      </p>

      <p>
        For the scale of the problem: Baymard&rsquo;s running average across{" "}
        <a
          href="https://baymard.com/lists/cart-abandonment-rate"
          target="_blank"
          rel="noopener noreferrer"
        >
          50 abandonment studies
        </a>{" "}
        is 70.22%. Seven in ten people who started, gone. Your signup faces the
        same physics: low commitment, a tab bar full of alternatives, and every
        extra question a fresh exit. This teardown walks the 5 steps of the
        standard SaaS signup gauntlet: at each one, what products get wrong,
        the receipt, and the ticket-shaped fix.
      </p>

      <ShortVersion>
        <li>
          The famous &ldquo;24 to 26% abandon because of forced account
          creation&rdquo; stat is stale. Baymard&rsquo;s current published
          figure is 19% (page updated September 2025).
        </li>
        <li>
          The average checkout runs 11.3 form fields. Baymard finds most sites
          need only about 8.
        </li>
        <li>
          In Baymard&rsquo;s testing, 18.75% of users abandoned after a
          forgotten password pushed them into a reset flow. Complex password
          rules cost up to ~19% of returning users.
        </li>
        <li>
          Inline validation improved form success 22% and cut completion time
          42% in Wroblewski&rsquo;s 2009 study (small sample, and we say so).
        </li>
        <li>
          No rigorous study quantifies email-verification drop-off. Anyone
          quoting a percentage for it is quoting a vendor.
        </li>
      </ShortVersion>

      <h2>The abandonment number everyone gets wrong</h2>
      <p>
        The most repeated stat about forced account creation, that 24 to 26% of
        users abandon because of it, comes from Baymard&rsquo;s older survey
        rounds and is no longer the published figure. Baymard&rsquo;s{" "}
        <a
          href="https://baymard.com/lists/cart-abandonment-rate"
          target="_blank"
          rel="noopener noreferrer"
        >
          cart abandonment page
        </a>
        , updated September 22, 2025, now reports that <strong>19%</strong> of
        US shoppers who abandoned a checkout cite &ldquo;the site wanted me to
        create an account&rdquo; as a reason. Self-reported, multi-select, and
        the base excludes people who were just browsing.
      </p>
      <Roast>
        Every post that quotes 26% copied a blog that copied a blog. Nobody
        clicked through to the source, which updated years ago.
      </Roast>
      <Receipt rule="Baymard · checkout survey, updated Sept 2025">
        The 24% figure is from Baymard&rsquo;s 2021 to 2022 survey wave, and a
        later round said 26%. The current figure on Baymard&rsquo;s own page
        is 19%. Still roughly 1 in 5 abandoners naming your account wall as a
        reason they walked, so the correction weakens nothing. It just makes
        you the only person in the meeting citing a live number.
      </Receipt>
      <p>
        That habit of tracing numbers back to primary sources is a whole
        discipline. We did it for the other famous UX stats in{" "}
        <Link href="/blog/ux-statistics-sources">
          where the famous UX numbers actually come from
        </Link>
        . Now, the gauntlet itself.
      </p>

      <h2>Step 1: the form asks for more than it needs</h2>
      <p>
        The first screen of a typical B2B signup wants first name, last name,
        work email, phone, company, company size, and a password. Baymard&rsquo;s{" "}
        <a
          href="https://baymard.com/blog/checkout-flow-average-form-fields"
          target="_blank"
          rel="noopener noreferrer"
        >
          2024 field benchmark
        </a>{" "}
        found the average checkout contains 11.3 form fields across 5.1 steps,
        while most sites need only about 8. Their sharper finding: field count
        hurts usability far more than step count does.
      </p>
      <p>
        The micro-failures are measured too: when name is split into 2 fields,
        42% of users type their full name into the first one. One honest
        caveat: the field-count relationship is not linear, and{" "}
        <a
          href="https://cxl.com/blog/reduce-form-fields/"
          target="_blank"
          rel="noopener noreferrer"
        >
          CXL&rsquo;s review
        </a>{" "}
        of A/B data shows motivated users tolerate long forms. So the rule is
        not &ldquo;fewer at any cost.&rdquo; It is: nothing the first session
        doesn&rsquo;t need.
      </p>
      <p>
        And whatever fields survive should validate inline. Luke
        Wroblewski&rsquo;s{" "}
        <a
          href="https://alistapart.com/article/inline-validation-in-web-forms/"
          target="_blank"
          rel="noopener noreferrer"
        >
          2009 study with Etre
        </a>{" "}
        measured inline validation against after-submit validation: +22%
        success, 22% fewer errors, +31% satisfaction, 42% faster completion.
        Small eye-tracking sample, not an academic trial, but nobody has
        published better since. One nuance from the same study: validate when
        the user leaves the field, not per keystroke, because mid-word red
        text reads as being yelled at.
      </p>
      <Ticket
        id="SIGNUP-1"
        sev="Major"
        title="Signup asks 7 questions before showing the product"
        fields={[
          {
            label: "Evidence",
            value:
              "Split name fields (42% of users type their full name into the first one, per Baymard), plus phone, company, and company size, all before first value. Errors appear only on submit.",
          },
          {
            label: "Rule",
            value: "Baymard 2024 benchmark · 11.3 fields where ~8 do the job",
          },
          {
            label: "Fix",
            value:
              "Email, password, one button. Infer company from the email domain, ask the rest after first value, and validate inline on blur.",
          },
          { label: "Effort", value: "⚡ Quick win · ~1 hr" },
        ]}
      />

      <h2>Step 2: password rules revealed one failure at a time</h2>
      <p>
        The user types a password, submits, and only then learns about the
        uppercase rule. Submits again, meets the symbol rule. This is the step
        where products convert a committed user into a former one, and it is
        one of the best-measured frictions in the pack.
      </p>
      <PullStat num="18.75%">
        of users in{" "}
        <a
          href="https://baymard.com/blog/password-requirements-and-password-reset"
          target="_blank"
          rel="noopener noreferrer"
        >
          Baymard&rsquo;s checkout testing
        </a>{" "}
        abandoned their purchase entirely after a forgotten password forced
        them into a password-reset flow. Reset emails arrived late, landed in
        spam, or never came. Observed even at Amazon and ASOS.
      </PullStat>
      <p>
        The same Baymard research puts abandonment from complex
        password-creation rules at up to roughly 19% of returning users, and
        their guidance is blunt: any requirement beyond a 6 to 8 character
        minimum will cost you completions. Every symbol rule you add today is
        a reset flow you force next month.
      </p>
      <Roast>
        Your password policy is not securing accounts. It is training users to
        pick <code>Password1!</code> and to remember you as the product that
        made them feel stupid.
      </Roast>
      <Receipt rule="WCAG 3.3.8 · Accessible authentication (AA)">
        WCAG 2.2 made this a compliance line, not a taste question: no
        recall-and-transcribe hurdles, and paste must work. NN/g adds the
        disclosure rule (show constraints before the first attempt, not as
        error messages) and has argued since{" "}
        <a
          href="https://www.nngroup.com/articles/stop-password-masking/"
          target="_blank"
          rel="noopener noreferrer"
        >
          2009
        </a>{" "}
        that masking with no reveal option hurts usability: &ldquo;the only
        feedback they get is a row of bullets.&rdquo; Mask by default, add a
        show-password toggle. ⚡ Quick win · ~1 hr.
      </Receipt>

      <h2>Step 3: the email verification wall</h2>
      <p>
        The user gave you an email and a password, and instead of the product
        they get &ldquo;check your inbox.&rdquo; Here is the honest version of
        this section: no rigorous public study quantifies how many users die
        at this wall. The 10 to 40% figures floating around come from
        email-verification vendors, who are selling the fix.
      </p>
      <p>
        What is measured is the failure mode. The reset-email number above is
        Baymard documenting what happens when a flow stalls until an email
        arrives: delays, spam folders, the wrong inbox, a typo nobody caught
        (which is why Baymard suggests{" "}
        <a
          href="https://baymard.com/blog/confirm-email-not-password"
          target="_blank"
          rel="noopener noreferrer"
        >
          confirming the email, not the password
        </a>
        ). A verification wall inherits every one of those risks, at the exact
        moment NN/g&rsquo;s{" "}
        <a
          href="https://www.nngroup.com/articles/login-walls/"
          target="_blank"
          rel="noopener noreferrer"
        >
          login-wall research
        </a>{" "}
        says users are most defensive: before you have shown them anything.
      </p>
      <Ticket
        id="SIGNUP-3"
        sev="Blocker"
        title="Email verification blocks first value"
        fields={[
          {
            label: "Evidence",
            value:
              "New users hit a dead-end screen until an email arrives. Baymard measured nearly 1 in 5 users abandoning flows stalled by a reset email; a verification wall shares the same failure modes.",
          },
          {
            label: "Rule",
            value: "NN/g · Login walls stop users in their tracks",
          },
          {
            label: "Fix",
            value:
              "Let users straight into the product. Verify in the background with a dismissible banner, and gate only the actions that genuinely need a proven address (invites, billing, export).",
          },
          { label: "Effort", value: "⚒ Deep fix · ~2 days" },
        ]}
      />

      <h2>Step 4: the qualification quiz</h2>
      <p>
        The survivors now meet the survey: role, team size, use case, how did
        you hear about us, and a phone field for the sales team. Old but still
        directionally useful data from{" "}
        <a
          href="https://blog.hubspot.com/blog/tabid/6307/bid/6746/which-types-of-form-fields-lower-landing-page-conversions.aspx"
          target="_blank"
          rel="noopener noreferrer"
        >
          HubSpot&rsquo;s analysis of 40,000+ landing pages
        </a>{" "}
        (Dan Zarrella, circa 2010) found that which fields you ask matters more
        than how many: age, phone, and location questions measurably lowered
        conversion, with phone among the worst.
      </p>
      <Roast>
        You met this user 40 seconds ago and you are already asking for their
        phone number. In any other context that gets you escorted out.
      </Roast>
      <Receipt rule="WCAG 3.3.7 · Redundant entry (A)">
        The quiz usually re-asks what the form already knows: company name
        when you have the work email domain, name fields collected twice.
        Since October 2023,{" "}
        <a
          href="https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/"
          target="_blank"
          rel="noopener noreferrer"
        >
          WCAG 2.2
        </a>{" "}
        makes asking for the same information twice in a session a Level A
        failure. Auto-populate it or make it selectable. Every quiz question
        should either change the user&rsquo;s first screen or be deleted. ⚡
        Quick win · ~1 hr.
      </Receipt>

      <h2>Step 5: the empty first screen</h2>
      <p>
        The user survives all 4 steps and lands on a blank dashboard with a
        mute &ldquo;Create your first project&rdquo; button. This is where the
        win evaporates. In{" "}
        <a
          href="https://www.lennysnewsletter.com/p/what-is-a-good-activation-rate"
          target="_blank"
          rel="noopener noreferrer"
        >
          Lenny Rachitsky and Yuriy Timen&rsquo;s 2022 survey
        </a>{" "}
        of 500+ products, average activation was 34% and the median 25%.
        Self-reported, and every company defines activation its own way, but
        the shape is damning: most people who finish signup never reach value.
      </p>
      <p>
        The empty state deserves its own audit (our fictional Driftly opens
        with &ldquo;instantiate a workstream artifact,&rdquo; dissected in{" "}
        <Link href="/blog/heuristic-evaluation-example">
          the full heuristic evaluation walkthrough
        </Link>
        ). The short rule: the first screen should already contain something,
        a template, sample data, one obvious action. A gauntlet that ends in
        an empty room retroactively makes every question you asked feel like a
        scam.
      </p>
      <Ticket
        id="SIGNUP-5"
        sev="Major"
        title="First screen after signup is empty"
        fields={[
          {
            label: "Evidence",
            value:
              "New users land on a blank dashboard. Benchmark context: 34% average / 25% median activation across a 500+ product survey (Lenny's Newsletter, 2022).",
          },
          {
            label: "Rule",
            value: "Nielsen #6 · Recognition rather than recall",
          },
          {
            label: "Fix",
            value:
              "Land users inside a pre-built template or sample data with one highlighted next action. Use the qualification answers from step 4 to pick the template, or stop asking.",
          },
          { label: "Effort", value: "⚒ Deep fix · ~2 days" },
        ]}
      />

      <h2>Score your own gauntlet</h2>
      <p>
        The usual interactive widget here would multiply survey percentages
        from unrelated studies and hand you a fake &ldquo;you are losing 43%
        of signups&rdquo; number. We are not doing that, because stacking a
        2025 checkout survey on a 2009 eye-tracking study is astrology with
        extra decimals. Instead: toggle the frictions your signup actually
        has, and each one shows its real evidence, including the honest tag
        &ldquo;magnitude unmeasured&rdquo; where that is the truth.
      </p>
      <FrictionLedger />
      <p>
        Whatever you toggled, the output you want is not a score, it is
        tickets: severity, evidence, fix, effort, like the 3 above. The format
        is in{" "}
        <Link href="/blog/ux-findings-to-jira-tickets">
          how to turn UX findings into tickets devs actually fix
        </Link>
        , and the wider sweep beyond signup is{" "}
        <Link href="/blog/founder-ux-audit-checklist">
          the founder&rsquo;s UX audit checklist
        </Link>
        .
      </p>
      <p>
        One more honest note: you cannot grade your own gauntlet from memory,
        because you have not experienced it since you built it. An agent that
        actually attempts your signup catches these because it hits them: the
        wall, the reset email, the empty room. That is what{" "}
        <Link href="/">ClapBack</Link> does with nothing but your URL.
      </p>

      <Sources
        items={[
          {
            label:
              "Baymard Institute · Cart abandonment rate statistics (updated Sept 2025)",
            href: "https://baymard.com/lists/cart-abandonment-rate",
          },
          {
            label: "Baymard Institute · Checkout flow average form fields (2024)",
            href: "https://baymard.com/blog/checkout-flow-average-form-fields",
          },
          {
            label:
              "Baymard Institute · Password requirements and password reset",
            href: "https://baymard.com/blog/password-requirements-and-password-reset",
          },
          {
            label: "Baymard Institute · Confirm email, not password",
            href: "https://baymard.com/blog/confirm-email-not-password",
          },
          {
            label:
              "A List Apart · Inline Validation in Web Forms (Wroblewski, 2009)",
            href: "https://alistapart.com/article/inline-validation-in-web-forms/",
          },
          {
            label: "NN/g · Stop Password Masking (Nielsen, 2009)",
            href: "https://www.nngroup.com/articles/stop-password-masking/",
          },
          {
            label: "NN/g · Login Walls Stop Users in Their Tracks",
            href: "https://www.nngroup.com/articles/login-walls/",
          },
          {
            label: "W3C WAI · What's New in WCAG 2.2",
            href: "https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/",
          },
          {
            label: "CXL · Should You Really Reduce Form Fields?",
            href: "https://cxl.com/blog/reduce-form-fields/",
          },
          {
            label:
              "HubSpot · Which Form Fields Lower Landing Page Conversions (Zarrella)",
            href: "https://blog.hubspot.com/blog/tabid/6307/bid/6746/which-types-of-form-fields-lower-landing-page-conversions.aspx",
          },
          {
            label:
              "Lenny's Newsletter · What is a good activation rate? (2022)",
            href: "https://www.lennysnewsletter.com/p/what-is-a-good-activation-rate",
          },
        ]}
      />
    </>
  );
}
