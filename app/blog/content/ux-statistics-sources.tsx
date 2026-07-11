import Link from "next/link";
import {
  ShortVersion,
  Roast,
  Receipt,
  PullStat,
  Sources,
} from "../../components/blog/Widgets";
import StatLedger from "./ux-statistics-sources.client";

export default function Body() {
  return (
    <>
      <p>
        We traced 17 of the most-quoted UX statistics back to their primary
        sources. Five have no source at all, five say something meaningfully
        different from what gets repeated, and the survivors come with
        conditions their fans never mention.
      </p>
      <p>
        If you have ever put &ldquo;every $1 in UX returns $100&rdquo; in a
        slide, this page is going to hurt a little. It hurt us too. The whole
        premise of <Link href="/">ClapBack</Link> is that UX claims should
        come with receipts, so we applied the standard to our own
        industry&rsquo;s favorite numbers: for each statistic we followed the
        citation chain to the earliest findable document, read it, and
        compared what it says to what gets quoted.
      </p>

      <ShortVersion>
        <li>
          Of 17 famous UX statistics, 6 are verified (most with real caveats),
          5 are distorted versions of real findings, 5 are untraceable, and 1
          is simply outdated.
        </li>
        <li>
          The $1-to-$100 &ldquo;Forrester&rdquo; ROI stat has no Forrester
          report behind it. Its earliest findable instance is a 2015 Forbes
          Council post by a UX-agency CEO.
        </li>
        <li>
          The famous &ldquo;Stanford&rdquo; 75%-judge-by-design figure appears
          in no Stanford publication. The real number is 46.1% of participant
          comments.
        </li>
        <li>
          Every verdict below links the primary source, and every surviving
          stat has a copy-ready citation that will hold up when someone checks.
        </li>
      </ShortVersion>

      <h2>How UX statistics go bad</h2>
      <p>
        Almost every broken stat in our sample failed the same way: a real,
        narrow finding got its conditions filed off. A 2010 survey about slow
        pages becomes a law about &ldquo;bad experiences.&rdquo; A
        content-analysis of 15 women rejecting health websites becomes
        &ldquo;94% of first impressions are design-related.&rdquo; A
        marketing rule of thumb on a 2001 IBM web page becomes
        &ldquo;research&rdquo; and then, two decades later, mutates into a
        Forrester attribution nobody can produce.
      </p>
      <Roast>
        UX has a replication crisis it outsourced to listicles. The same tired
        numbers circle the industry like luggage nobody claims.
      </Roast>
      <Receipt>
        The mechanism is citogenesis: listicles cite listicles, which cite a
        blog post, which cites nothing. In our tracing, the most common
        terminal node was a marketing page or a contributed post, not a study.
        Where a real paper existed, the popular version usually misstated its
        scope, its metric, or its year.
      </Receipt>

      <h2>The three worst offenders</h2>
      <h3>&ldquo;Every $1 invested in UX returns $100&rdquo;</h3>
      <p>
        The most-quoted number in UX has no study behind it. The earliest
        instance we could find is a{" "}
        <a
          href="https://www.forbes.com/sites/forbestechcouncil/2015/11/19/good-ux-is-good-business-how-to-reap-its-benefits/"
          target="_blank"
          rel="noopener noreferrer"
        >
          2015 Forbes Technology Council post
        </a>{" "}
        written by the CEO of a UX agency, asserting the figure with no link
        and Forrester spelled &ldquo;Forester.&rdquo; No Forrester report
        containing it has ever surfaced. The likely ancestor: IBM&rsquo;s 2001
        &ldquo;Cost Justifying Ease of Use&rdquo; page, which we recovered
        from the{" "}
        <a
          href="https://web.archive.org/web/20010410125659/http://www-3.ibm.com/ibm/easy/eou_ext.nsf/Publish/23"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wayback Machine
        </a>
        . It offers &ldquo;every dollar invested in ease of use returns $10 to
        $100&rdquo; and labels it, in its own words, a rule of thumb.
      </p>
      <h3>&ldquo;75% judge credibility by design (Stanford)&rdquo;</h3>
      <p>
        Stanford&rsquo;s credibility research is real and worth citing. In{" "}
        <a
          href="https://dl.acm.org/doi/10.1145/997078.997097"
          target="_blank"
          rel="noopener noreferrer"
        >
          Fogg et al.&rsquo;s study of 2,684 participants
        </a>
        , &ldquo;design look&rdquo; was the single most-mentioned factor in
        credibility judgments. The actual number: 46.1% of participants&rsquo;
        comments. The 75% version appears in no Stanford publication we could
        locate; it lives exclusively in agency blogs that cite each other.
        Somewhere between 2003 and now, 46.1% of comments became 75% of users,
        and nobody checked.
      </p>
      <h3>&ldquo;Fixing a bug after release costs 100x more&rdquo;</h3>
      <p>
        The chart everyone screenshots attributes this to the &ldquo;IBM
        Systems Sciences Institute,&rdquo; which was an internal IBM training
        program, not a research body, and which published no such study.
        Laurent Bossavit chased every branch of the citation tree for his book
        on software engineering folklore, and{" "}
        <a
          href="https://www.theregister.com/2021/07/22/bugs_expense_bs/"
          target="_blank"
          rel="noopener noreferrer"
        >
          The Register covered the debunk in 2021
        </a>
        . Later-is-costlier is directionally supported by Boehm&rsquo;s 1981
        project data. The tidy 100x constant is folklore.
      </p>

      <PullStat num="5 / 17">
        of the most-quoted UX statistics have no traceable source at all. Not
        an old source, not a weak source: none. Verdicts and citation chains
        for every stat are in the ledger below.
      </PullStat>

      <h2>The ledger: every stat, every verdict</h2>
      <p>
        Filter by verdict. Open any row for what the primary source actually
        says, the link to it, and a copy-ready citation for the versions that
        survive scrutiny. Where we write &ldquo;do not cite,&rdquo; we mean
        it: there is nothing at the end of that chain.
      </p>
      <StatLedger />

      <h2>How to cite UX statistics without embarrassing yourself</h2>
      <p>
        Four habits cover almost every failure in the ledger. They are also
        exactly what we require of our own product&rsquo;s findings, so we can
        confirm they survive contact with skeptical engineers.
      </p>
      <ul>
        <li>
          <strong>Name the source and the year, inline.</strong>{" "}
          &ldquo;Baymard&rsquo;s 2025 survey&rdquo; can be checked in ten
          seconds. &ldquo;Studies show&rdquo; is how a 2010 page-speed survey
          spends 16 years impersonating a UX law.
        </li>
        <li>
          <strong>Quote the metric the study measured,</strong> not the one
          you wish it measured. Visual appeal in 50ms is not &ldquo;opinions
          form in 50ms.&rdquo; Comments about rejected health sites are not
          &ldquo;first impressions.&rdquo;
        </li>
        <li>
          <strong>Check whether the number is alive.</strong> Baymard and
          WebAIM update their figures; quoting the 2023 snapshot in 2026 is a
          soft lie with a hard source. The current numbers: 70.22% cart
          abandonment, 83.9% low-contrast homepages.
        </li>
        <li>
          <strong>Anecdotes are fine when labeled.</strong> Patrick
          McKenzie&rsquo;s 40-to-60% one-and-done trial users is honest,
          useful, and openly an operator&rsquo;s estimate. It only becomes a
          problem when it gets promoted to &ldquo;research.&rdquo;
        </li>
      </ul>
      <p>
        If you need the numbers for a signup-flow argument specifically, we
        assembled the surviving ones (with their conditions attached) in{" "}
        <Link href="/blog/why-users-abandon-signup">
          why users abandon your signup flow
        </Link>
        . And when someone sends you a deck with the $100 ROI stat in it, send
        them here. We&rsquo;ll keep the ledger current.
      </p>

      <Sources
        items={[
          {
            label: "Forbes Council post, 2015 (earliest $1:$100 instance)",
            href: "https://www.forbes.com/sites/forbestechcouncil/2015/11/19/good-ux-is-good-business-how-to-reap-its-benefits/",
          },
          {
            label: "IBM · Cost Justifying Ease of Use, 2001 (Wayback Machine)",
            href: "https://web.archive.org/web/20010410125659/http://www-3.ibm.com/ibm/easy/eou_ext.nsf/Publish/23",
          },
          {
            label: "Forrester blog · Leaving User Experience to Chance (2009)",
            href: "https://www.forrester.com/blogs/09-10-15-leaving_user_experience_to_chance_hurts_companies/",
          },
          {
            label: "Gomez · Why Web Performance Matters (2010, PDF)",
            href: "https://montereypremier.com/wp-content/uploads/2019/10/201110_why_web_performance_matters.pdf",
          },
          {
            label: "Lindgaard et al. · 50ms first impressions (2006)",
            href: "https://www.tandfonline.com/doi/abs/10.1080/01449290500330448",
          },
          {
            label: "Sillence et al. · Trust and mistrust of online health sites (CHI 2004)",
            href: "https://dl.acm.org/doi/10.1145/985692.985776",
          },
          {
            label: "Fogg et al. · How Do Users Evaluate Web Site Credibility? (2003)",
            href: "https://dl.acm.org/doi/10.1145/997078.997097",
          },
          {
            label: "NN/g · How Little Do Users Read? (2008)",
            href: "https://www.nngroup.com/articles/how-little-do-users-read/",
          },
          {
            label: "NN/g · Why You Only Need to Test with 5 Users (2000)",
            href: "https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/",
          },
          {
            label: "Baymard · Cart abandonment statistics (live)",
            href: "https://baymard.com/lists/cart-abandonment-rate",
          },
          {
            label: "WebAIM Million (current edition)",
            href: "https://webaim.org/projects/million/",
          },
          {
            label: "The Register · The 100x bug-cost study might not exist (2021)",
            href: "https://www.theregister.com/2021/07/22/bugs_expense_bs/",
          },
          {
            label: "Quettra mobile retention data via Andrew Chen (2015)",
            href: "https://andrewchen.com/new-data-shows-why-losing-80-of-your-mobile-users-is-normal-and-that-the-best-apps-do-much-better/",
          },
          {
            label: "Intercom on Onboarding (McKenzie's 40-60% estimate)",
            href: "https://assets.ctfassets.net/xny2w179f4ki/4PQNPvvOxsGlGYYum4LIbM/13c80de059d4866837da972661f8cdaa/intercom-on-onboarding.pdf",
          },
        ]}
      />
    </>
  );
}
