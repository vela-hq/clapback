import Link from "next/link";
import {
  ShortVersion,
  Roast,
  Receipt,
  Figure,
  Ticket,
  TableWrap,
  Sources,
} from "../../components/blog/Widgets";
import AnnotatedShot from "./heuristic-evaluation-example.client";
import {
  ShotImportStall,
  ShotJargon,
  ShotNoUndo,
  ShotInconsistent,
  ShotDateTrap,
  ShotIconMystery,
  ShotOneByOne,
  ShotBannerPile,
  ShotHexError,
  ShotPdfHelp,
} from "./heuristic-evaluation-example.shots";

export default function Body() {
  return (
    <>
      <p>
        A heuristic evaluation checks an interface against ten research-backed
        usability principles, scores each violation by severity, and outputs a
        ranked list of fixes. Most explanations stop at the definitions. This
        one runs the whole method, end to end, on an app that deserves it.
      </p>

      <ShortVersion>
        <li>
          Heuristic evaluation means auditing an interface against Nielsen
          Norman Group&rsquo;s 10 usability heuristics, published in 1994 and
          still the standard.
        </li>
        <li>
          Each finding gets a severity. We use Blocker / Major / Minor, mapped
          from NN/g&rsquo;s 0 to 4 scale.
        </li>
        <li>
          Driftly commits all 10 violations: 2 Blockers, 5 Majors, 3 Minors.
          The full report card is at the end.
        </li>
        <li>
          7 of the 10 fixes are quick wins, about an hour each. That ratio
          holds in real audits too: most UX debt is cheap to pay.
        </li>
      </ShortVersion>

      <p>
        Meet <strong>Driftly</strong>, a project tracker for busy teams.
        Driftly is fictional. Every one of its problems is not: each screen
        below reproduces a failure pattern that ships in real SaaS products
        every day. Inventing the app lets us roast at full temperature without
        dragging a real team, which is also{" "}
        <Link href="/">ClapBack</Link> policy: punch at products, never at
        people.
      </p>

      <h2>How a heuristic evaluation works</h2>
      <p>
        An evaluator walks through the product screen by screen, comparing what
        they see against the{" "}
        <a
          href="https://www.nngroup.com/articles/ten-usability-heuristics/"
          target="_blank"
          rel="noopener noreferrer"
        >
          10 usability heuristics
        </a>{" "}
        Jakob Nielsen published in 1994. Every mismatch becomes a finding:
        which heuristic it violates, where, how bad, and what to do about it.
        No users are recruited. That is the method&rsquo;s superpower (it takes
        hours, not weeks) and its known limit:{" "}
        <a
          href="https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/theory-heuristic-evaluations/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nielsen&rsquo;s research
        </a>{" "}
        found single evaluators catch only about 35% of usability problems on
        average, which is why evaluations use multiple evaluators, or multiple
        passes.
      </p>
      <p>
        For severity, NN/g rates problems on a{" "}
        <a
          href="https://www.nngroup.com/articles/how-to-rate-the-severity-of-usability-problems/"
          target="_blank"
          rel="noopener noreferrer"
        >
          0 to 4 scale
        </a>{" "}
        combining frequency, impact, and persistence. We collapse that into the
        three tiers a ticket queue understands: <strong>Blocker</strong>{" "}
        (severity 4: users fail or lose work), <strong>Major</strong> (severity
        3: users struggle, some give up), and <strong>Minor</strong> (severity
        1 to 2: friction and irritation). Ratings 3 and 4 are where NN/g says
        your fix budget should go.
      </p>
      <p>
        Now the fun part. Ten heuristics, ten Driftly screens, ten findings.
      </p>

      <h2>#1 · Visibility of system status</h2>
      <p>
        The system should always tell users what is going on, through timely
        feedback. Driftly&rsquo;s data import has been running for four
        minutes. The progress bar is a gray rectangle. It is not loading. It is
        just gray.
      </p>
      <Figure caption="Driftly's import modal: a progress bar with no progress, no steps, no estimate. Four minutes and counting.">
        <AnnotatedShot
          n={1}
          pinTop="52%"
          pinLeft="30%"
          note="The bar never fills. There is no percentage, no current step, no time estimate, and no way to know whether closing this modal cancels the import."
        >
          <ShotImportStall />
        </AnnotatedShot>
      </Figure>
      <Roast>
        &ldquo;Importing…&rdquo; is not a status. It is a shrug in sans-serif.
      </Roast>
      <Receipt rule="Nielsen #1 · Visibility of system status">
        Users abandoned tasks they believed had frozen. With no progress
        signal, a working import and a crashed one look identical, so the
        rational move is to bail. Severity: Major. Fix: show step names and a
        real percentage; if duration is unknowable, say so. ⚡ Quick win · ~1
        hr.
      </Receipt>

      <h2>#2 · Match between system and the real world</h2>
      <p>
        Speak the user&rsquo;s language, not yours. Driftly greets new users
        with an empty state that asks them to &ldquo;instantiate a workstream
        artifact.&rdquo; The button that creates a project does not contain the
        word project.
      </p>
      <Figure caption="Driftly's empty dashboard. Somewhere in this sentence is the concept 'create a project'.">
        <AnnotatedShot
          n={2}
          pinTop="60%"
          pinLeft="58%"
          note="The primary action of the entire product is labeled 'Instantiate artifact'. New users must translate the interface before they can use it."
        >
          <ShotJargon />
        </AnnotatedShot>
      </Figure>
      <Roast>
        Your onboarding should not require a glossary. Nobody has ever opened a
        project tracker hoping to resource-load their delivery cadence.
      </Roast>
      <Receipt rule="Nielsen #2 · Match with the real world">
        The first task of a first session is comprehension. Jargon at the entry
        point taxes every single new user, at the exact moment they are least
        committed. Severity: Major. Fix: rename to &ldquo;New project&rdquo;
        and rewrite the empty state in words a customer would say out loud. ⚡
        Quick win · ~1 hr.
      </Receipt>

      <h2>#3 · User control and freedom</h2>
      <p>
        Users need an emergency exit: undo, redo, cancel. Driftly&rsquo;s
        archive action fires instantly, permanently, and from a button one row
        away from &ldquo;Rename.&rdquo; The toast proudly announces the board
        is gone <em>forever</em>.
      </p>
      <Figure caption="One click, no confirm, no undo. The toast is a eulogy.">
        <AnnotatedShot
          n={3}
          pinTop="72%"
          pinLeft="45%"
          note="The toast confirms permanent deletion but offers no Undo action. The only recovery path is emailing support and hoping."
        >
          <ShotNoUndo />
        </AnnotatedShot>
      </Figure>
      <Ticket
        id="DRIFT-3"
        sev="Blocker"
        title="Archiving a board is instant, permanent, and unrecoverable"
        fields={[
          {
            label: "Evidence",
            value:
              "No confirmation before a destructive action, no undo after it, and the archive control sits adjacent to frequent-use actions.",
          },
          { label: "Rule", value: "Nielsen #3 · User control and freedom" },
          {
            label: "Fix",
            value:
              "Soft-delete with a 30-day archive, an Undo action in the toast, and distance (or a confirm) between destructive and routine controls.",
          },
          { label: "Effort", value: "⚡ Quick win · ~1 hr for the undo toast" },
        ]}
      />

      <h2>#4 · Consistency and standards</h2>
      <p>
        Same action, same words, same place. Driftly&rsquo;s three settings
        tabs commit changes with three different verbs (&ldquo;Save&rdquo;,
        &ldquo;Apply changes&rdquo;, &ldquo;Commit&rdquo;) in three different
        colors, one of which is the same red the app uses for destructive
        actions.
      </p>
      <Figure caption="Three tabs, three verbs, three colors for the identical action. One of them is danger-red.">
        <AnnotatedShot
          n={4}
          pinTop="46%"
          pinLeft="76%"
          note="'Apply changes' is styled in the same red as Driftly's delete buttons, so saving your billing details feels like detonating them."
        >
          <ShotInconsistent />
        </AnnotatedShot>
      </Figure>
      <Roast>
        Every synonym you ship is a tiny quiz for the user. Driftly&rsquo;s
        settings are a vocabulary test with a fire alarm painted on one answer.
      </Roast>
      <Receipt rule="Nielsen #4 · Consistency and standards">
        Users learn a pattern once and expect it to hold. Each deviation forces
        re-reading and invites hesitation, and color-coding a safe action as
        dangerous trains people to ignore your danger color. Severity: Minor.
        Fix: one verb, one style, everywhere. ⚡ Quick win · ~1 hr.
      </Receipt>

      <h2>#5 · Error prevention</h2>
      <p>
        The best error message is the one you made impossible. Driftly&rsquo;s
        sprint form happily accepts an end date two weeks before the start
        date, waits for submit, then rejects the whole form with
        &ldquo;Submission failed. Please review your input.&rdquo; Review what?
        It does not say.
      </p>
      <Figure caption="The date picker allowed this. The form blamed the user for it.">
        <AnnotatedShot
          n={5}
          pinTop="36%"
          pinLeft="72%"
          note="The end-date field accepts any date, including ones before the start date. Validation runs only on submit, and the error names no field."
        >
          <ShotDateTrap />
        </AnnotatedShot>
      </Figure>
      <Roast>
        Letting users pick an impossible date and then scolding them for it is
        entrapment with extra steps.
      </Roast>
      <Receipt rule="Nielsen #5 · Error prevention">
        The form permits a state the system will never accept. Constrain the
        picker (end date can&rsquo;t precede start), validate inline, and the
        error message becomes unnecessary. Severity: Major. Fix as described. ⚡
        Quick win · ~1 hr.
      </Receipt>

      <h2>#6 · Recognition rather than recall</h2>
      <p>
        Minimize memory load: options should be visible, not memorized.
        Driftly&rsquo;s board toolbar is seven unlabeled glyphs. No text, no
        tooltips. One of them archives things (see finding #3 for how that
        goes).
      </p>
      <Figure caption="Seven icons, zero labels, zero tooltips. One is load-bearing and destructive.">
        <AnnotatedShot
          n={6}
          pinTop="24%"
          pinLeft="38%"
          note="Icon-only controls with no tooltips force users to click to find out, and clicking to find out is how boards get archived (finding #3)."
        >
          <ShotIconMystery />
        </AnnotatedShot>
      </Figure>
      <Receipt rule="Nielsen #6 · Recognition rather than recall">
        Icons are recognized reliably only when paired with labels; abstract
        glyphs mean users must recall each one&rsquo;s meaning from past
        exploratory clicks. Severity: Major, because exploration here has a
        Blocker inside it. Fix: labels on the five most-used actions, tooltips
        on all. ⚡ Quick win · ~1 hr.
      </Receipt>

      <h2>#7 · Flexibility and efficiency of use</h2>
      <p>
        Experts should have accelerators. Driftly has 41 completed tasks to
        archive and exactly one way to do it: 41 individual clicks, each with
        its own page reload. No multi-select, no &ldquo;archive all
        done,&rdquo; no keyboard path.
      </p>
      <Figure caption="41 tasks, 41 clicks. Driftly's idea of a workflow is a treadmill.">
        <AnnotatedShot
          n={7}
          pinTop="60%"
          pinLeft="80%"
          note="Each Archive button acts on one row and triggers a full reload. There is no select-all, no bulk action, no shortcut."
        >
          <ShotOneByOne />
        </AnnotatedShot>
      </Figure>
      <Roast>
        This screen bills itself as productivity software while manufacturing
        41 units of pure friction.
      </Roast>
      <Receipt rule="Nielsen #7 · Flexibility and efficiency">
        Routine maintenance scales linearly with content, so the product
        punishes exactly its most successful users. Severity: Major. Fix:
        multi-select with bulk actions. ⚒ Deep fix · ~2 days.
      </Receipt>

      <h2>#8 · Aesthetic and minimalist design</h2>
      <p>
        Every extra element competes with the ones that matter. Driftly&rsquo;s
        dashboard loads with four stacked banners (a conference ad, an upsell,
        a beta announcement, and a plea for G2 reviews) before any actual work
        is visible.
      </p>
      <Figure caption="Content begins somewhere below the fourth banner. Allegedly.">
        <AnnotatedShot
          n={8}
          pinTop="30%"
          pinLeft="88%"
          note="Four dismissible banners stack above the fold. Each returns next session. The actual dashboard starts at 55% of viewport height."
        >
          <ShotBannerPile />
        </AnnotatedShot>
      </Figure>
      <Receipt rule="Nielsen #8 · Aesthetic and minimalist design">
        The signal-to-announcement ratio inverts the product&rsquo;s hierarchy:
        marketing outranks the user&rsquo;s own data. Severity: Minor
        (individually dismissible), trending Major every time another team
        adds a banner. Fix: one announcement slot, rotated, dismissed means
        dismissed. ⚡ Quick win · ~1 hr.
      </Receipt>

      <h2>#9 · Help users recognize, diagnose, and recover from errors</h2>
      <p>
        Error messages should say what happened, in plain language, and how to
        recover. Driftly&rsquo;s save failure produces
        &ldquo;ERR_SAVE_FAILED 0x80040154 (REGDB_E_CLASSNOTREG)&rdquo; and a
        single button: OK. It is not OK. The user&rsquo;s edits are gone.
      </p>
      <Figure caption="The error message: a hex code and a lie. Nothing about this is OK.">
        <AnnotatedShot
          n={9}
          pinTop="56%"
          pinLeft="68%"
          note="The dialog exposes an internal error code, names no cause, offers no retry, and dismissing it discards the user's unsaved work."
        >
          <ShotHexError />
        </AnnotatedShot>
      </Figure>
      <Ticket
        id="DRIFT-9"
        sev="Blocker"
        title="Failed save shows a hex code and throws away the user's work"
        fields={[
          {
            label: "Evidence",
            value:
              "Error text is an internal code with no cause and no next step. The only action, OK, closes the dialog and drops unsaved edits.",
          },
          {
            label: "Rule",
            value: "Nielsen #9 · Recognize, diagnose, recover from errors",
          },
          {
            label: "Fix",
            value:
              "Plain-language message (what failed, why, what to do), a Retry action, and edits preserved locally until a save succeeds.",
          },
          { label: "Effort", value: "⚒ Deep fix · ~2 days with draft-saving" },
        ]}
      />

      <h2>#10 · Help and documentation</h2>
      <p>
        Ideally the product needs no manual; when it does, help should be
        searchable and contextual. Driftly&rsquo;s Help page contains one
        artifact: a 214-page PDF, last updated 14 months ago, with
        &ldquo;FINAL(2)&rdquo; in the filename.
      </p>
      <Figure caption="Driftly_Manual_v3_FINAL(2).pdf. The filename alone is a confession.">
        <AnnotatedShot
          n={10}
          pinTop="48%"
          pinLeft="30%"
          note="Help is a downloadable PDF: unsearchable from the app, unindexed, 14 months stale, and invisible to anyone mid-task."
        >
          <ShotPdfHelp />
        </AnnotatedShot>
      </Figure>
      <Receipt rule="Nielsen #10 · Help and documentation">
        Help that lives outside the product cannot answer a question at the
        moment it is asked, and stale help quietly teaches users wrong answers.
        Severity: Minor. Fix: searchable in-app docs for the top 20 questions;
        retire the PDF. ⚒ Deep fix · ~2 days.
      </Receipt>

      <h2>The Driftly report card</h2>
      <p>
        Ten findings: 2 Blockers, 5 Majors, 3 Minors, and 7 of the 10 fixes are
        roughly an hour of work. That distribution is the punchline of most
        real audits too: the scary part is rarely the effort, it is that nobody
        had receipts before.
      </p>
      <TableWrap>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Heuristic</th>
              <th>Driftly&rsquo;s crime</th>
              <th>Severity</th>
              <th>Effort</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Visibility of system status</td>
              <td>Progress bar with no progress</td>
              <td>Major</td>
              <td>⚡ ~1 hr</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Match with the real world</td>
              <td>&ldquo;Instantiate a workstream artifact&rdquo;</td>
              <td>Major</td>
              <td>⚡ ~1 hr</td>
            </tr>
            <tr>
              <td>3</td>
              <td>User control and freedom</td>
              <td>Permanent archive, no undo</td>
              <td>Blocker</td>
              <td>⚡ ~1 hr</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Consistency and standards</td>
              <td>Save / Apply / Commit roulette</td>
              <td>Minor</td>
              <td>⚡ ~1 hr</td>
            </tr>
            <tr>
              <td>5</td>
              <td>Error prevention</td>
              <td>Date picker accepts impossible dates</td>
              <td>Major</td>
              <td>⚡ ~1 hr</td>
            </tr>
            <tr>
              <td>6</td>
              <td>Recognition rather than recall</td>
              <td>Seven unlabeled mystery glyphs</td>
              <td>Major</td>
              <td>⚡ ~1 hr</td>
            </tr>
            <tr>
              <td>7</td>
              <td>Flexibility and efficiency</td>
              <td>41 archives, 41 clicks</td>
              <td>Major</td>
              <td>⚒ ~2 days</td>
            </tr>
            <tr>
              <td>8</td>
              <td>Aesthetic and minimalist design</td>
              <td>Four banners before content</td>
              <td>Minor</td>
              <td>⚡ ~1 hr</td>
            </tr>
            <tr>
              <td>9</td>
              <td>Recover from errors</td>
              <td>Hex code, lost work, &ldquo;OK&rdquo;</td>
              <td>Blocker</td>
              <td>⚒ ~2 days</td>
            </tr>
            <tr>
              <td>10</td>
              <td>Help and documentation</td>
              <td>A 214-page PDF from last year</td>
              <td>Minor</td>
              <td>⚒ ~2 days</td>
            </tr>
          </tbody>
        </table>
      </TableWrap>

      <h2>How to run this on your own product</h2>
      <p>
        You just watched the whole method. To repeat it on your app: pick your
        three money flows (signup, onboarding, the core loop), walk each one
        against the 10 heuristics above, and write every violation down with a
        severity and a fix before you touch any code. Two practical notes from
        the field:
      </p>
      <ul>
        <li>
          <strong>Fresh eyes matter more than expertise.</strong> You have gone
          blind to your own product&rsquo;s rough edges; anyone who has never
          seen it will find things you cannot. Nielsen&rsquo;s multi-evaluator
          data exists precisely because single familiar evaluators miss most
          problems.
        </li>
        <li>
          <strong>A violation that never becomes a ticket never gets
          fixed.</strong> Write each one with severity, evidence, and effort
          so it can go straight into the sprint. We wrote up the exact format
          in{" "}
          <Link href="/blog/ux-findings-to-jira-tickets">
            how to turn UX findings into tickets devs actually fix
          </Link>
          .
        </li>
      </ul>
      <p>
        If you want the checklist version of this method, scoped to what a
        founder can do in an afternoon, that is{" "}
        <Link href="/blog/founder-ux-audit-checklist">
          the founder&rsquo;s UX audit checklist
        </Link>
        . And if you would rather an agent run the walk-through for you,
        that is the entire reason <Link href="/">ClapBack</Link> exists.
      </p>

      <Sources
        items={[
          {
            label: "NN/g · 10 Usability Heuristics for User Interface Design (Nielsen, 1994)",
            href: "https://www.nngroup.com/articles/ten-usability-heuristics/",
          },
          {
            label: "NN/g · How to Rate the Severity of Usability Problems",
            href: "https://www.nngroup.com/articles/how-to-rate-the-severity-of-usability-problems/",
          },
          {
            label: "NN/g · How to Conduct a Heuristic Evaluation",
            href: "https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/",
          },
          {
            label: "NN/g · The Theory Behind Heuristic Evaluations (Nielsen, 1994)",
            href: "https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/theory-heuristic-evaluations/",
          },
        ]}
      />
    </>
  );
}
