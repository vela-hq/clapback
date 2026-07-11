import Link from "next/link";
import {
  ShortVersion,
  Roast,
  Receipt,
  PullStat,
  Ticket,
  TableWrap,
  Sources,
} from "../../components/blog/Widgets";
import CopyButton from "../../components/blog/CopyButton";

const JIRA_TEMPLATE = `*Title:* <the broken behavior, not the emotion: "X happens when Y">
*Severity:* Major  (Blocker = users fail or lose work · Major = users struggle · Minor = friction)
*Where:* <URL or screen name>

*Steps to reproduce:*
# Go to <URL>
# <action>
# <action>

*What happens:* <actual behavior>
*What should happen:* <expected behavior>

*Rule violated:* <e.g. Nielsen #9 · Recover from errors, or WCAG 2.5.8 Target Size>
*Suggested fix:* <one concrete change>
*Effort:* Quick win · ~1 hr  (or: Deep fix · ~2 days)

*Screenshot:* <attach, with the failing element circled>
*Labels:* ux-debt, <rule tag, e.g. nielsen-9>`;

const LINEAR_TEMPLATE = `<!-- Title goes in the issue title field: state the broken behavior -->

**Severity:** Major  <!-- Blocker / Major / Minor -->
**Where:** <URL or screen name>

**Steps to reproduce**
1. Go to <URL>
2. <action>
3. <action>

**What happens:** <actual behavior>
**What should happen:** <expected behavior>

**Rule violated:** <e.g. Nielsen #9 · Recover from errors>
**Suggested fix:** <one concrete change>
**Effort:** Quick win · ~1 hr

**Screenshot:** <attach, with the failing element circled>
**Labels:** ux-debt, nielsen-9`;

function TemplateBlock({ name, text }: { name: string; text: string }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        margin: "26px 0",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          padding: "10px 14px",
          background: "var(--surface-soft)",
          borderBottom: "1px solid var(--border-soft)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11.5,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          {name}
        </span>
        <CopyButton text={text} />
      </div>
      <pre
        style={{
          margin: 0,
          padding: "16px 18px",
          overflowX: "auto",
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          lineHeight: 1.6,
          color: "var(--text)",
        }}
      >
        {text}
      </pre>
    </div>
  );
}

export default function Body() {
  return (
    <>
      <p>
        UX findings ship when they arrive shaped like work: a title naming the
        broken behavior, an agreed severity, reproduction steps, a cited rule,
        a suggested fix, and an effort estimate. Everything else dies where UX
        feedback usually dies: page 14 of a doc nobody opens after the readout
        meeting.
      </p>
      <p>
        This is the exact anatomy of a UX ticket an engineer accepts without
        calling a meeting, with the research on why each field earns its place
        and two copy-paste templates at the end.
      </p>

      <ShortVersion>
        <li>
          In a survey of 466 developers and reporters, steps to reproduce
          ranked as the most helpful content in a bug report, and among the
          hardest to get from reporters (Bettenburg et al., FSE 2008).
        </li>
        <li>
          A ticket that survives triage has 5 parts: a behavior-naming title,
          an agreed severity, evidence (steps + screenshot + named rule), a
          concrete suggested fix, and an effort estimate.
        </li>
        <li>
          Severity is not priority. Severity measures user harm (NN/g rates it
          0 to 4 from frequency, impact, and persistence); priority layers
          business context on top.
        </li>
        <li>
          A 3-flow audit typically lands 10 to 25 findings. File Blockers
          individually; batch Minors into one ticket per screen.
        </li>
        <li>
          Label everything <code>ux-debt</code> plus a rule tag, so your UX
          debt is a query instead of a memory.
        </li>
      </ShortVersion>

      <h2>The same finding, filed twice</h2>
      <p>
        A worked example, fictional but painfully familiar. Your signup form
        rejects passwords against rules it never shows, throws a generic
        error, and wipes both password fields. Someone on the team noticed.
        Here is how that finding usually lands in Jira:
      </p>

      <div
        style={{
          background: "var(--surface)",
          border: "1px dashed var(--border)",
          borderRadius: 12,
          padding: "18px 22px",
          margin: "26px 0",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11.5,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-faint)",
            marginBottom: 10,
          }}
        >
          The ticket that bounces
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 16.5,
            fontWeight: 600,
            color: "var(--ink)",
          }}
        >
          Signup form is confusing and frustrating!! Fix ASAP
        </p>
        <p
          style={{
            margin: "10px 0 0",
            fontSize: 15.5,
            lineHeight: 1.6,
            color: "var(--text-muted)",
          }}
        >
          &ldquo;Tried signing up and honestly the whole flow feels off. The
          password part didn&rsquo;t work for me and I got some error, which is
          super annoying, a real user would just leave. Can we make this
          nicer? Also the button looked weird on my laptop. High priority
          imo.&rdquo;
        </p>
      </div>

      <p>
        Now the same finding, shaped like work:
      </p>

      <Ticket
        id="UX-214"
        sev="Major"
        title="Signup rejects passwords against rules it never displays"
        fields={[
          {
            label: "Evidence",
            value:
              "1. Go to /signup. 2. Enter a valid email and the password “sunflower9”. 3. Submit. The form returns “Password invalid”, clears both password fields, and lists no requirements anywhere on the page. Screenshot attached with the error state circled.",
          },
          {
            label: "Rule",
            value: "Nielsen #9 · Recognize, diagnose, recover from errors",
          },
          {
            label: "Fix",
            value:
              "Show the password rules under the field before first input, validate on blur, and keep entered values when the form errors.",
          },
          { label: "Effort", value: "⚡ Quick win · ~1 hr" },
        ]}
      />

      <p>
        Same problem, same author, same afternoon. The first version gets a
        &ldquo;can you clarify?&rdquo; comment and dies. The second gets an
        estimate in standup and ships on Thursday. The difference is not
        writing talent: it is 5 fields, each of which exists to kill one
        specific reason engineers reject tickets.
      </p>

      <h2>Why each field kills a rejection reason</h2>
      <p>
        Ticket quality determining fix speed is measured, not folklore. In{" "}
        <a
          href="https://thomas-zimmermann.com/publications/files/bettenburg-fse-2008.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          &ldquo;What Makes a Good Bug Report?&rdquo;
        </a>{" "}
        (FSE 2008), Bettenburg and colleagues surveyed developers and
        reporters across Apache, Eclipse, and Mozilla. Developers ranked steps
        to reproduce, stack traces, and test cases as the most helpful things
        a report can contain. Those are exactly the items reporters find
        hardest to provide, a gap the paper calls an information mismatch.
      </p>

      <PullStat num="466">
        developers and reporters surveyed in{" "}
        <a
          href="https://thomas-zimmermann.com/publications/files/bettenburg-fse-2008.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Bettenburg et al.&rsquo;s FSE 2008 study
        </a>
        . The most-cited hurdles when fixing bugs: inaccurate steps to
        reproduce and incomplete information.
      </PullStat>

      <p>
        For UX findings there is rarely a stack trace, so the annotated
        screenshot does that job: it pins the exact element and state you are
        talking about. Map each field to the objection it removes:
      </p>
      <ul>
        <li>
          <strong>&ldquo;Can&rsquo;t reproduce&rdquo; → steps to
          reproduce.</strong> Numbered, starting from a URL, ending at the
          failure.{" "}
          <a
            href="https://marker.io/blog/how-to-write-bug-report"
            target="_blank"
            rel="noopener noreferrer"
          >
            Marker.io&rsquo;s guide
          </a>{" "}
          lists irreproducibility and missing environment as the classic
          bounce reasons, and the Bettenburg survey says steps are the single
          most valued content.
        </li>
        <li>
          <strong>&ldquo;Not a priority&rdquo; → severity with a shared
          definition.</strong> &ldquo;Major&rdquo; means nothing until the
          team has agreed what Major means. Definitions below.
        </li>
        <li>
          <strong>&ldquo;I don&rsquo;t think that&rsquo;s a problem&rdquo; →
          the named rule.</strong> &ldquo;Confusing&rdquo; is your opinion.
          &ldquo;Violates Nielsen #9, published 1994, cited in every HCI
          curriculum since&rdquo; is a checkable claim. The argument moves
          from taste to evidence.
        </li>
        <li>
          <strong>&ldquo;Too vague to estimate&rdquo; → suggested fix +
          effort.</strong> A concrete proposed change gives the engineer
          something to accept, amend, or beat. &ldquo;Quick win · ~1 hr&rdquo;
          lets a PM slot it into a sprint without a discovery meeting.
        </li>
      </ul>

      <Roast>
        A ticket titled &ldquo;signup is confusing&rdquo; is a diary entry.
        Engineers do not triage diary entries.
      </Roast>
      <Receipt rule="Bettenburg et al. · FSE 2008">
        Vague reports create the exact information mismatch the study
        documents: the reporter supplies feelings, the developer needs steps.
        Atlassian&rsquo;s own{" "}
        <a
          href="https://www.atlassian.com/software/jira/templates/bug-report"
          target="_blank"
          rel="noopener noreferrer"
        >
          bug report template guidance
        </a>{" "}
        makes the same point from the vendor side: templates &ldquo;act as a
        required checklist, making an incomplete report impossible.&rdquo;
      </Receipt>

      <h2>Severity vs priority: they are not synonyms</h2>
      <p>
        Severity measures how badly users are hurt; priority is a business
        decision about when to fix it. Severity feeds priority. It never
        replaces it.
      </p>
      <p>
        The canonical severity scale is{" "}
        <a
          href="https://www.nngroup.com/articles/how-to-rate-the-severity-of-usability-problems/"
          target="_blank"
          rel="noopener noreferrer"
        >
          NN/g&rsquo;s 0 to 4 rating
        </a>{" "}
        (Nielsen, 1994), which combines three factors: frequency (how often
        users hit it), impact (how hard it is to overcome), and persistence
        (one-time trap or every-visit tax). We collapse it into the three
        tiers a ticket queue understands, with a default queue behavior for
        each:
      </p>

      <TableWrap>
        <table>
          <thead>
            <tr>
              <th>NN/g rating</th>
              <th>Ticket severity</th>
              <th>What it means</th>
              <th>Default queue behavior</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>4 · Usability catastrophe</td>
              <td>Blocker</td>
              <td>Users fail the task or lose work</td>
              <td>P1, this sprint. Interrupt if it guards revenue.</td>
            </tr>
            <tr>
              <td>3 · Major usability problem</td>
              <td>Major</td>
              <td>Users struggle; some give up</td>
              <td>P2, next sprint, individually filed</td>
            </tr>
            <tr>
              <td>1 to 2 · Cosmetic to minor</td>
              <td>Minor</td>
              <td>Friction and irritation</td>
              <td>Backlog, batched into one ticket per screen</td>
            </tr>
            <tr>
              <td>0 · Not a problem</td>
              <td>None</td>
              <td>You disagree it is an issue</td>
              <td>Do not file it. Write down why, then move on.</td>
            </tr>
          </tbody>
        </table>
      </TableWrap>

      <p>
        The honest footnote: the right-hand column is a default, not a law.
        Priority layers business context onto severity. A Major on a settings
        page hardly anyone visits can wait behind a Minor sitting inside your
        checkout. What the severity field buys you is a shared starting point,
        so the priority debate is about business, not about whether the
        problem is real.
      </p>

      <h2>Copy-paste ticket templates for Jira and Linear</h2>
      <p>
        Two templates, same 10 fields, formatted for each tool. Linear&rsquo;s
        own method guide says to{" "}
        <a
          href="https://linear.app/method/write-issues-not-user-stories"
          target="_blank"
          rel="noopener noreferrer"
        >
          &ldquo;write short and simple issue titles that directly state what
          the task is&rdquo;
        </a>
        , which is the title rule from the anatomy above wearing a different
        badge: name the behavior, skip the emotion.
      </p>

      <TemplateBlock name="Jira · UX finding template" text={JIRA_TEMPLATE} />
      <TemplateBlock
        name="Linear · UX finding template"
        text={LINEAR_TEMPLATE}
      />

      <p>
        Delete any field you genuinely cannot fill rather than padding it. A
        short, complete ticket beats a long one with three fields of
        &ldquo;TBD&rdquo;. If you skip anything, never skip the steps: that is
        the field the research says developers miss most.
      </p>

      <h2>How many tickets should a UX audit produce?</h2>
      <p>
        A focused audit of 3 core flows typically lands 10 to 25 findings;
        file Blockers and Majors individually, and batch Minors into one
        ticket per screen. That range is a field observation from running
        audits, not a study, but it is stable: signup, onboarding, and the
        core loop reliably hide that much.
      </p>
      <p>
        The batching rule matters more than the count. Filing 25 individual
        tickets turns your backlog into confetti and guarantees the Minors get
        closed in
        a bulk &ldquo;won&rsquo;t fix&rdquo; sweep 6 months from now. File
        every Blocker alone, every Major alone, and roll the Minors up:
        &ldquo;Settings screen: 4 minor UX fixes&rdquo; with each finding as a
        checklist item. One estimate, one review, 4 fixes.
      </p>
      <p>
        If you want to generate the findings themselves, we walked the full
        method in{" "}
        <Link href="/blog/heuristic-evaluation-example">
          a complete heuristic evaluation example
        </Link>{" "}
        and condensed it into{" "}
        <Link href="/blog/founder-ux-audit-checklist">
          a founder&rsquo;s UX audit checklist
        </Link>{" "}
        you can run in an afternoon. And if you are weighing doing this
        yourself against paying someone,{" "}
        <Link href="/blog/ux-audit-cost">the real cost of a UX audit</Link>{" "}
        has the numbers.
      </p>

      <h2>Keeping UX debt visible after the audit</h2>
      <p>
        Label every finding <code>ux-debt</code> plus a tag for the rule it
        violates: <code>nielsen-9</code>, <code>wcag-2.5.8</code>,{" "}
        <code>hicks-law</code>. Two labels turn your UX debt from a vibe into
        a query. &ldquo;Show me open ux-debt&rdquo; becomes a saved filter you
        can pull up in sprint planning; &ldquo;we keep shipping nielsen-1
        violations&rdquo; becomes a pattern you can name in a retro. When
        someone asks how bad the UX debt is, the answer is a link, not a
        shrug.
      </p>
      <p>
        This anatomy is also, not coincidentally, the exact format{" "}
        <Link href="/">ClapBack</Link> outputs. An agent uses your product
        like a real user, and every finding arrives as a pre-filled Jira or
        Linear ticket: severity, the cited rule, an annotated screenshot, a
        plain-language reason it matters, and a suggested fix with an effort
        estimate. The template above is the manual version; the agent is the
        version where you paste a URL.
      </p>
      <p>
        Either way, the rule stands. A finding in a doc is an opinion with
        good intentions. A finding in a ticket, with steps, a severity your
        team defined, and a rule someone can look up, is work. Work gets
        shipped.
      </p>

      <Sources
        items={[
          {
            label:
              "Bettenburg et al. · What Makes a Good Bug Report? (FSE 2008)",
            href: "https://thomas-zimmermann.com/publications/files/bettenburg-fse-2008.pdf",
          },
          {
            label: "NN/g · How to Rate the Severity of Usability Problems (Nielsen, 1994)",
            href: "https://www.nngroup.com/articles/how-to-rate-the-severity-of-usability-problems/",
          },
          {
            label: "Atlassian · Jira bug report template guidance",
            href: "https://www.atlassian.com/software/jira/templates/bug-report",
          },
          {
            label: "Linear Method · Write issues, not user stories",
            href: "https://linear.app/method/write-issues-not-user-stories",
          },
          {
            label: "Marker.io · How to write a bug report",
            href: "https://marker.io/blog/how-to-write-bug-report",
          },
        ]}
      />
    </>
  );
}
