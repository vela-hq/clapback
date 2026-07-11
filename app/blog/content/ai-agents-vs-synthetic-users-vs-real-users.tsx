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
import MethodPicker from "./ai-agents-vs-synthetic-users-vs-real-users.client";

export default function Body() {
  return (
    <>
      <p>
        AI agents find defects by operating your product, synthetic users
        simulate opinions, heuristic evaluation applies expert rules, and real
        users are the ground truth. Every vendor in this market (us
        included, we know) will happily sell you their quadrant as the whole
        map. So here is the four-way comparison with the &ldquo;what it
        misses&rdquo; column left in.
      </p>

      <ShortVersion>
        <li>
          Real usability testing is the ground truth. Nielsen&rsquo;s model
          says 5 users surface ~85% of findable problems, with assumptions
          attached that most people quoting it skip.
        </li>
        <li>
          Synthetic users are LLM personas you interview. NN/g&rsquo;s verdict:
          &ldquo;UX without real-user research isn&rsquo;t UX,&rdquo; and
          synthetic answers show consistently lower variance than real humans.
        </li>
        <li>
          AI agents don&rsquo;t simulate opinions. They sign up, click, and
          submit, then check what happened against named rules. Evidence
          machines, not opinion machines.
        </li>
        <li>
          Interaction is where the issues hide: Baymard measured screenshot-only
          AI catching barely 1 in 7 of the problems present on a live page.
        </li>
        <li>
          Don&rsquo;t crown one method. Heuristic and agent passes pre-launch,
          5 real users on the money flow pre-PMF, continuous research once you
          scale.
        </li>
      </ShortVersion>

      <h2>Four methods, one honest table</h2>
      <p>
        Definitions first, because the marketing blurs them on purpose. An AI
        agent operates your product: it opens a browser, signs up, fills
        forms, and records what happened. A synthetic user never touches the
        product: it is an LLM persona answering interview questions in
        character. Real users are humans attempting tasks while someone
        watches, and a heuristic evaluation is an expert (possibly you)
        grading the interface against published rules.
      </p>
      <TableWrap>
        <table>
          <thead>
            <tr>
              <th>Method</th>
              <th>What it actually is</th>
              <th>What it catches</th>
              <th>What it misses</th>
              <th>Cost</th>
              <th>Time</th>
              <th>Use it when</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>AI agent audit</td>
              <td>
                A browser agent walks your live flows and checks each step
                against named rules (Nielsen&rsquo;s heuristics, WCAG)
              </td>
              <td>
                Broken flows, silent form failures, dead ends, rule violations
                with replayable evidence and screenshots
              </td>
              <td>
                Motivation, desirability, trust, whether your copy persuades.
                Anything that requires an opinion
              </td>
              <td>
                From $49 one-time (ClapBack); Loop11 agents from $179/mo
              </td>
              <td>Under an hour</td>
              <td>
                Pre-launch defect sweep, then before every release as a
                regression net
              </td>
            </tr>
            <tr>
              <td>Synthetic users</td>
              <td>
                LLM personas answer interview or survey questions in
                character; nobody touches the product
              </td>
              <td>
                Fast hypotheses: likely objections, draft personas, holes in
                your interview guide
              </td>
              <td>
                Real variance and magnitude. Answers spread consistently
                narrower than real humans&rsquo; (NN/g)
              </td>
              <td>$2 to $60 per interview (vendor&rsquo;s own pricing)</td>
              <td>Minutes</td>
              <td>
                Piloting a study design before spending real participants on
                it
              </td>
            </tr>
            <tr>
              <td>Real users</td>
              <td>
                Actual humans attempt real tasks, moderated or unmoderated,
                while you watch or record
              </td>
              <td>
                Actual behavior, the why behind drop-off, and the surprises
                nobody predicted
              </td>
              <td>
                Little in principle. In practice: whatever your 5 recruits and
                your chosen tasks never hit
              </td>
              <td>
                The priciest: recruiting, incentives, moderation, synthesis
              </td>
              <td>Days to weeks</td>
              <td>
                Any decision that bets real money on how people behave
              </td>
            </tr>
            <tr>
              <td>Heuristic evaluation</td>
              <td>
                An expert walks the flows against Nielsen&rsquo;s 10
                heuristics and logs violations
              </td>
              <td>
                Known violation patterns; ~35% of problems for a single
                evaluator, more with 3 to 5
              </td>
              <td>
                What fresh users would trip on. You grading your own homework
                has blind spots
              </td>
              <td>Free if you run it yourself; hired out, real money</td>
              <td>An afternoon</td>
              <td>Day one, before you pay anyone for anything</td>
            </tr>
          </tbody>
        </table>
      </TableWrap>
      <p>
        Now the receipts behind each cell, starting with the category that
        gets marketed hardest.
      </p>

      <h2>AI agents: the audit that clicks things</h2>
      <p>
        An agent-based audit works your product the way a stranger would:
        signup, forms, checkout, the lot, in a real browser. That is{" "}
        <Link href="/">ClapBack</Link>&rsquo;s category (paste a URL, get
        tickets, from $49), and we did not invent it alone.{" "}
        <a
          href="https://www.loop11.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Loop11
        </a>{" "}
        sells AI browser agents that &ldquo;navigate, interact with, and
        evaluate websites&rdquo; alongside its human panels, and academia
        arrived at the same idea from two directions.
      </p>
      <p>
        Amazon-affiliated researchers built{" "}
        <a
          href="https://arxiv.org/abs/2502.12561"
          target="_blank"
          rel="noopener noreferrer"
        >
          UXAgent
        </a>{" "}
        (CHI 2025), which set 60 LLM personas loose on a mock shopping site;
        the authors frame it as a way to pilot study designs before spending
        real participants, not as a replacement for them. Columbia&rsquo;s{" "}
        <a
          href="https://arxiv.org/abs/2509.05197"
          target="_blank"
          rel="noopener noreferrer"
        >
          WebProber
        </a>{" "}
        agent probed 120 academic personal websites and surfaced 29 usability
        issues, &ldquo;many of which were missed by traditional tools.&rdquo;
        And the 2026 benchmark{" "}
        <a
          href="https://arxiv.org/abs/2606.16262"
          target="_blank"
          rel="noopener noreferrer"
        >
          UXBench
        </a>{" "}
        forces models to collect &ldquo;interaction evidence before
        reporting&rdquo; and finds they &ldquo;differ meaningfully in report
        actionability.&rdquo; Translation: agents work, unevenly by model, and
        the interaction is the entire point.
      </p>
      <p>
        The blind spot this fixes has been measured:{" "}
        <a
          href="https://baymard.com/blog/gpt-ux-audit"
          target="_blank"
          rel="noopener noreferrer"
        >
          Baymard&rsquo;s audit study
        </a>{" "}
        found screenshot-only AI caught barely 1 in 7 of the issues present on
        a live page, and the full autopsy is in{" "}
        <Link href="/blog/chatgpt-ux-audit-prompts">
          our ChatGPT prompts piece
        </Link>
        . Problems that exist only when something gets clicked need something
        that clicks.
      </p>
      <p>
        What agents cannot do is feel. An agent can prove your form rejects
        valid emails; it cannot tell you whether anyone wants the product,
        trusts the pricing page, or winces at your tone. For the full anatomy
        of what an agent run covers, see{" "}
        <Link href="/blog/what-is-an-ai-ux-audit">
          what an AI UX audit actually is
        </Link>
        .
      </p>

      <h2>Synthetic users: interviews with software</h2>
      <p>
        A synthetic user is an LLM persona built to answer research questions
        in character. &ldquo;Maria, 34, ops manager&rdquo; will gladly tell
        you what she thinks of your onboarding, despite never having
        experienced it, or anything else.{" "}
        <a
          href="https://www.syntheticusers.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Synthetic Users
        </a>{" "}
        sells these interviews at $2 to $60 each and claims its AI feedback
        &ldquo;lined up with human feedback over 95% of the time&rdquo;;
        Uxia pitches AI-powered user testing with &ldquo;no recruiting
        needed.&rdquo; To its credit, Synthetic Users&rsquo; own site calls
        the product &ldquo;a discovery co-pilot, not a replacement for real
        research.&rdquo;
      </p>
      <p>
        NN/g examined the practice and published the bluntest line in the
        debate:{" "}
        <a
          href="https://www.nngroup.com/articles/synthetic-users/"
          target="_blank"
          rel="noopener noreferrer"
        >
          &ldquo;UX without real-user research isn&rsquo;t UX.&rdquo;
        </a>{" "}
        Their guidance: treat every synthetic finding as an unvalidated
        hypothesis. Useful for drafting interview guides and proto-personas,
        dangerous as the basis for a design or business decision.
      </p>
      <Roast>
        A synthetic user is a focus group that agrees with you, at scale, for
        $2 a head.
      </Roast>
      <Receipt>
        In{" "}
        <a
          href="https://www.nngroup.com/articles/ai-simulations-studies/"
          target="_blank"
          rel="noopener noreferrer"
        >
          NN/g&rsquo;s review of three simulation studies
        </a>
        , 605 synthetic survey respondents scored purchase likelihood at 1.58
        versus 1.66 for 605 matched humans, with standard deviation
        consistently lower in the synthetic data. Raluca Budiu&rsquo;s
        summary: synthetic users capture general trends but fail &ldquo;at
        capturing the magnitude of the effects or the variability.&rdquo;
        Lower variance means fewer surprises, and surprises are the entire
        product of user research.
      </Receipt>

      <h2>Real users: the only source of truth</h2>
      <p>
        Nothing about real behavior can be established without real behavior,
        which is why moderated and unmoderated usability testing stays the
        gold standard. The famous efficiency claim comes from{" "}
        <a
          href="https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nielsen&rsquo;s 5-user article
        </a>
        : with an average test user surfacing about 31% of problems, the
        formula N(1-(1-L)^n) says 5 users uncover roughly 85%, so run
        &ldquo;as many small tests as you can afford.&rdquo;
      </p>
      <p>
        Quote that 85% honestly, though. It is a model, not a measurement of
        your product: the 31% is an average across old projects, and the math
        counts only problems your chosen tasks could surface at all.
        Nielsen&rsquo;s own conclusion was to iterate, arguing 3 studies with
        5 users each beat one monster study with 15.
      </p>
      <p>
        The catch is the price of humans. Recruiting people who resemble your
        customers, paying incentives, moderating sessions, and synthesizing
        notes runs to weeks and real money, which is exactly why small teams
        skip it. We broke down the money side in{" "}
        <Link href="/blog/ux-audit-cost">what a UX audit costs</Link>.
      </p>

      <h2>Heuristic evaluation: the baseline everyone forgets</h2>
      <p>
        Before paying anyone for opinions, human or artificial, there is a
        method that costs an afternoon: walk your core flows against
        Nielsen&rsquo;s 10 heuristics and log every violation.{" "}
        <a
          href="https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/theory-heuristic-evaluations/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nielsen&rsquo;s data
        </a>{" "}
        says a single evaluator finds about 35% of usability problems, which
        is why NN/g recommends 3 to 5 independent evaluators.
      </p>
      <p>
        Two things make it the correct day-one move. It is free, and it
        stacks:{" "}
        <a
          href="https://www.nngroup.com/articles/usability-problems-found-by-heuristic-evaluation/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nielsen found
        </a>{" "}
        heuristic evaluation and user testing &ldquo;each finds usability
        problems overlooked by the other method,&rdquo; so an early heuristic
        pass never wastes a later user test. We ran the whole method, all 10
        heuristics with severities and fixes, in our{" "}
        <Link href="/blog/heuristic-evaluation-example">
          worked heuristic evaluation example
        </Link>
        . Want an LLM riding shotgun on that pass? Our{" "}
        <Link href="/blog/chatgpt-ux-audit-prompts">
          ChatGPT UX audit prompts
        </Link>{" "}
        are the $0 version.
      </p>

      <h2>Simulated opinions vs executed interactions</h2>
      <p>
        The label &ldquo;AI UX research&rdquo; hides the distinction that
        matters: some AI produces opinions, and some AI performs actions. A
        synthetic user&rsquo;s output is plausible text. You cannot replay
        it, falsify it, or attach a screenshot to it; the only way to check
        it is to run the real research it was supposed to replace.
      </p>
      <p>
        An agent&rsquo;s output is a trace. It typed this email, the form
        silently rejected it, here is the screenshot and the rule it
        violates. Disagreeing with a trace takes a minute of replaying, not a
        research budget. UXBench turned that principle into a benchmark by
        requiring &ldquo;interaction evidence before reporting,&rdquo;
        because a critique without executed interactions cannot be checked.
      </p>
      <p>
        The failure modes follow. Agents fail by omission: whatever flow the
        agent never walked, it cannot report on, and it will never tell you
        why users churn. Synthetic users fail by confident fiction: fluent
        answers to questions nobody asked a human. One is an evidence machine
        with gaps, the other an opinion machine with polish. Budget
        accordingly.
      </p>

      <h2>Which method should you use right now?</h2>
      <p>
        Match the method to your stage: heuristic and agent passes
        pre-launch, 5 real users on the money flow pre-PMF, continuous
        research at scale. Answer 3 questions and the picker below does the
        matching for you.
      </p>

      <MethodPicker />

      <p>The reasoning, stage by stage, in ticket-sized pieces:</p>
      <ul>
        <li>
          <strong>Pre-launch, solo founder.</strong> Run your own heuristic
          afternoon, then an agent audit before the launch post goes live.
          Total spend: under $50 and a Saturday. There are no users to
          recruit yet, so &ldquo;real user testing&rdquo; is not on the menu;
          defect-hunting is.
        </li>
        <li>
          <strong>Pre-PMF, early revenue.</strong> Keep the agent as a
          regression net on every release, and put 5 real users on the
          signup-to-payment flow. Per Nielsen&rsquo;s model that surfaces
          most findable problems in the one flow that pays rent, for the
          price of 5 incentives.
        </li>
        <li>
          <strong>Scaling.</strong> Continuous rounds of real research,
          agent checks before each release, and synthetic personas only for
          piloting study designs, which is the exact use UXAgent&rsquo;s own
          authors endorse.
        </li>
      </ul>

      <Ticket
        id="UX-201"
        sev="Major"
        title="The signup-to-payment flow has never been tested by anyone"
        fields={[
          {
            label: "Evidence",
            value:
              "The flow that earns the money has only ever been operated by the people who built it, who cannot see it fresh.",
          },
          {
            label: "Rule",
            value: "Nielsen's 5-user model · 5 users find ~85% of findable problems",
          },
          {
            label: "Fix",
            value:
              "Agent audit today to clear the Blockers, then 5 real users on the flow next sprint. Fix in that order so humans hit real questions, not dead buttons.",
          },
          {
            label: "Effort",
            value: "⚡ Quick win · agent audit ~1 hr; user round ~1 week",
          },
        ]}
      />
      <p>
        That ticket is self-serve: the agent half takes a URL and about the
        length of a coffee. <Link href="/">ClapBack</Link> runs it, and your
        first 5 real users will thank you for the dead buttons they never met.
      </p>

      <Sources
        items={[
          {
            label: "Baymard Institute, Testing ChatGPT-4 for UX audits (2023)",
            href: "https://baymard.com/blog/gpt-ux-audit",
          },
          {
            label:
              "NN/g, Synthetic users: if, when, and how to use AI-generated research (Rosala & Moran, 2024)",
            href: "https://www.nngroup.com/articles/synthetic-users/",
          },
          {
            label:
              "NN/g, Evaluating AI-simulated behavior: three studies (Budiu, 2025)",
            href: "https://www.nngroup.com/articles/ai-simulations-studies/",
          },
          {
            label: "NN/g, Why you only need to test with 5 users (Nielsen, 2000)",
            href: "https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/",
          },
          {
            label:
              "NN/g, The theory behind heuristic evaluations (Nielsen, 1994)",
            href: "https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/theory-heuristic-evaluations/",
          },
          {
            label:
              "NN/g, Usability problems found by heuristic evaluation (Nielsen, 1995)",
            href: "https://www.nngroup.com/articles/usability-problems-found-by-heuristic-evaluation/",
          },
          {
            label: "UXAgent, LLM agent usability testing framework (CHI 2025)",
            href: "https://arxiv.org/abs/2502.12561",
          },
          {
            label: "WebProber, AI agents for web testing (arXiv 2509.05197)",
            href: "https://arxiv.org/abs/2509.05197",
          },
          {
            label:
              "UXBench, measuring actionability of LLM UX critiques (arXiv 2606.16262)",
            href: "https://arxiv.org/abs/2606.16262",
          },
          {
            label: "Synthetic Users, vendor claims and pricing",
            href: "https://www.syntheticusers.com/",
          },
          {
            label: "Loop11, AI browser agents",
            href: "https://www.loop11.com/",
          },
        ]}
      />
    </>
  );
}
