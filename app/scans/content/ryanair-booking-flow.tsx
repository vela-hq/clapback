import Link from "next/link";
import {
  Box,
  Chapter,
  Chart,
  Col,
  Concept,
  Footnotes,
  InlineCta,
  Ledger,
  NextScan,
  Prose,
  Question,
  RoastCard,
  ShortVersion,
  Shot,
  StatTiles,
  TwoUp,
  Wide,
} from "../../components/scan/ScanWidgets";
import { FlowMap } from "../../components/scan/scan.client";
import { getScan } from "../scans";
import styles from "../../components/scan/Scan.module.css";

const SHOT = (name: string) => `/scan/ryanair/${name}.webp`;

export default function Body() {
  const meta = getScan("ryanair-booking-flow")!;

  return (
    <>
      <Col>
        <Prose>
          <p className={styles.lede} style={{ marginTop: 40 }}>
            Ryanair advertised this flight at £19.99, and to their credit,
            £19.99 is exactly what the payment page asked for. The interesting
            distance is not between those two numbers. It sits between the
            search button and the pay button, and it is measured in refusals:
            every screen on the way holds something you have to say no to, and
            several of them ask twice.
          </p>
        </Prose>

        <Question>
          This scan answers one question: how hard is it to buy exactly the
          ticket you searched for?
        </Question>

        <ShortVersion>
          <li>
            The advertised price is honest. £19.99 in the results, £19.99 at
            checkout, itemized in between.
          </li>
          <li>
            Getting there took roughly 23 clicks and 13 explicit refusals, with
            four more refusals still waiting on the payment page.
          </li>
          <li>
            Declining a seat is a three click, two warning ordeal that quietly
            shrinks your check-in window from 60 days to 24 hours.
          </li>
          <li>
            Priority boarding is pitched three times. Insurance appears on four
            different surfaces.
          </li>
          <li>
            The marketing consent box comes pre-ticked, and the copy politely
            explains how to undo it.
          </li>
        </ShortVersion>
      </Col>

      <section className={styles.flowWrap}>
        <div className={styles.flowInner}>
          <h2 className={styles.h2} style={{ marginTop: 0 }}>
            The route, as flown
          </h2>
          <p className={styles.prose} style={{ maxWidth: 640 }}>
            Every screen between the homepage and the payment page. Dashed red
            loops are refusal detours: places where the funnel pauses until you
            decline something. Numbered badges count the findings filed against
            each stage. Click a stage to jump to its chapter.
          </p>
          <FlowMap
            nodes={meta.nodes}
            slug={meta.slug}
            caption="STN → DUB · one way · 1 adult · 20 Aug 2026 · cheapest path · walked 25 Jul 2026"
          />
          <div className={styles.flowLegend}>
            <span>
              <i className={styles.legendLine} />
              booking path
            </span>
            <span>
              <i className={`${styles.legendLine} ${styles.legendLineRef}`} />
              refusal detour
            </span>
            <span>
              <b className={styles.legendBadge}>n</b>
              findings at this stage
            </span>
          </div>
        </div>
      </section>

      {/* The counted ratios get the full width: they are the part built to be
          screenshotted on their own. */}
      <Wide>
        <StatTiles stats={meta.stats} />
      </Wide>

      {/* ---------------- Chapter 1 ---------------- */}
      <Col>
        <Chapter id="ch1" n="01">
          Three interruptions before hello
        </Chapter>
        <Prose>
          <p>
            The homepage opens with a cookie modal, a newsletter panel, and a
            login tooltip, all at once. The cookie modal deserves credit: a real
            &ldquo;No, thanks&rdquo; sits on the first layer, which is more than
            most airlines manage. One click and it is gone.
          </p>
          <p>
            The newsletter panel is another story. Its headline asks{" "}
            <strong>&ldquo;Why are you not subscribed?&rdquo;</strong>, which
            frames a default state as a personal failing, and it has no close
            control at all. It sits over the page content and stays there. The
            From field, meanwhile, had already guessed our departure airport
            from the IP address. That is the funnel&rsquo;s only guess made on
            your behalf that costs you nothing.
          </p>
        </Prose>

        <Shot
          src={SHOT("homepage")}
          alt="Ryanair homepage with a newsletter panel that has no close button"
          url="ryanair.com/gb/en"
          pins={[
            {
              n: 1,
              left: "88%",
              top: "64%",
              note: "No close button anywhere on the panel. It outlives the cookie modal and follows the page.",
            },
            {
              n: 2,
              left: "14%",
              top: "28%",
              note: "The From field pre-filled from geolocation before any interaction.",
            },
          ]}
        />

        <Concept
          name="Nagging"
          href="https://www.deceptive.design/types/nagging"
          linkLabel="deceptive.design/nagging"
        >
          An interface repeatedly interrupts the user&rsquo;s task with requests
          that serve the business, wearing consent down through friction. The
          deciding detail here is the missing close control: a request you
          cannot decline stops being a request.
        </Concept>

        <RoastCard
          sev="Major"
          category="Dark pattern · Nagging"
          title="The newsletter popup asks why you are not subscribed and then refuses to be closed."
          why="There is no dismiss control. The panel overlaps content at every scroll position, and the headline treats not subscribing as a defect the visitor should explain."
          fix="Add a close button, cap the panel at one appearance per session, and let the headline sell a benefit rather than assign guilt."
          effort="Quick win"
          refHref="https://www.deceptive.design/types/nagging"
          refLabel="Pattern reference"
        />

        <Prose>
          <p>
            One more toll before the search runs. The search widget carries an
            unticked checkbox agreeing to the Website Terms of Use, and the
            Search button will not fire until it is ticked. Nothing has been
            bought at this point. Nothing has even been chosen. The flow is
            collecting an agreement in exchange for showing you prices.
          </p>
        </Prose>
      </Col>

      {/* ---------------- Chapter 2 ---------------- */}
      <Col>
        <Chapter id="ch2" n="02">
          The fare wall and the double ask
        </Chapter>
        <Prose>
          <p>
            The results page lists eight flights to Dublin, and seven of them
            are running out. &ldquo;3 seats left at this price&rdquo; sits
            beside almost every departure, which is the problem: a scarcity cue
            attached to nearly everything stops carrying information and starts
            being wallpaper. The fare calendar above it does the opposite, and
            volunteers that two nearby days are a pound cheaper.
          </p>
        </Prose>

        <Shot
          src={SHOT("results")}
          alt="Ryanair results list with scarcity badges on almost every flight"
          url="ryanair.com/gb/en/trip/flights/select"
          pins={[
            {
              n: 1,
              left: "83%",
              top: "80%",
              note: "\"3 seats left at this price\", carried by 7 of the 8 flights on the page.",
            },
            {
              n: 2,
              left: "25%",
              top: "48%",
              note: "The fare calendar offers up cheaper adjacent days without being asked. Credit where it is due.",
            },
          ]}
        />

        <RoastCard
          sev="Major"
          category="Scarcity · credibility"
          title="Seven of eight flights are down to their last three seats."
          why="A scarcity badge is a signal, and a signal applied to almost every row carries no information. Readers who notice the pattern discount every urgency cue on the site, including the ones that are true."
          fix="Show remaining inventory only where it is genuinely low, and show the actual number. If it cannot be shown honestly at that granularity, drop the badge."
          effort="Quick win"
          refHref="https://www.deceptive.design/types/false-urgency"
          refLabel="Pattern reference"
        />

        <Prose>
          <p>
            Pick the £19.99 flight and a wall of four bundles appears. Basic
            keeps the advertised price. Flexi Plus costs £95.48 on top of it,
            4.8 times the fare, and its main job in the lineup is to make the
            middle options look reasonable. A banner above the grid declares
            that Plus is &ldquo;IDEAL FOR YOUR TRIP TO DUBLIN&rdquo;, a claim
            the page makes to everyone flying to Dublin.
          </p>
        </Prose>

        <Shot
          src={SHOT("fare-wall")}
          alt="Ryanair fare tier wall with a steering banner above the Plus bundle"
          url="ryanair.com/gb/en/trip/flights/select"
          pins={[
            {
              n: 1,
              left: "60%",
              top: "76%",
              note: "\"Ideal for your trip to Dublin\", personalised to everyone who is flying to Dublin.",
            },
            {
              n: 2,
              left: "80%",
              top: "66%",
              note: "The advertised fare is still here, still £19.99, in the quietest button on the screen.",
            },
          ]}
        />

        <Chart
          title="What each bundle adds to a £19.99 fare"
          sub="STN → DUB, one leg, as offered on 25 Jul 2026"
          rows={[
            { label: "Basic (the ticket)", width: "14%", value: "£0", kind: "base" },
            { label: "Regular", width: "27%", value: "+£26.49", kind: "up" },
            { label: "Flexi Plus", width: "92%", value: "+£95.48", kind: "up" },
          ]}
          note="Bar length is the add-on price. Blue marks what was advertised, red marks what the wall would like instead. Plus sits between the two and is not charted: we recorded its benefits on the day but not its exact price."
        />

        <Prose>
          <p>
            Decline all of it and the flow does not accept the answer. A full
            screen modal reopens the question, restyled: your chosen fare
            becomes a column of red crosses, the upgrade gets a photo of a
            contented man stowing his bag, a &ldquo;Recommended&rdquo; badge,
            and the only yellow button on the screen. The price difference is
            introduced with the word &ldquo;just&rdquo;.
          </p>
        </Prose>

        <Shot
          src={SHOT("upsell-modal")}
          alt="Full screen upsell modal shown after choosing the Basic fare"
          url="ryanair.com/gb/en/trip/flights/select · modal"
          pins={[
            {
              n: 1,
              left: "53%",
              top: "64%",
              note: "The fare you already chose, redrawn as a list of losses.",
            },
            {
              n: 2,
              left: "67%",
              top: "25%",
              note: "\"Recommended\", with the aspirational photo on the paid side only.",
            },
            {
              n: 3,
              left: "63%",
              top: "89%",
              note: "Yellow for the upgrade, an outline for your original decision, and \"just £26.49 more\" doing quiet work between them.",
            },
          ]}
        />

        <Concept
          name="Anchoring, then visual steering"
          href="https://lawsofux.com/von-restorff-effect/"
          linkLabel="lawsofux.com"
        >
          The £95.48 bundle anchors the scale so the £26.49 one reads as
          modest. Once you decline, contrast takes over: colour, photography and
          badge all point at the paid option while your actual choice is drawn
          to recede. The decision was already made. The modal exists to un-make
          it.
        </Concept>

        <RoastCard
          sev="Major"
          category="Von Restorff effect · visual steering"
          title="Decline Basic and a modal repaints your £19.99 choice as three red crosses under a happier man."
          why="A settled decision is reopened at full screen, with loss framing on the chosen fare and every salient visual cue assigned to the upgrade. One decision now costs two refusals."
          fix="If a fare genuinely needs confirmation, confirm it once, with both options carrying equal visual weight and the differences stated without crosses or minimisers."
          effort="Deep fix"
          refHref="https://lawsofux.com/von-restorff-effect/"
          refLabel="Von Restorff effect"
        />

        <InlineCta
          label="The uncomfortable part"
          title="Every pattern in this chapter has a well-meaning version living in your checkout."
          body="A confirm step that reopens a settled choice. A recommended plan with better art than the one people pick. An urgency badge on every row. They rarely arrive as decisions; they accumulate. Point our agent at your funnel and it walks the whole thing cold, the way this walk was done, and tells you which ones you shipped."
          cta="Roast my funnel →"
          hint="Free first roast. No install."
          where="scan_ch2"
        />
      </Col>

      {/* ---------------- Chapter 3 ---------------- */}
      <Col>
        <Chapter id="ch3" n="03">
          Saying no to a seat, twice
        </Chapter>
        <Prose>
          <p>
            The seat map opens with a seat already picked out for you: 18C,
            £8.50, labelled with your own initials. Beside it, in the panel
            selling the recommendation, is a line worth remembering for the next
            screen: check-in opens 60 days before departure.
          </p>
        </Prose>

        <Shot
          src={SHOT("seat-map")}
          alt="Ryanair seat map with a recommended seat already assigned to the passenger"
          url="ryanair.com/gb/en/trip/flights/seats"
          pins={[
            {
              n: 1,
              left: "82%",
              top: "71%",
              note: "Seat 18C, £8.50, pre-assigned and tagged with the passenger's initials before anyone asked for a seat.",
            },
            {
              n: 2,
              left: "72%",
              top: "53%",
              note: "\"Check-in 60 days pre-departure\", sold here as a benefit of paying. Hold on to this number.",
            },
          ]}
        />

        <Prose>
          <p>
            Choose &ldquo;Select seats later&rdquo; and a warning screen arrives
            with four stacked appeals: you may get a middle seat, availability
            is shrinking, prices rise, and, the only one with teeth, your
            check-in window collapses from those 60 days to 24 hours before the
            flight. That last item is a functional penalty for not paying,
            dressed as advice.
          </p>
          <p>
            Oddly, this first screen still gives the decline the big yellow
            button. Hold your ground and a second screen arrives to fix that: a
            photo of an empty cabin, your consequences re-listed, a yellow
            &ldquo;Select seats now&rdquo;, and your actual decision reduced to
            a small text link underneath.
          </p>
        </Prose>
      </Col>

      <Wide>
        <TwoUp>
          <Shot
            bare
            src={SHOT("seat-warning-1")}
            alt="First seat warning screen with four reasons to buy a seat"
            url="…/trip/flights/seats · warning 1 of 2"
            pins={[
              {
                n: 1,
                left: "50%",
                top: "47%",
                note: "60 days has become 24 hours. Refusing the upsell changes what the product does for you.",
              },
              {
                n: 2,
                left: "82%",
                top: "88%",
                note: "Screen one still lets you leave through the big yellow door.",
              },
            ]}
          />
          <Shot
            bare
            src={SHOT("seat-warning-2")}
            alt="Second seat warning modal demoting the decline to a text link"
            url="…/trip/flights/seats · warning 2 of 2"
            pins={[
              {
                n: 1,
                left: "50%",
                top: "81%",
                note: "The re-ask keeps the yellow button.",
              },
              {
                n: 2,
                left: "50%",
                top: "87%",
                note: "Your decision, now a text link.",
              },
            ]}
          />
        </TwoUp>
      </Wide>

      <Col>
        <Chart
          title="Clicks to resolve the seat question"
          sub="Same decision, opposite answers"
          rows={[
            {
              label: "Take the recommended seat",
              width: "22%",
              value: "1 click",
              kind: "base",
            },
            {
              label: "Refuse a seat",
              width: "66%",
              value: "3 clicks · 2 warnings",
              kind: "up",
            },
          ]}
          note="Counted on the 25 Jul 2026 walk. Counting rules in the footnotes."
        />

        <Concept
          name="Loss aversion, with a real penalty attached"
          href="https://www.deceptive.design/types/obstruction"
          linkLabel="deceptive.design/obstruction"
        >
          People weigh losses more heavily than gains, so the screens speak
          entirely in losses: the middle seat, the vanishing availability, the
          rising price. Persuasion is fair game. The line is crossed where
          refusal gets a built-in punishment: the 24 hour check-in window is a
          designed consequence, and it converts a sales pitch into leverage.
        </Concept>

        <RoastCard
          sev="Blocker"
          category="Dark pattern · Obstruction"
          title="Skipping an £8.50 seat takes two warning screens and shrinks check-in from 60 days to 24 hours."
          why="Two consecutive interstitials re-litigate one decision, and the second inverts the button hierarchy so the refusal reads like a mistake. The lasting cost is functional: without a paid seat you cannot check in until the day before the flight."
          fix="One confirmation at most, equal-weight buttons, and a check-in window that does not depend on buying a seat."
          effort="Deep fix"
          refHref="https://www.deceptive.design/types/obstruction"
          refLabel="Pattern reference"
        />
      </Col>

      {/* ---------------- Chapter 4 ---------------- */}
      <Col>
        <Chapter id="ch4" n="04">
          A mandatory choice, and the government&rsquo;s advice
        </Chapter>
        <Prose>
          <p>
            Bags open with a label reading &ldquo;Mandatory selection&rdquo;.
            The free small bag that came with the fare and a £17.99 priority
            bundle are presented as one radio pair with no default, so the ticket
            cannot progress until the paid option has been read and rejected.
            Below the pair sits a warning that a second bag at the gate costs up
            to €75, and below that, a check-in bag ladder from £17.99 to £40.49
            with the middle rung labelled &ldquo;Cheapest time to buy&rdquo;.
          </p>
        </Prose>

        <Shot
          src={SHOT("bags")}
          alt="Ryanair bags step with a mandatory radio choice between the included bag and a paid bundle"
          url="ryanair.com/gb/en/trip/flights/bags"
          pins={[
            {
              n: 1,
              left: "31%",
              top: "62%",
              note: "The bag you already paid for, demoted to one half of a compulsory question.",
            },
            {
              n: 2,
              left: "68%",
              top: "62%",
              note: "The £17.99 upsell, sharing the same row and the same visual weight as the included option.",
            },
            {
              n: 3,
              left: "27%",
              top: "50%",
              note: "A €75 gate fee, quoted while you decide. The extras are sold against a penalty, not a benefit.",
            },
          ]}
        />

        <RoastCard
          sev="Major"
          category="Forced action · pricing"
          title="What you already own is put on a ballot against a £17.99 upgrade, and the flow stops until you vote."
          why="No default is set, so continuing requires an explicit selection. The included bag and the paid bundle are given the same weight, which turns an entitlement into an offer and guarantees the upsell a read."
          fix="Default to what the fare includes and let the upgrade sit beside it as an option. A step nobody needs to touch is a step nobody abandons."
          effort="Quick win"
          refHref="https://www.deceptive.design/types/forced-action"
          refLabel="Pattern reference"
        />

        <Prose>
          <p>
            Two more pages follow, both labelled Extras. The first opens with
            Security Fast Track at £9.49 and then reaches for a bigger lever. A
            three tier insurance grid, £11.67 to £28.18, is introduced by the
            line &ldquo;The UK Government advises that all citizens travelling
            to the EU purchase travel insurance&rdquo;. The underlying advice is
            real. Its placement is not advice, it is a sales headline wearing a
            government&rsquo;s voice, sat directly above three products Ryanair
            earns a commission on. A second sub-page sells transport. Neither
            page can be skipped, only continued through.
          </p>
        </Prose>

        <Shot
          src={SHOT("extras-insurance")}
          alt="Ryanair extras page with Fast Track and a government advisory above the insurance products"
          url="ryanair.com/gb/en/trip/flights/extras"
          pins={[
            {
              n: 1,
              left: "75%",
              top: "68%",
              note: "Fast Track, £9.49 per person, badged Price Match and Crowd Free.",
            },
            {
              n: 2,
              left: "40%",
              top: "95%",
              note: "\"The UK Government advises…\", positioned as the opening line of the insurance pitch.",
            },
          ]}
        />

        <Concept
          name="Authority bias"
          href="https://lawsofux.com/"
          linkLabel="lawsofux.com"
        >
          People defer to a source they read as official, and the deference
          transfers to whatever sits next to it. Quoting a government advisory
          is accurate here and still does the work of a sales claim, because the
          reader is not being asked to consider insurance in general. They are
          being asked to buy this one, from this page, now.
        </Concept>

        <RoastCard
          sev="Major"
          category="Authority appeal"
          title="Travel insurance is sold under a headline borrowed from the UK Government."
          why="A genuine public advisory is placed as the lead line of a commercial pitch, lending official weight to a specific paid product and blurring the line between guidance and inventory."
          fix="Keep the advisory, and separate it from the sale. State the advice neutrally, note that cover can be bought anywhere, and let the product stand on its price and terms."
          effort="Quick win"
          refHref="https://www.deceptive.design/types/misdirection"
          refLabel="Pattern reference"
        />

        <InlineCta
          label="What this took"
          title="Thirteen refusals is a number, and getting it took a person, a browser, and an hour."
          body="Counting friction by hand does not scale, which is the reason ClapBack exists. The agent walks your signup, your checkout, your onboarding, and files what fights the user as tickets with severity, evidence and a fix. Same method as this page, minutes instead of an afternoon."
          cta="Get my free roast →"
          hint="From $49 after the free one."
          where="scan_ch4"
        />
      </Col>

      {/* ---------------- Chapter 5 ---------------- */}
      <Col>
        <Chapter id="ch5" n="05">
          The payment page pile-up
        </Chapter>
        <Prose>
          <p>
            The final screen holds the price at an honest £19.99 and surrounds
            it with everything the funnel has not managed to sell yet. Priority
            boarding returns for a third attempt, now labelled &ldquo;Last
            chance to buy at this price&rdquo;. Insurance makes its fourth
            appearance with paired opt-in and opt-out checkboxes that force an
            explicit decision either way. Your own flight details by SMS cost
            £2.99. A mobile number is mandatory. And while we were reading, the
            login modal reopened by itself, this time with three single sign-on
            buttons.
          </p>
          <p>
            One checkbox arrived filled in. The marketing consent box is
            pre-ticked, and the adjacent copy explains that if you do not wish
            to receive offers, you should uncheck it. Ryanair made the choice;
            the interface teaches you how to reverse it.
          </p>
        </Prose>

        <Shot
          src={SHOT("payment")}
          alt="Ryanair payment page with a pre-ticked marketing checkbox and a login modal reopening over it"
          url="ryanair.com/gb/en/payment"
          pins={[
            {
              n: 1,
              left: "12%",
              top: "41%",
              note: "The consent box, ticked before you have typed a thing, visible behind the modal.",
            },
            {
              n: 2,
              left: "36%",
              top: "13%",
              note: "The account ask returns on its own at checkout, now with Google, Facebook and PayPal.",
            },
          ]}
        />

        <Box label="Still to refuse before Pay Now">
          <li>Untick the pre-checked marketing consent</li>
          <li>Decline flight details by SMS for £2.99</li>
          <li>
            Decline the &ldquo;last chance&rdquo; priority boarding, pitch
            number three
          </li>
          <li>Tick the insurance opt-out, surface number four</li>
        </Box>

        <Concept
          name="The default effect"
          href="https://www.deceptive.design/types/preselection"
          linkLabel="deceptive.design/preselection"
        >
          Whatever state a control starts in tends to survive: defaults read as
          recommendations, and changing them costs attention that checkout pages
          are designed to exhaust. A pre-ticked consent box converts that
          inertia directly into a mailing list. The EU Court of Justice ruled in
          Planet49 that consent gathered this way is not valid consent.
        </Concept>

        <RoastCard
          sev="Blocker"
          category="Dark pattern · Preselection"
          title="The marketing checkbox arrives pre-ticked and the copy explains how to undo Ryanair's choice for you."
          why="Consent is captured by default on a page engineered to deplete attention, with the burden of reversal placed on the customer mid-purchase."
          fix="Ship the box unticked. If the newsletter is worth joining, one honest sentence will outperform a default."
          effort="Quick win"
          refHref="https://www.deceptive.design/types/preselection"
          refLabel="Pattern reference"
        />

        <Prose>
          <p>
            One line runs along the bottom of every page in the funnel,
            including this one: a card payment processing fee may apply, and it
            will be reflected in the total once the card number has been
            entered. We stopped at the payment page and never entered a card, so
            we cannot tell you what that fee is. The total we can vouch for is
            £19.99, and it is £19.99 right up to the last field we were willing
            to fill in.
          </p>
        </Prose>
      </Col>

      {/* ---------------- Ledger + verdict ---------------- */}
      <Col>
        <h2 className={styles.h2}>What Ryanair gets right</h2>
        <Prose>
          <p>
            A scan that only collects sins is a listicle. The ledger below is
            part of the method, and on this walk it is not empty.
          </p>
        </Prose>

        <Ledger
          title="The honesty ledger"
          sub="Recorded on the same walk, same rules"
          items={[
            "Price integrity held: £19.99 advertised, £19.99 at checkout, every decline respected in the total.",
            "The cookie modal offers \"No, thanks\" on the first layer, no second screen required.",
            "The old forced signup is gone: \"Log in later\" carries a guest all the way to the payment page.",
            "The fare calendar shows cheaper adjacent days without being asked.",
            "The price breakdown itemises everything, including the small bag, listed as included.",
          ]}
        />

        <h2 className={styles.h2}>Verdict</h2>
        <Prose>
          <p>
            Is it hard to buy the ticket you searched for? Mechanically, no. The
            funnel is fast, the price never moved, and each refusal is
            individually small. What Ryanair charges for a £19.99 ticket is
            attention: thirteen refusals, two of them repeats of decisions
            already made, one backed by a genuine penalty. Most of the patterns
            here are ordinary retail persuasion executed loudly. Two cross into
            territory regulators have already named: consent by default, and
            refusal made costlier than acceptance.
          </p>
          <p>
            We would hedge one thing. This was a single walk, on one route, on
            one day, as a guest. Ryanair runs experiments constantly, and your
            gauntlet may be arranged differently. The number that will not
            change by cohort: a booking flow where saying no three times to one
            seat is the designed path.
          </p>
          <p>
            Twenty-two findings came out of this walk. Eight of them are on this
            page, chosen because they carry the argument. The rest are the long
            tail every real audit produces, and they are the reason{" "}
            <Link href="/blog/ux-findings-to-jira-tickets">
              findings need to arrive as tickets
            </Link>{" "}
            rather than as a document nobody opens twice.
          </p>
        </Prose>

        <Footnotes
          items={[
            "Walked 25 July 2026, roughly 04:50 to 05:15 UTC, on ryanair.com/gb/en. Route STN to DUB, one way, one adult, 20 August 2026, cheapest available path with every optional purchase declined.",
            "Click counts are provisional: a click is one deliberate pointer action on a control, keystrokes counted separately, and only the quickest correct route counted. A refusal is any interaction whose sole purpose is declining a purchase, an upgrade, or an account.",
            "Environment: Chromium 149, fresh profile, no stored cookies, English locale, desktop viewport 1440px wide. One human-driven walk assisted by browser tooling; every screenshot comes from that session, unedited apart from resizing.",
            "Nothing was purchased, no account was created, no payment fields were touched. The walk stopped at the payment page.",
            "Cookie consent was declined, so all observations reflect the no-tracking cohort.",
            "Prices are as displayed on the day, in the currency the GB site quoted. Some fees are quoted by Ryanair in euros and are reproduced that way.",
            "Screens change. Ryanair tests continuously, and this page records one arrangement on one day. We date every image so a future walk can be compared against this one.",
            "ClapBack builds an automated scanner that will run this method continuously. This first scan was performed by hand to establish the ground truth the automated version gets measured against.",
          ]}
        />

        <NextScan number="No. 002" title="Planet Fitness: two minutes to join, one certified letter to leave">
          We map the signup flow against the cancellation flow as a single
          graph. The asymmetry is the whole story.
        </NextScan>
      </Col>
    </>
  );
}
