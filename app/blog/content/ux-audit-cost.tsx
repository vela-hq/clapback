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
import CostPicker from "./ux-audit-cost.client";

export default function Body() {
  return (
    <>
      <p>
        A UX audit costs anywhere from $35 to $15,000, and the median
        advertised price across 20 published offers is $500. That median comes
        from a ClapBack analysis of 20 published rate cards (12 providers,
        July 2026), not from an agency blog with a retainer to sell. The $35
        gig and the $15,000 engagement are both real. They are barely the
        same product.
      </p>

      <ShortVersion>
        <li>
          Median advertised UX audit price: $500 across 20 published offers
          from 12 providers. Excluding gig marketplaces: $1,775. (ClapBack
          analysis, July 2026.)
        </li>
        <li>
          By segment: Fiverr gigs $35 to $500 (median $188), productized
          services $95 to $3,179 (median $1,114), published agency rate
          cards $1,650 to $15,000.
        </li>
        <li>
          Agency blogs quote $3,000 to $75,000. Also true: sellers who
          publish prices are the cheap end of the market, and most agencies
          quote on request.
        </li>
        <li>
          Human turnaround runs 48 hours to 30 business days. AI tools are
          instant at $0 to $49 per month; agent-based audits start at $49
          one-time and return findings in minutes.
        </li>
        <li>
          No recent independent study proves audit ROI. NN/g&rsquo;s own
          self-reported numbers fell from 135% (2003) to 83%, and the
          &ldquo;$1 in UX returns $100&rdquo; Forrester stat is unverifiable.
        </li>
      </ShortVersion>

      <h2>How much does a UX audit cost by provider type?</h2>
      <p>
        Marketplace gigs run $35 to $500, productized services $95 to
        $3,179, and published agency rate cards $1,650 to $15,000 as of July
        2026. Here is the whole market in one table, with the agent tier
        included because that is where we sit and you deserve the comparison.
      </p>

      <TableWrap>
        <table>
          <thead>
            <tr>
              <th>Tier</th>
              <th>Advertised price</th>
              <th>Turnaround</th>
              <th>What you get</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                AI tools (
                <a
                  href="https://contentsquare.com/pricing/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contentsquare
                </a>
                ,{" "}
                <a
                  href="https://attentioninsight.com/pricing/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Attention Insight
                </a>
                )
              </td>
              <td>$0-$49/mo</td>
              <td>Instant</td>
              <td>Heatmaps, session replays, automated screenshot feedback</td>
            </tr>
            <tr>
              <td>Agent-based audit (ClapBack)</td>
              <td>From $49, one-time</td>
              <td>Minutes</td>
              <td>
                Ranked findings as Jira or Linear tickets: severity, cited
                rule, annotated screenshot, effort estimate
              </td>
            </tr>
            <tr>
              <td>
                Marketplace gigs (
                <a
                  href="https://www.fiverr.com/gigs/ux-audit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Fiverr
                </a>
                )
              </td>
              <td>$35-$500 · median $188</td>
              <td>Set per gig</td>
              <td>One reviewer&rsquo;s walkthrough, written or video notes</td>
            </tr>
            <tr>
              <td>
                Productized services (
                <a
                  href="https://www.roastd.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Roastd
                </a>
                ,{" "}
                <a
                  href="https://www.uxitt.com/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Uxitt
                </a>
                ,{" "}
                <a
                  href="https://checkmyux.com/pricing/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CheckMyUX
                </a>
                ,{" "}
                <a
                  href="https://oddit.co/collections/ux-audit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Oddit
                </a>
                )
              </td>
              <td>$95-$3,179 · median $1,114</td>
              <td>48 hrs to 30 business days</td>
              <td>
                Annotated report, Figma redesigns, top tiers add user tests
              </td>
            </tr>
            <tr>
              <td>
                Agency rate cards (
                <a
                  href="https://www.miquido.com/services/ux-audit/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Miquido
                </a>
                ,{" "}
                <a
                  href="https://www.scenicwest.co/services/ux-audit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Scenic West
                </a>
                )
              </td>
              <td>$1,650-$15,000</td>
              <td>1 to 6 weeks</td>
              <td>
                Heuristic evaluation or walkthrough, wireframes, user testing,
                competitor review
              </td>
            </tr>
          </tbody>
        </table>
      </TableWrap>

      <p>
        Methodology, since nobody else shows theirs: we counted every
        single-audit price published on a provider&rsquo;s own page or gig
        listing in July 2026. Euro prices converted at 1.10, Scenic
        West&rsquo;s $6,000 to $15,000 range entered at its midpoint, sale
        prices counted as advertised. Sort the 20 numbers and the middle
        lands at $500; strip out the Fiverr gigs and the professional median
        is $1,775.
      </p>
      <p>
        Two offers got cut, and the reasons matter to you as a buyer.
        Roastd&rsquo;s $2,500 unlimited-roasts year is a subscription, not a
        single audit. And{" "}
        <a
          href="https://www.convergine.com/services/ux-audit-services/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Convergine
        </a>{" "}
        advertises &ldquo;Complete UX Audit Services for $1,440&rdquo; in its
        page title while the same page&rsquo;s FAQ prices the full audit
        &ldquo;starting at $10,000.&rdquo; Contradictory numbers do not make
        the dataset. Read rate cards all the way down.
      </p>
      <p>
        What the spread buys is depth. At $35, one Fiverr seller walks your
        landing page and sends notes. At $500,{" "}
        <a
          href="https://www.uxitt.com/pricing"
          target="_blank"
          rel="noopener noreferrer"
        >
          Uxitt
        </a>{" "}
        analyzes a single page in depth and redesigns 1 or 2 sections in
        Figma. At $3,179,{" "}
        <a
          href="https://checkmyux.com/pricing/"
          target="_blank"
          rel="noopener noreferrer"
        >
          CheckMyUX&rsquo;s Deep Dive
        </a>{" "}
        covers your entire product with an accessibility review, 3 user tests
        of 10 participants each, up to 3 competitor reviews, up to 10
        wireframes, and a month of support. Same word, audit. Three different
        jobs.
      </p>
      <p>
        Now the caveat agency blogs skip: this is a survey of sellers who
        publish prices, and sellers who publish prices are the cheap end.
        Baymard and most large firms quote on request, so they are invisible
        to an advertised-price median. When agency blogs claim audits cost{" "}
        <a
          href="https://www.designstudiouiux.com/blog/ux-audit-cost/"
          target="_blank"
          rel="noopener noreferrer"
        >
          $3,000 to $25,000
        </a>{" "}
        or{" "}
        <a
          href="https://artversion.com/blog/what-does-a-ux-audit-cost/"
          target="_blank"
          rel="noopener noreferrer"
        >
          $10,000 to $75,000
        </a>
        , they are describing that hidden segment. Both numbers are true.
        They describe different markets.
      </p>

      <CostPicker />

      <h2>Why do agencies quote $10,000 for a UX audit?</h2>
      <p>
        Agencies price hours, not documents: published estimates budget
        roughly 50 hours for a focused audit and 200 or more for enterprise
        scope. That 50-hour figure is{" "}
        <a
          href="https://artversion.com/blog/what-does-a-ux-audit-cost/"
          target="_blank"
          rel="noopener noreferrer"
        >
          ArtVersion&rsquo;s own line item
        </a>
        : $10,000 to $15,000 buys about 50 hours, $20,000 to $35,000 buys 100
        to 175, and enterprise work starts at 200 hours. At{" "}
        <a
          href="https://www.trykrux.com/solutions/how-much-does-ux-audit-cost"
          target="_blank"
          rel="noopener noreferrer"
        >
          Krux&rsquo;s published agency bands
        </a>{" "}
        of $100 to $150 per hour ($200 to $400 for specialists), the math
        checks out. The price is labor, and the labor is real.
      </p>
      <p>
        <a
          href="https://www.miquido.com/services/ux-audit/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Miquido&rsquo;s rate card
        </a>{" "}
        shows the same coupling of method and money. An expert review runs
        about $1,650 and a week. A heuristic evaluation, about $3,300 and 2
        weeks. A cognitive walkthrough, about $7,150 and 3 to 6 weeks. More
        rigor, more hours, bigger invoice.
      </p>
      <p>
        The most expensive line item is testing with real humans. Recruiters
        charge{" "}
        <a
          href="https://measuringu.com/usability-cost/"
          target="_blank"
          rel="noopener noreferrer"
        >
          $100 to $300 per qualified participant
        </a>
        , and even a small moderated round with 5 users runs{" "}
        <a
          href="https://www.nngroup.com/articles/remote-usability-testing-costs/"
          target="_blank"
          rel="noopener noreferrer"
        >
          $415 to $1,680 out of pocket plus 32 to 48 researcher hours
        </a>
        , per NN/g. The incentive alone for an hour-long interview{" "}
        <a
          href="https://www.userinterviews.com/blog/research-incentives-report"
          target="_blank"
          rel="noopener noreferrer"
        >
          averages $85
        </a>
        .
      </p>

      <PullStat num="$12k+">
        What recruitment and honorariums alone cost for a 20-participant
        moderated usability study ($12,000 to $15,000), per{" "}
        <a
          href="https://measuringu.com/usability-cost/"
          target="_blank"
          rel="noopener noreferrer"
        >
          MeasuringU&rsquo;s cost breakdown
        </a>
        . Before a single hour of analysis.
      </PullStat>

      <Roast>
        A $15,000 audit is not an upsell on a $500 audit. It is a different
        product wearing the same name.
      </Roast>
      <Receipt>
        <a
          href="https://www.scenicwest.co/services/ux-audit"
          target="_blank"
          rel="noopener noreferrer"
        >
          Scenic West&rsquo;s $6,000 to $15,000 audit
        </a>{" "}
        includes unmoderated testing with 5 to 10 users, heatmap and
        session-recording analysis, and competitor review.{" "}
        <a
          href="https://baymard.com/ux-audit-services"
          target="_blank"
          rel="noopener noreferrer"
        >
          Baymard&rsquo;s full-site audit
        </a>{" "}
        is a 120+ page report over 17 to 25 business days with a public
        guarantee: positive ROI or the audit is free. If your question is
        &ldquo;why do users fail here&rdquo; rather than &ldquo;what is
        broken,&rdquo; that spend can be entirely rational.
      </Receipt>

      <h2>What are the hidden costs of a UX audit?</h2>
      <p>
        Your own hours and the calendar: human audits take 48 hours to 30
        business days, and someone still has to turn the report into work.
        The published turnarounds:
      </p>
      <ul>
        <li>
          <a
            href="https://www.roastd.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Roastd
          </a>
          : video review in 48 hours
        </li>
        <li>
          <a
            href="https://www.uxitt.com/pricing"
            target="_blank"
            rel="noopener noreferrer"
          >
            Uxitt
          </a>
          : 5 to 10 days
        </li>
        <li>
          <a
            href="https://checkmyux.com/pricing/"
            target="_blank"
            rel="noopener noreferrer"
          >
            CheckMyUX
          </a>
          : 7 to 30 business days by tier
        </li>
        <li>
          <a
            href="https://baymard.com/ux-audit-services"
            target="_blank"
            rel="noopener noreferrer"
          >
            Baymard
          </a>
          : 17 to 25 business days
        </li>
        <li>
          <a
            href="https://oddit.co/collections/ux-audit"
            target="_blank"
            rel="noopener noreferrer"
          >
            Oddit
          </a>
          : under 4 weeks, plus 2 to 4 more for implementation. Plan on 6 to
          8 weeks from purchase to shipped fixes.
        </li>
      </ul>
      <p>
        Your hours are the second invoice. You brief the auditor, provision
        test accounts, sit the kickoff and the walkthrough, then attend the
        findings call. CheckMyUX bundles a 1-hour findings call and up to a
        month of support into its top tier because handoff is genuinely work.
        And weigh the wait against your funnel: illustrative arithmetic, but
        if the leak you are auditing costs $1,000 a week, a 30-business-day
        turnaround bills you roughly $6,000 in lost conversions before the
        report even lands.
      </p>
      <p>
        The third cost is the quiet one. A 30-page PDF fixes nothing until
        someone converts it into tickets, sizes them, and defends them in
        sprint planning. The survival plan is in{" "}
        <Link href="/blog/ux-findings-to-jira-tickets">
          how to turn UX findings into tickets devs actually fix
        </Link>
        . And while you wait, the leak you bought the audit for keeps
        running.
      </p>

      <h2>Is a UX audit worth it?</h2>
      <p>
        The honest answer: the evidence is dated or vendor-sourced, so treat
        any precise ROI percentage on an audit sales page as marketing. Here
        is what actually exists.{" "}
        <a
          href="https://www.nngroup.com/articles/return-on-investment-for-usability/"
          target="_blank"
          rel="noopener noreferrer"
        >
          NN/g&rsquo;s classic ROI study
        </a>{" "}
        found usability KPIs improved 135% on average across 42
        before-and-after redesign pairs, but the data is 2003-era,
        self-submitted, and excludes 5 outliers. NN/g&rsquo;s{" "}
        <a
          href="https://www.nngroup.com/articles/usability-roi-declining-but-still-strong/"
          target="_blank"
          rel="noopener noreferrer"
        >
          own follow-up
        </a>{" "}
        reported the average falling to 83% and said so plainly. A vendor
        publishing its declining numbers is a vendor you can trust with a
        methodology.
      </p>
      <p>
        <a
          href="https://baymard.com/ux-audit-services"
          target="_blank"
          rel="noopener noreferrer"
        >
          Baymard
        </a>{" "}
        says clients implement 21 or more improvements per audit and backs it
        with a falsifiable public guarantee: positive ROI or the audit is
        free. Still a vendor claim, but one you can hold them to. Their
        broader{" "}
        <a
          href="https://baymard.com/research/checkout-usability"
          target="_blank"
          rel="noopener noreferrer"
        >
          checkout research
        </a>{" "}
        documents roughly 70% cart abandonment, and that is the honest case
        for audits in general: the problems are real even when the ROI
        slogans are not.
      </p>

      <Roast>
        &ldquo;Every $1 invested in UX returns $100.&rdquo; If an audit pitch
        opens with that stat, close the tab.
      </Roast>
      <Receipt>
        The line is attributed to Forrester in{" "}
        <a
          href="https://uxcrush.com/ux-roi-statistics"
          target="_blank"
          rel="noopener noreferrer"
        >
          hundreds of agency posts
        </a>
        , yet no publicly verifiable primary source exists. Chase the
        citation and it dead-ends in other blogs citing other blogs. We cite
        it here for exactly one purpose: to flag it.
      </Receipt>

      <p>
        The defensible math prices your problem, not the vendor&rsquo;s
        promise. Illustration with made-up numbers: say your product books
        $600,000 a year through a funnel converting at 3%. Each percentage
        point of conversion is worth roughly $200,000 a year, so a $500 audit
        needs to move almost nothing to pay off, and even a $15,000 one needs
        a fraction of a point. Run that arithmetic with your own revenue
        before reading anyone&rsquo;s pricing page, ours included.
      </p>

      <h2>Which UX audit should you buy at your stage?</h2>
      <p>
        Match the spend to the decision: $0 tools for triage, $49 agent
        audits for a ranked fix list, four figures for real user research.
        Even sellers admit fit beats price:{" "}
        <a
          href="https://www.letsgroto.com/blog/how-much-does-a-ux-audit-cost"
          target="_blank"
          rel="noopener noreferrer"
        >
          Groto&rsquo;s pricing guide
        </a>{" "}
        says a $2,500 freelancer with deep PLG SaaS experience &ldquo;will
        out-deliver a $15,000 generalist agency nine times out of ten.&rdquo;
        Full disclosure before the matrix: we sell the $49 tier at{" "}
        <Link href="/">ClapBack</Link>, so weight our take accordingly. And
        do not read what follows as agency-bashing. When the deliverable is
        research with real users, the agency tier is the only one that
        actually delivers it.
      </p>

      <Ticket
        id="BUY-1"
        sev="Minor"
        title="Pre-launch or pre-revenue: audit it yourself first"
        fields={[
          {
            label: "Evidence",
            value:
              "No traffic means no behavioral data, and every dollar is contested. Paying four figures to hear that your signup form is confusing is premature.",
          },
          {
            label: "Fix",
            value:
              "Run the founder checklist yourself, then a free AI pass (Roastd's instant audit, Contentsquare's free tier) for the blind spots.",
          },
          { label: "Effort", value: "⚡ An afternoon · $0" },
        ]}
      />

      <Ticket
        id="BUY-2"
        sev="Major"
        title="Live product, leaking users, nobody owns UX"
        fields={[
          {
            label: "Evidence",
            value:
              "Signups drop off, support keeps flagging the same confusion, and the fix list lives in nobody's head. You need ranked findings, not a strategy deck.",
          },
          {
            label: "Fix",
            value:
              "An agent-based audit. ClapBack uses your product like a real user and files every finding as a Jira or Linear ticket: severity, cited rule, annotated screenshot, effort estimate. It will not interview your customers or rethink your positioning; that is not what $49 buys anywhere.",
          },
          { label: "Effort", value: "⚡ Minutes · from $49, one-time" },
        ]}
      />

      <Ticket
        id="BUY-3"
        sev="Blocker"
        title="Revenue rides on one funnel and you need to know why humans fail"
        fields={[
          {
            label: "Evidence",
            value:
              "Heuristics predict problems; only watching real users explains yours. That research layer is the thing genuinely worth agency money.",
          },
          {
            label: "Fix",
            value:
              "A productized audit with user tests (CheckMyUX Standard, ~$1,595, includes a 10-participant test) or an agency engagement at $1,650 to $15,000. E-commerce at scale: Baymard, and take the ROI guarantee.",
          },
          { label: "Effort", value: "⚒ 2 to 6 weeks · four figures" },
        ]}
      />

      <p>
        Two of those paths have full write-ups: the DIY method is{" "}
        <Link href="/blog/founder-ux-audit-checklist">
          the founder&rsquo;s UX audit checklist
        </Link>
        , and if agent-based audits are new territory,{" "}
        <Link href="/blog/what-is-an-ai-ux-audit">
          what an AI UX audit is
        </Link>{" "}
        covers how the agent works and where it stops. Whatever tier you buy,
        insist on ticket-shaped output. An audit you can paste into Jira gets
        implemented; an audit you admire in Figma gets archived.
      </p>

      <Sources
        items={[
          {
            label: "Fiverr · UX audit gig listings",
            href: "https://www.fiverr.com/gigs/ux-audit",
          },
          {
            label: "Roastd · pricing",
            href: "https://www.roastd.io/",
          },
          {
            label: "Roastd · free AI audit tool",
            href: "https://www.roastd.io/website-audit-tool-free",
          },
          {
            label: "Uxitt · pricing",
            href: "https://www.uxitt.com/pricing",
          },
          {
            label: "CheckMyUX · pricing",
            href: "https://checkmyux.com/pricing/",
          },
          {
            label: "Oddit · UX audit",
            href: "https://oddit.co/collections/ux-audit",
          },
          {
            label: "Miquido · UX audit services",
            href: "https://www.miquido.com/services/ux-audit/",
          },
          {
            label:
              "Convergine · UX audit services (excluded: contradictory pricing)",
            href: "https://www.convergine.com/services/ux-audit-services/",
          },
          {
            label: "Scenic West · UX audit",
            href: "https://www.scenicwest.co/services/ux-audit",
          },
          {
            label: "Baymard Institute · UX audit services",
            href: "https://baymard.com/ux-audit-services",
          },
          {
            label: "Baymard Institute · checkout usability research",
            href: "https://baymard.com/research/checkout-usability",
          },
          {
            label: "ArtVersion · What does a UX audit cost",
            href: "https://artversion.com/blog/what-does-a-ux-audit-cost/",
          },
          {
            label: "DesignStudioUIUX · UX audit cost",
            href: "https://www.designstudiouiux.com/blog/ux-audit-cost/",
          },
          {
            label: "Krux · How much does a UX audit cost",
            href: "https://www.trykrux.com/solutions/how-much-does-ux-audit-cost",
          },
          {
            label: "Groto · How much does a UX audit cost",
            href: "https://www.letsgroto.com/blog/how-much-does-a-ux-audit-cost",
          },
          {
            label: "MeasuringU · How much does a usability test cost",
            href: "https://measuringu.com/usability-cost/",
          },
          {
            label: "NN/g · Remote usability-testing costs",
            href: "https://www.nngroup.com/articles/remote-usability-testing-costs/",
          },
          {
            label: "User Interviews · UX research incentives report",
            href: "https://www.userinterviews.com/blog/research-incentives-report",
          },
          {
            label: "NN/g · Return on investment for usability (2003)",
            href: "https://www.nngroup.com/articles/return-on-investment-for-usability/",
          },
          {
            label: "NN/g · Usability ROI declining, but still strong",
            href: "https://www.nngroup.com/articles/usability-roi-declining-but-still-strong/",
          },
          {
            label: "UX Crush · UX ROI statistics (cited to flag the $1:$100 claim)",
            href: "https://uxcrush.com/ux-roi-statistics",
          },
          {
            label: "Attention Insight · pricing",
            href: "https://attentioninsight.com/pricing/",
          },
          {
            label: "Contentsquare (Hotjar) · pricing",
            href: "https://contentsquare.com/pricing/",
          },
        ]}
      />
    </>
  );
}
