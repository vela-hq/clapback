import type { ReactNode } from "react";
import { TrackedCta } from "./scan.client";
import styles from "./Scan.module.css";

/* Server-renderable building blocks for a product scan. The chapter rhythm is
   fixed: screenshot with pins, then the named concept, then the finding as a
   roast card. Everything here SSRs so a crawler reads the whole scan. */

export function Col({ children }: { children: ReactNode }) {
  return <div className={styles.col}>{children}</div>;
}

export function Wide({ children }: { children: ReactNode }) {
  return <div className={styles.wide}>{children}</div>;
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className={styles.prose}>{children}</div>;
}

export function Chapter({
  id,
  n,
  children,
}: {
  id: string;
  n: string;
  children: ReactNode;
}) {
  return (
    <h2 id={id} className={styles.h2}>
      <span className={styles.chNo}>{n}</span>
      {children}
    </h2>
  );
}

/** The question the scan exists to answer, stated once, up front. */
export function Question({ children }: { children: ReactNode }) {
  return <div className={styles.question}>{children}</div>;
}

export function ShortVersion({ children }: { children: ReactNode }) {
  return (
    <div className={styles.box} data-reveal>
      <p className={styles.boxLabel}>The short version</p>
      <ul>{children}</ul>
    </div>
  );
}

export function Box({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.box} data-reveal>
      <p className={styles.boxLabel}>{label}</p>
      <ul>{children}</ul>
    </div>
  );
}

export function StatTiles({
  stats,
}: {
  stats: { num: string; sup?: string; label: string }[];
}) {
  return (
    <div className={styles.stats} data-reveal>
      {stats.map((s) => (
        <div key={s.label} className={styles.stat}>
          <div className={styles.statNum}>
            {s.num}
            {s.sup && <sup>{s.sup}</sup>}
          </div>
          <div className={styles.statLabel}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/** A dated screenshot in browser chrome, with numbered pins and their notes.
    Pin positions are percentages of the image box, authored by eye against the
    captured file. */
export function Shot({
  src,
  alt,
  url,
  pins,
  bare = false,
}: {
  src: string;
  alt: string;
  url: string;
  pins: { n: number; left: string; top: string; note: string }[];
  /** Inside a two-up grid the figure supplies its own margin. */
  bare?: boolean;
}) {
  return (
    <figure className={styles.shot} style={bare ? { margin: 0 } : undefined}>
      <div className={styles.browser}>
        <div className={styles.browserBar}>
          <span className={styles.browserDot} />
          <span className={styles.browserDot} />
          <span className={styles.browserDot} />
          <span className={styles.browserUrl}>{url}</span>
        </div>
        <div className={styles.stage}>
          {/* Plain <img>: these are pre-sized WebP files committed to public/,
              and next/image would only add a proxy hop and a layout wrapper
              that the absolutely-positioned pins would have to fight. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} loading="lazy" width={1280} height={673} />
          {pins.map((p) => (
            <span
              key={p.n}
              className={styles.pin}
              style={{ left: p.left, top: p.top }}
              aria-hidden="true"
            >
              {p.n}
            </span>
          ))}
        </div>
      </div>
      <ul className={styles.notes}>
        {pins.map((p) => (
          <li key={p.n}>
            <b className={styles.noteNum}>{p.n}</b>
            <span>{p.note}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

export function TwoUp({ children }: { children: ReactNode }) {
  return (
    <div className={styles.twoUp} data-reveal>
      {children}
    </div>
  );
}

/** The named idea that explains what the screenshot just showed. */
export function Concept({
  name,
  href,
  linkLabel,
  children,
}: {
  name: string;
  href: string;
  linkLabel: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.concept} data-reveal>
      <p className={styles.conceptLabel}>The concept</p>
      <h3 className={styles.conceptName}>{name}</h3>
      <p className={styles.conceptBody}>
        {children}{" "}
        <a href={href} target="_blank" rel="noopener noreferrer">
          {linkLabel}
        </a>
      </p>
    </div>
  );
}

const SEV_BAR = {
  Blocker: styles.barBlocker,
  Major: styles.barMajor,
  Minor: styles.barMinor,
} as const;

const SEV_CHIP = {
  Blocker: styles.sevBlocker,
  Major: styles.sevMajor,
  Minor: styles.sevMinor,
} as const;

/** A finding, rendered the way ClapBack renders findings. */
export function RoastCard({
  sev,
  category,
  title,
  why,
  fix,
  effort,
  refHref,
  refLabel,
}: {
  sev: "Blocker" | "Major" | "Minor";
  category: string;
  title: string;
  why: string;
  fix: string;
  effort: string;
  refHref: string;
  refLabel: string;
}) {
  return (
    <div className={styles.roast} data-reveal>
      <div className={`${styles.roastBar} ${SEV_BAR[sev]}`} />
      <div className={styles.roastIn}>
        <div className={styles.roastTop}>
          <span className={`${styles.sev} ${SEV_CHIP[sev]}`}>
            {sev.toUpperCase()}
          </span>
          <span className={styles.roastCat}>{category}</span>
        </div>
        <h3 className={styles.roastTitle}>{title}</h3>
        <p className={styles.roastWhy}>{why}</p>
        <div className={styles.fixBox}>
          <b>Fix →</b>
          {fix}
        </div>
        <div className={styles.roastFoot}>
          <span className={styles.effort}>{effort}</span>
          <a href={refHref} target="_blank" rel="noopener noreferrer">
            {refLabel}
          </a>
        </div>
      </div>
    </div>
  );
}

export function Chart({
  title,
  sub,
  rows,
  note,
}: {
  title: string;
  sub: string;
  rows: { label: string; width: string; value: string; kind: "base" | "up" }[];
  note: string;
}) {
  return (
    <div className={styles.chart} data-reveal>
      <p className={styles.chartTitle}>{title}</p>
      <p className={styles.chartSub}>{sub}</p>
      {rows.map((r) => (
        <div key={r.label} className={styles.barRow}>
          <span className={styles.barLabel}>{r.label}</span>
          <div className={styles.barTrack}>
            <div
              className={`${styles.barFill} ${
                r.kind === "base" ? styles.barBase : styles.barUp
              }`}
              style={{ width: r.width }}
            >
              <span className={styles.barValue}>{r.value}</span>
            </div>
          </div>
        </div>
      ))}
      <p className={styles.chartNote}>{note}</p>
    </div>
  );
}

/** What the subject got right. A scan that only collects sins is a listicle. */
export function Ledger({
  title,
  sub,
  items,
}: {
  title: string;
  sub: string;
  items: string[];
}) {
  return (
    <div className={styles.ledger} data-reveal>
      <p className={styles.ledgerTitle}>{title}</p>
      <p className={styles.ledgerSub}>{sub}</p>
      <ul>
        {items.map((i) => (
          <li key={i}>
            <span className={styles.tick}>✓</span>
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footnotes({ items }: { items: ReactNode[] }) {
  return (
    <div className={styles.footnotes} data-reveal>
      <p className={styles.footnotesTitle}>Methodology · non-essential reading</p>
      <ol>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ol>
    </div>
  );
}

/** Mid-scan conversion block. `where` names the position in Mixpanel so the
    chapter that actually converts is knowable rather than guessed at. */
export function InlineCta({
  label,
  title,
  body,
  cta,
  hint,
  where,
}: {
  label: string;
  title: string;
  body: string;
  cta: string;
  hint: string;
  where: string;
}) {
  return (
    <div className={styles.inlineCta} data-reveal>
      <p className={styles.inlineCtaLabel}>{label}</p>
      <p className={styles.inlineCtaTitle}>{title}</p>
      <p className={styles.inlineCtaBody}>{body}</p>
      <div className={styles.inlineCtaRow}>
        <TrackedCta href="/#start" where={where} className={styles.btn}>
          {cta}
        </TrackedCta>
        <span className={styles.btnHint}>{hint}</span>
      </div>
    </div>
  );
}

export function NextScan({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.teaser} data-reveal>
      <p className={styles.boxLabel}>Next scan · {number}</p>
      <p className={styles.teaserTitle}>{title}</p>
      <p className={styles.teaserBody}>{children}</p>
    </div>
  );
}
