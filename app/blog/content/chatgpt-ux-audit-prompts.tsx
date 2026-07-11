import Link from "next/link";
import {
  ShortVersion,
  Roast,
  Receipt,
  PullStat,
  TableWrap,
  Sources,
} from "../../components/blog/Widgets";
import CopyButton from "../../components/blog/CopyButton";

const PROMPT_LANDING = `You are a senior UX reviewer doing a first-impression review of a landing page. I will paste a URL or attach a screenshot below.

Scope: review only what you can actually see. You cannot click, scroll, or load anything, so do not comment on behavior you cannot observe. If a finding would need interaction to confirm (load time, hover states, what a button does), write "cannot assess" instead of guessing.

Review these 5 things:
1. Visual hierarchy: where does the eye land first, second, third? Does that order match what the page most needs a visitor to see?
2. Value proposition clarity: after 5 seconds, could a stranger say what this product does, who it is for, and why it beats the obvious alternative? Quote the exact words that make it clear or unclear.
3. Call-to-action competition: count every competing action above the fold. Name the primary CTA and every element fighting it for attention.
4. Credibility: what on this page earns trust, and what costs it (specific proof vs vague claims, real product shots vs stock imagery)?
5. Copy scan: flag jargon, filler adjectives, and any headline that describes the company instead of the visitor's problem.

Output format, for every finding:
- Finding: one sentence naming the exact element (quote its text).
- Rule: the named principle it violates (one of Nielsen's 10 usability heuristics, a Law of UX such as Hick's law or Fitts's law, or a WCAG 2.2 criterion). If no named rule applies, write "convention" and describe it.
- Severity: Blocker / Major / Minor, based on how many visitors it affects and how much.
- Confidence: High / Medium / Low, with one line on why.
- Fix: one concrete change, small enough to ship in a day.

Rank findings by severity. Do not pad: 5 sharp findings beat 15 vague ones. Never invent a problem to fill space. If the page is genuinely fine in one of the 5 areas, say so in one line.`;

const PROMPT_FORM = `You are a UX reviewer specializing in forms. I am attaching a screenshot of a form (signup, checkout, or settings). Review it against established form-design rules.

Check, in order:
1. Field count: which fields could be deleted, deferred until later, or inferred automatically? Name each one.
2. Labels: are labels visible at all times, or do placeholders disappear when the user starts typing? Placeholder-as-label is a finding.
3. Error prevention (Nielsen heuristic #5): what invalid input does this form appear to allow that it could prevent up front (constrained pickers, input masks, sensible defaults)?
4. Error recovery (Nielsen heuristic #9): if error states are visible in the screenshot, do they say what went wrong, next to the field, in plain language? If no error state is visible, mark this "cannot assess: needs a live submit" and move on.
5. Effort signals: optional fields marked optional, correct input types, autofill-friendly fields, and a submit button that names its outcome ("Create account", not "Submit").

Rules of engagement:
- You have one static image. You cannot see focus states, validation timing, or what happens after submit. Never speculate about those. List them under a final section titled "Needs a live test" instead.
- Every finding must cite a named rule (one of Nielsen's 10 heuristics or a specific form convention) and quote or describe the exact field.
- Give every finding a severity (Blocker / Major / Minor) and a confidence level (High / Medium / Low).
- Below Medium confidence, write "cannot assess" rather than guessing. A short honest list is worth more to me than a long padded one.

End with the single change most likely to raise completion rate, and one sentence on why.`;

const PROMPT_COPY = `You are a UX writer reviewing interface copy. Below I have pasted the exact strings from my product (button labels, headings, empty states, error messages, tooltips). Review only these strings. Do not assume anything about the surrounding design.

For the full set:
1. Jargon hunt: flag every term a first-time user might not know. For each, say who would stumble on it and give a plain replacement. Internal feature names, invented nouns, and abbreviations all count.
2. Reading level: estimate the overall reading level and flag any sentence that needs re-reading. Interface copy should sit around a 7th-grade level.
3. Button verbs: every button should start with a verb that names its outcome. Flag "Submit", "OK", "Continue", and any label where the user cannot predict what happens next.
4. Error messages: check each error string says what happened, why, and what to do next, in words a person would say out loud (Nielsen heuristic #9). No codes, no blaming the user.
5. Consistency: flag any concept named two different ways anywhere in the set (Nielsen heuristic #4).

Output a table: String (verbatim) | Problem | Rule | Severity (Blocker / Major / Minor) | Suggested rewrite.

Constraints: rewrites must preserve meaning and stay near the original length. Do not rewrite strings that are already good; list those at the end under "Leave as is" so I know you read them. If a string's context is ambiguous, ask me rather than assume. Do not invent a problem where the real issue is missing context.

My strings:
[PASTE YOUR INTERFACE STRINGS HERE]`;

const PROMPT_HEURISTIC = `You are running a heuristic evaluation against Nielsen's 10 usability heuristics: (1) visibility of system status, (2) match between system and the real world, (3) user control and freedom, (4) consistency and standards, (5) error prevention, (6) recognition rather than recall, (7) flexibility and efficiency of use, (8) aesthetic and minimalist design, (9) help users recognize, diagnose, and recover from errors, (10) help and documentation.

Below I describe one flow in my product, step by step, exactly as a user experiences it, including every screen, message, and wait.

Your job:
1. Walk my description step by step and check each step against all 10 heuristics.
2. Report only violations you can point to in my description, quoting the step. If you suspect a problem my description does not confirm (what an error message says, how long a wait lasts), put it in a separate list titled "Questions to check on the live product". Do not report it as a finding.
3. For each finding, output a table row: Step | Heuristic (number and name) | What is wrong | Severity 0-4 on the Nielsen scale (4 = catastrophe, 3 = major, 2 = minor, 1 = cosmetic) | Confidence (High / Medium / Low) | Suggested fix.
4. After the table, write the top 3 findings as tickets: title, evidence, rule, fix, and rough effort (hours or days).

Severity must weigh frequency (how many users hit it), impact (how hard it is to get past), and persistence (once, or every single time). Where my description is too thin to judge, write "cannot assess" and tell me exactly what detail to add.

My flow, step by step:
[DESCRIBE EACH STEP: what the user sees, clicks, types, and waits for]`;

function PromptCard({ label, text }: { label: string; text: string }) {
  return (
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
          {label}
        </span>
        <CopyButton text={text} />
      </div>
      <pre
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 13.5,
          lineHeight: 1.55,
          whiteSpace: "pre-wrap",
          padding: "16px 18px",
          margin: 0,
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
        ChatGPT can give you a genuinely useful UX review of anything you can
        paste into it: a screenshot, a landing page, interface copy, a
        described flow. Below are 4 prompts that make that review sharp
        instead of generic, and an honest map of the wall every one of them
        hits.
      </p>

      <ShortVersion>
        <li>
          4 copy-paste prompts below: landing page first impressions, form
          review, a UX copy pass, and a full walk against Nielsen&rsquo;s 10
          heuristics.
        </li>
        <li>
          Each prompt demands named rules, severity, a confidence level, and
          permission to say &ldquo;cannot assess.&rdquo; That last clause is
          the difference between feedback and fiction.
        </li>
        <li>
          The fiction is measured: Baymard clocked ChatGPT-4 screenshot audits
          at an 80% false-positive rate; Jakob Nielsen counted roughly 11
          hallucinations per screenshot.
        </li>
        <li>
          A prompt reviews what you show it. Error states, multi-page flows,
          latency, and what happens after submit only exist when something
          uses the product.
        </li>
      </ShortVersion>

      <p>
        Up front: we did not lab-test 50 prompts against each other. These 4
        are the ones we would run ourselves, engineered around the documented
        failure mode: hallucination.{" "}
        <a
          href="https://jakobnielsenphd.substack.com/p/ai-ux-evaluation"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nielsen&rsquo;s analysis
        </a>{" "}
        counted about 11 hallucinated findings per AI screenshot review, so
        every prompt here forces named rules, a confidence level, and
        &ldquo;cannot assess&rdquo; instead of improvising. Free, no email
        gate.
      </p>

      <h2>Prompt 1: landing page first-impression review</h2>
      <p>
        Use this on your homepage or any campaign page. It reviews the 5
        things a static view can actually judge (hierarchy, value prop
        clarity, CTA competition, credibility, copy) and explicitly bans the
        model from commenting on behavior it cannot see.
      </p>
      <PromptCard label="prompt 1 · landing page" text={PROMPT_LANDING} />

      <h2>Prompt 2: form and signup review</h2>
      <p>
        Screenshot your signup, checkout, or settings form and attach it.
        This one leans on error prevention and error recovery, the two
        heuristics forms violate most, and quarantines everything that needs
        a live submit into a &ldquo;Needs a live test&rdquo; list.
      </p>
      <PromptCard label="prompt 2 · form review" text={PROMPT_FORM} />

      <h2>Prompt 3: UX copy pass</h2>
      <p>
        The strongest use of a chat model, because the artifact is complete:
        you paste the strings, the model sees everything there is to see.
        Export your button labels, empty states, and error messages and run
        the jargon hunt.
      </p>
      <PromptCard label="prompt 3 · copy pass" text={PROMPT_COPY} />

      <h2>Prompt 4: heuristic pass on a described flow</h2>
      <p>
        For flows, the trick is that you do the walking and the model does
        the judging. Describe each step of your signup or core loop in plain
        text, and the model maps your description to Nielsen&rsquo;s 10
        heuristics with severity on the{" "}
        <a
          href="https://www.nngroup.com/articles/how-to-rate-the-severity-of-usability-problems/"
          target="_blank"
          rel="noopener noreferrer"
        >
          NN/g 0 to 4 scale
        </a>
        . The output is ticket-shaped on purpose. To see what a full
        10-heuristic pass looks like done properly, we ran{" "}
        <Link href="/blog/heuristic-evaluation-example">
          a complete worked example
        </Link>{" "}
        on a fictional app.
      </p>
      <PromptCard label="prompt 4 · heuristic pass" text={PROMPT_HEURISTIC} />

      <h2>Can ChatGPT do a full UX audit?</h2>
      <p>
        No. ChatGPT reviews whatever you paste into the chat, and most UX
        failures only show up when something actually uses the product.
      </p>
      <p>
        The best published benchmark is{" "}
        <a
          href="https://baymard.com/blog/gpt-ux-audit"
          target="_blank"
          rel="noopener noreferrer"
        >
          Baymard&rsquo;s October 2023 study
        </a>
        , which put ChatGPT-4 screenshot audits of 12 e-commerce pages up
        against 6 human UX professionals. The model found 26% of the issues
        visible in the screenshot, and only 14% of the issues present on the
        live page. Baymard&rsquo;s own explanation for that gap:
        &ldquo;Discovering many of the UX issues present on a given webpage
        requires interacting with the webpage.&rdquo;
      </p>
      <Roast>
        An unconstrained screenshot audit is a psychic reading: fast,
        confident, specific, and wrong 4 times out of 5.
      </Roast>
      <Receipt>
        Baymard measured an{" "}
        <a
          href="https://baymard.com/blog/gpt-ux-audit"
          target="_blank"
          rel="noopener noreferrer"
        >
          80% false-positive rate
        </a>
        . Nielsen&rsquo;s follow-up found that identifying and rejecting the
        hallucinations cost a full extra hour, for a{" "}
        <a
          href="https://jakobnielsenphd.substack.com/p/ai-ux-evaluation"
          target="_blank"
          rel="noopener noreferrer"
        >
          net outcome of minus 0.2 hours
        </a>
        . The free audit had a negative hourly wage.
      </Receipt>
      <p>
        Fair caveat: that study is from 2023, and models have gotten
        meaningfully better at reading screenshots since. The prompts above
        exist to squeeze out that improvement. What has not changed, and
        cannot change, is the structural part: a chat window does not sign
        up, does not submit your form, does not trigger your error states,
        and does not sit through your spinner. In Nielsen&rsquo;s words,
        ChatGPT has &ldquo;no chance of discovering problems stemming from
        the movement between pages.&rdquo;
      </p>
      <PullStat num="14%">
        share of live-page UX issues ChatGPT-4 found in{" "}
        <a
          href="https://baymard.com/blog/gpt-ux-audit"
          target="_blank"
          rel="noopener noreferrer"
        >
          Baymard&rsquo;s benchmark
        </a>
        , against 26% of issues visible in the screenshot itself. Roughly
        half of real UX problems never make it into the picture.
      </PullStat>
      <TableWrap>
        <table>
          <thead>
            <tr>
              <th>A prompt plus a screenshot can judge</th>
              <th>Only something that interacts can find</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Layout and visual hierarchy</td>
              <td>Focus, hover, and loading states</td>
            </tr>
            <tr>
              <td>Copy, jargon, button labels</td>
              <td>Real form validation and error messages</td>
            </tr>
            <tr>
              <td>CTA competition above the fold</td>
              <td>What actually happens after submit</td>
            </tr>
            <tr>
              <td>One screen, frozen in time</td>
              <td>Multi-page flows, signup to first success</td>
            </tr>
            <tr>
              <td>How the page reads</td>
              <td>How the product feels: latency, waits, dead ends</td>
            </tr>
            <tr>
              <td>The flow as you remember describing it</td>
              <td>The flow as it behaves for a stranger</td>
            </tr>
          </tbody>
        </table>
      </TableWrap>
      <p>
        The right column is why{" "}
        <Link href="/blog/what-is-an-ai-ux-audit">agent-based UX audits</Link>{" "}
        exist as a separate category: an agent operates the product,
        breaks the flows, and keeps screenshots as evidence.{" "}
        <Link href="/">ClapBack</Link> runs one from a URL and files the
        findings as tickets.
      </p>

      <h2>When a prompt is enough (and when it isn&rsquo;t)</h2>
      <p>
        The numbers above describe full audits, and half your questions are
        not full audits. A $0 prompt beats a $0 nothing every single time.
      </p>
      <p>Reach for a prompt when:</p>
      <ul>
        <li>
          <strong>The artifact is complete.</strong> A copy pass (prompt 3)
          works because pasted strings hide nothing. Nothing is
          interaction-gated in a sentence.
        </li>
        <li>
          <strong>You want a second opinion on one static screen.</strong>{" "}
          Hierarchy, CTA competition, and clarity are legible in a
          screenshot, and fresh eyes beat your familiarity-blind ones.
        </li>
        <li>
          <strong>You need a fast gut-check before a meeting.</strong> Ten
          minutes with prompt 1 will find the vague headline before your
          prospects do.
        </li>
      </ul>
      <p>Do not stop at a prompt when:</p>
      <ul>
        <li>
          <strong>Money moves through the flow.</strong> Signup, checkout,
          and onboarding fail in exactly the places a screenshot cannot
          reach: validation, submits, page transitions.
        </li>
        <li>
          <strong>You are debugging drop-off.</strong> If users abandon step
          3, the answer lives in the behavior of step 3, not in a picture of
          it.
        </li>
        <li>
          <strong>You are about to launch.</strong> Run the full method:
          walk your 3 money flows yourself with{" "}
          <Link href="/blog/founder-ux-audit-checklist">
            the founder&rsquo;s UX audit checklist
          </Link>
          , or point an agent at the URL and let it do the walking.
        </li>
      </ul>
      <p>
        Either way, keep the discipline the prompts enforce: named rules,
        severity, confidence, and no findings without evidence. That
        standard is what separates a review you can act on from 11
        hallucinations in a trench coat.
      </p>

      <Sources
        items={[
          {
            label: "Baymard Institute · Testing ChatGPT-4 for UX Audits (Oct 2023)",
            href: "https://baymard.com/blog/gpt-ux-audit",
          },
          {
            label:
              "Jakob Nielsen · Unreliability of AI in Evaluating UX Screenshots (2023)",
            href: "https://jakobnielsenphd.substack.com/p/ai-ux-evaluation",
          },
          {
            label: "NN/g · 10 Usability Heuristics for User Interface Design",
            href: "https://www.nngroup.com/articles/ten-usability-heuristics/",
          },
          {
            label: "NN/g · How to Rate the Severity of Usability Problems",
            href: "https://www.nngroup.com/articles/how-to-rate-the-severity-of-usability-problems/",
          },
        ]}
      />
    </>
  );
}
