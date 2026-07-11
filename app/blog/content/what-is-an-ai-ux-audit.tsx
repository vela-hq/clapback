import Link from "next/link";
import {
  ShortVersion,
  Roast,
  Receipt,
  PullStat,
  Figure,
  TableWrap,
  Sources,
} from "../../components/blog/Widgets";

/* Server-rendered "agent run log": what an agent-based audit looks like minute
   by minute. Pure markup, styled like the product's report window. */
function AgentRunLog() {
  const steps: { t: string; action: string; finding?: string }[] = [
    { t: "00:00", action: "Opens your-app.com in a clean browser profile" },
    { t: "00:41", action: "Reads the landing page, locates the primary CTA" },
    {
      t: "01:12",
      action: "Starts signup with a fresh email address",
      finding: "Form demands company size before showing any product",
    },
    {
      t: "03:05",
      action: "Submits the form with a deliberately weak password",
      finding: "Error banner names no field",
    },
    { t: "04:38", action: "Completes signup, lands in onboarding" },
    {
      t: "06:20",
      action: "Abandons onboarding midway, then returns",
      finding: "Progress lost, flow restarts from step 1",
    },
    { t: "09:47", action: "Runs the core flow end to end, twice" },
    {
      t: "14:31",
      action: "Tests every empty state, error state, and destructive action",
      finding: "Delete has no confirm and no undo",
    },
    { t: "19:02", action: "Writes findings: severity, rule, screenshot, fix" },
  ];

  return (
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.5 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          background: "var(--surface-soft)",
          borderBottom: "1px solid var(--border-soft)",
        }}
      >
        <span style={{ display: "flex", gap: 4 }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--border)",
                display: "inline-block",
              }}
            />
          ))}
        </span>
        <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
          agent run · your-app.com
        </span>
      </div>
      <div style={{ padding: "14px 18px" }}>
        {steps.map((s) => (
          <div
            key={s.t}
            style={{
              display: "grid",
              gridTemplateColumns: "44px 1fr",
              gap: 12,
              padding: "6px 0",
              borderBottom: "1px dashed var(--border-soft)",
            }}
          >
            <span style={{ color: "var(--text-faint)" }}>{s.t}</span>
            <span>
              <span style={{ color: "var(--text)" }}>{s.action}</span>
              {s.finding && (
                <span
                  style={{
                    display: "block",
                    color: "var(--accent)",
                    marginTop: 2,
                  }}
                >
                  ▸ finding: {s.finding}
                </span>
              )}
            </span>
          </div>
        ))}
        <div style={{ paddingTop: 10, color: "var(--text-muted)" }}>
          Report ready · findings sorted by severity, exported as tickets
        </div>
      </div>
    </div>
  );
}

export default function Body() {
  return (
    <>
      <p>
        An AI UX audit uses artificial intelligence to find usability problems
        in a digital product, in minutes instead of weeks. The term hides four
        very different methods, and the difference that matters is simple:
        does the AI look at your product, or does it use it?
      </p>

      <ShortVersion>
        <li>
          &ldquo;AI UX audit&rdquo; covers four method families: attention
          heatmap predictors, screenshot reviews, synthetic-user panels, and
          agents that operate the live product.
        </li>
        <li>
          Screenshot-based auditing has a published failure record: Baymard
          Institute measured an 80% false-positive rate for ChatGPT-4 in 2023.
        </li>
        <li>
          Roughly half of real UX issues only appear through interaction, which
          is why agent-based audits are the category to watch.
        </li>
        <li>
          No AI method replaces research with real users. It replaces the
          six-week wait and the four-figure invoice for the first pass.
        </li>
      </ShortVersion>

      <h2>What is an AI UX audit?</h2>
      <p>
        An AI UX audit is an automated review of a website or app that finds
        usability problems and ranks them by severity, without recruiting
        human testers. A useful one behaves like the audit a consultant would
        run: it checks the product against established rules (
        <a
          href="https://www.nngroup.com/articles/ten-usability-heuristics/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nielsen&rsquo;s 10 heuristics
        </a>
        , WCAG 2.2, the Laws of UX), attaches evidence to every claim, and
        tells you what to fix first. A bad one prints twenty generic
        observations about whitespace and calls it insight.
      </p>
      <p>
        The category is young and the label is doing a lot of work. Four
        different technologies currently sell under it, and they are not
        interchangeable.
      </p>

      <h2>The four kinds of AI UX audit</h2>
      <p>
        Every tool in this space belongs to one of four families, defined by
        what the AI actually receives as input: an image, a persona, or a
        browser session.
      </p>
      <TableWrap>
        <table>
          <thead>
            <tr>
              <th>Family</th>
              <th>What the AI does</th>
              <th>Example tools</th>
              <th>Published price</th>
              <th>Honest use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Attention prediction</td>
              <td>
                Predicts where eyes land on a static design, from eye-tracking
                training data
              </td>
              <td>
                <a
                  href="https://attentioninsight.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Attention Insight
                </a>
              </td>
              <td>From €29/mo</td>
              <td>Pre-launch layout checks; no usability findings</td>
            </tr>
            <tr>
              <td>Screenshot review</td>
              <td>
                An LLM critiques page captures against guideline libraries
              </td>
              <td>
                <a
                  href="https://uxaudit.now/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  UXAudit.Now
                </a>
                ,{" "}
                <a
                  href="https://uxaudit.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  uxaudit.app
                </a>
              </td>
              <td>Free tier; Pro $199/mo</td>
              <td>Quick static pass; misses interaction issues (see below)</td>
            </tr>
            <tr>
              <td>Synthetic users</td>
              <td>
                LLM personas answer interview and survey questions about your
                product
              </td>
              <td>
                <a
                  href="https://www.syntheticusers.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Synthetic Users
                </a>
              </td>
              <td>$2 to $60 per interview</td>
              <td>Hypothesis generation; never decisions (NN/g&rsquo;s line, below)</td>
            </tr>
            <tr>
              <td>Agent-based audit</td>
              <td>
                A browser agent signs up, clicks, submits, breaks flows, and
                reports what it hit
              </td>
              <td>
                <Link href="/">ClapBack</Link>,{" "}
                <a
                  href="https://www.loop11.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Loop11
                </a>{" "}
                agents,{" "}
                <a
                  href="https://www.uxia.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Uxia
                </a>
              </td>
              <td>ClapBack one-time from $49; Loop11 from $179/mo</td>
              <td>Finding interaction and flow defects with evidence</td>
            </tr>
          </tbody>
        </table>
      </TableWrap>
      <p>
        Academia arrived at the same split, and treats interaction as the
        point rather than an implementation detail. The papers behind that
        claim (UXAgent, WebProber, UXBench) are walked through in{" "}
        <Link href="/blog/ai-agents-vs-synthetic-users-vs-real-users">
          our comparison of agents, synthetic users, and real users
        </Link>
        .
      </p>

      <h2>Can AI actually do a UX audit?</h2>
      <p>
        Yes for finding rule-checkable defects, no for replacing human
        research, and it depends entirely on which of the four families you
        picked. The screenshot family has a public report card, and it is
        rough.
      </p>
      <PullStat num="80%">
        false-positive rate when Baymard Institute tested ChatGPT-4 as a UX
        auditor across 12 e-commerce pages in{" "}
        <a
          href="https://baymard.com/blog/gpt-ux-audit"
          target="_blank"
          rel="noopener noreferrer"
        >
          their October 2023 study
        </a>
        . Six human professionals found 257 verified issues; the model
        produced 178 suggestions, mostly noise.
      </PullStat>
      <p>
        The detail that matters more than the headline: the model caught 26%
        of the issues visible in the screenshot but only 14% of the issues on
        the live page, because roughly half of real problems are
        interaction-gated, invisible to any still image. The full autopsy of
        that study, including why the free
        audit worked out to a negative hourly wage, is in{" "}
        <Link href="/blog/chatgpt-ux-audit-prompts">
          our ChatGPT UX audit prompts piece
        </Link>
        .
      </p>
      <Roast>
        A screenshot audit grades your product the way you&rsquo;d grade a
        restaurant from a photo of the menu.
      </Roast>
      <Receipt>
        Jakob Nielsen, reviewing{" "}
        <a
          href="https://jakobnielsenphd.substack.com/p/ai-ux-evaluation"
          target="_blank"
          rel="noopener noreferrer"
        >
          the same data
        </a>
        , counted about a dozen invented findings per screenshot and
        estimated that rejecting them costs more time than the audit saves.
        Flow problems fared worst: a model that sees one page at a time cannot
        see what breaks between pages.
      </Receipt>
      <p>
        That study is from 2023 and models have improved since. What has not
        changed is the structure of the problem: a model that receives a static
        capture cannot attempt your signup, trigger your error states, lose its
        progress in your onboarding, or watch your form silently reject valid
        input. The 2026{" "}
        <a
          href="https://arxiv.org/abs/2606.16262"
          target="_blank"
          rel="noopener noreferrer"
        >
          UXBench benchmark
        </a>{" "}
        is built on exactly this premise: models must collect interaction
        evidence in a live browser before they are allowed to critique, and
        even then their reports differ meaningfully in quality. Interaction is
        the admission ticket, not a guarantee.
      </p>

      <h2>What an AI UX audit can&rsquo;t catch</h2>
      <p>
        No AI method, agents included, can tell you why users want your
        product, whether your pricing feels fair, or what a confused human
        does at 11pm with a deadline. Those answers only come from real
        people. Nielsen Norman Group&rsquo;s{" "}
        <a
          href="https://www.nngroup.com/articles/synthetic-users/"
          target="_blank"
          rel="noopener noreferrer"
        >
          position on synthetic research
        </a>{" "}
        is blunt: &ldquo;UX without real-user research isn&rsquo;t UX.&rdquo;
        We agree, and we sell one of these tools.
      </p>
      <p>
        The honest division of labor: an agent testifies, it does not opine.
        It can verify that your delete button has no undo, that your
        onboarding loses progress on reload, that your checkout contrast
        fails WCAG 1.4.3. It cannot feel frustration; it can
        only document what would cause it, with a named rule attached. For the
        full method-by-method comparison, including where synthetic users go
        wrong, see{" "}
        <Link href="/blog/ai-agents-vs-synthetic-users-vs-real-users">
          AI agents vs synthetic users vs real users
        </Link>
        .
      </p>

      <h2>AI UX audit vs UX audit vs usability testing</h2>
      <p>
        A UX audit is an expert review against rules; usability testing
        watches real users attempt tasks; an AI UX audit automates the first,
        never the second. They find different problems, which is why Nielsen
        recommended pairing expert evaluation with user testing back in{" "}
        <a
          href="https://www.nngroup.com/articles/usability-problems-found-by-heuristic-evaluation/"
          target="_blank"
          rel="noopener noreferrer"
        >
          1995
        </a>
        .
      </p>
      <TableWrap>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Human UX audit</th>
              <th>AI UX audit (agent-based)</th>
              <th>Usability testing</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Who does the work</td>
              <td>A consultant or your team</td>
              <td>A browser agent</td>
              <td>5+ real users per round</td>
            </tr>
            <tr>
              <td>Finds</td>
              <td>Rule violations, flow breaks</td>
              <td>Rule violations, flow breaks</td>
              <td>Behavior, confusion, motivation</td>
            </tr>
            <tr>
              <td>Blind spots</td>
              <td>Evaluator fatigue and familiarity</td>
              <td>Taste, desirability, context</td>
              <td>Rare paths users don&rsquo;t hit in-session</td>
            </tr>
            <tr>
              <td>Typical timeline</td>
              <td>1 to 6 weeks</td>
              <td>Minutes, under an hour</td>
              <td>1 to 3 weeks per round</td>
            </tr>
            <tr>
              <td>Typical cost</td>
              <td>$1,650 to $15,000 advertised</td>
              <td>$49 to a few hundred</td>
              <td>Recruitment alone can pass $100 per participant</td>
            </tr>
          </tbody>
        </table>
      </TableWrap>
      <p>
        The cost column deserves its own receipts; we compiled 20 published
        rate cards in{" "}
        <Link href="/blog/ux-audit-cost">what a UX audit really costs in 2026</Link>
        . The one-sentence version: the advertised market runs from $35 gig
        listings to $15,000 agency packages, and the extremes are not buying
        the same thing.
      </p>

      <h2>How an agent-based audit actually runs</h2>
      <p>
        The method behind ClapBack, minute by minute: the agent gets a URL and
        nothing else, then uses the product the way a first-time user with
        zero patience would. Everything it hits becomes a finding with a
        severity, a cited rule, a screenshot, and a suggested fix.
      </p>
      <Figure caption="A representative agent run. Findings appear where the product resisted, not where a checklist said to look.">
        <AgentRunLog />
      </Figure>
      <p>
        If you are evaluating any tool in this category, ours included, four
        questions separate the serious from the decorative:
      </p>
      <ul>
        <li>
          <strong>Does it interact?</strong> If the input is a screenshot, you
          are buying the 14% discovery tier.
        </li>
        <li>
          <strong>Does every finding cite a checkable rule?</strong> A finding
          you can argue with is worth ten vibes.
        </li>
        <li>
          <strong>Does it admit uncertainty?</strong> Hallucinated findings
          cost review time; Nielsen measured the audit going net-negative.
        </li>
        <li>
          <strong>Does the output land where work happens?</strong> A report
          you have to transcribe into the backlog is homework; a finding that
          arrives as a ticket gets fixed. We wrote up the format in{" "}
          <Link href="/blog/ux-findings-to-jira-tickets">
            turning UX findings into tickets
          </Link>
          .
        </li>
      </ul>
      <p>
        Four questions, one shortcut: paste your URL into{" "}
        <Link href="/">ClapBack</Link> and see which ones we pass.
      </p>

      <Sources
        items={[
          {
            label: "Baymard Institute · Testing ChatGPT-4 for UX Audits (Oct 2023)",
            href: "https://baymard.com/blog/gpt-ux-audit",
          },
          {
            label: "Jakob Nielsen · Unreliability of AI in Evaluating UX Screenshots (Oct 2023)",
            href: "https://jakobnielsenphd.substack.com/p/ai-ux-evaluation",
          },
          {
            label: "UXBench · Measuring the Actionability of LLM-Generated UX Critiques (arXiv 2606.16262)",
            href: "https://arxiv.org/abs/2606.16262",
          },
          {
            label: "NN/g · Synthetic Users: If, When, and How (Jun 2024)",
            href: "https://www.nngroup.com/articles/synthetic-users/",
          },
          {
            label: "NN/g · Usability Problems Found by Heuristic Evaluation (1995)",
            href: "https://www.nngroup.com/articles/usability-problems-found-by-heuristic-evaluation/",
          },
          {
            label: "NN/g · 10 Usability Heuristics for User Interface Design",
            href: "https://www.nngroup.com/articles/ten-usability-heuristics/",
          },
        ]}
      />
    </>
  );
}
