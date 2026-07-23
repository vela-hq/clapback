import type { CSSProperties, ReactNode } from "react";
import styles from "./Article.module.css";

/* Shared, server-renderable building blocks for Receipts articles. The
   roast/receipt pair is the house grammar: a spicy claim immediately followed
   by the checkable evidence, mirroring how ClapBack findings work. */

/** TL;DR box at the top of an article. GEO-friendly, brand-flavored. */
export function ShortVersion({ children }: { children: ReactNode }) {
  return (
    <aside className={styles.shortVersion}>
      <div className={styles.shortVersionLabel}>The short version</div>
      <ul>{children}</ul>
    </aside>
  );
}

/** The spicy claim. Always pair with a Receipt or an inline citation. */
export function Roast({ children }: { children: ReactNode }) {
  return (
    <div className={styles.roast}>
      <div className={styles.calloutLabel}>The roast</div>
      <p>{children}</p>
    </div>
  );
}

/** The evidence backing the roast: a rule, a study, a number. */
export function Receipt({ rule, children }: { rule?: string; children: ReactNode }) {
  return (
    <div className={styles.receipt}>
      <div className={styles.calloutLabel}>The receipt</div>
      <p>{children}</p>
      {rule && <span className={styles.receiptRule}>{rule}</span>}
    </div>
  );
}

/** Big sourced number, displayed like the landing page credibility stat. */
export function PullStat({ num, children }: { num: string; children: ReactNode }) {
  return (
    <div className={styles.pullStat}>
      <div className={styles.pullStatNum}>{num}</div>
      <div className={styles.pullStatBody}>{children}</div>
    </div>
  );
}

/** Frame for diagrams and drawn mockups, with a caption. */
export function Figure({
  caption,
  padded = false,
  children,
}: {
  caption: string;
  padded?: boolean;
  children: ReactNode;
}) {
  return (
    <figure className={styles.figure} style={{ margin: undefined }}>
      <div
        className={styles.figureFrame}
        style={padded ? { padding: "22px" } : undefined}
      >
        {children}
      </div>
      <figcaption className={styles.figureCaption}>{caption}</figcaption>
    </figure>
  );
}

const TICKET_SEV: Record<string, { bg: string; fg: string }> = {
  Blocker: { bg: "var(--accent-strong)", fg: "#fff" },
  Major: { bg: "var(--yellow)", fg: "var(--ink)" },
  Minor: { bg: "var(--bg-alt)", fg: "var(--text-muted)" },
};

/** Advice shaped like the ticket ClapBack would write. */
export function Ticket({
  id,
  sev,
  title,
  fields,
}: {
  id: string;
  sev: "Blocker" | "Major" | "Minor";
  title: string;
  fields: { label: string; value: ReactNode }[];
}) {
  const sevStyle = TICKET_SEV[sev];
  return (
    <div className={styles.ticket}>
      <div className={styles.ticketBar}>
        <span className={styles.ticketKey}>{id}</span>
        <span
          className={styles.ticketSev}
          style={{ background: sevStyle.bg, color: sevStyle.fg } as CSSProperties}
        >
          {sev}
        </span>
      </div>
      <div className={styles.ticketBody}>
        <div className={styles.ticketTitle}>{title}</div>
        {fields.map((f) => (
          <div key={f.label} className={styles.ticketField}>
            <span className={styles.ticketFieldLabel}>{f.label}</span>
            <span>{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Horizontal-scroll wrapper so wide tables never break the page. */
export function TableWrap({ children }: { children: ReactNode }) {
  return <div className={styles.tableWrap}>{children}</div>;
}

/** End-of-article source list. Inline links stay in prose; this is the recap. */
export function Sources({ items }: { items: { label: string; href: string }[] }) {
  return (
    <div className={styles.sources}>
      <div className={styles.sourcesLabel}>Receipts for this article</div>
      {items.map((s, i) => (
        <span key={s.href}>
          <a href={s.href} target="_blank" rel="noopener noreferrer">
            {s.label}
          </a>
          {i < items.length - 1 && " · "}
        </span>
      ))}
    </div>
  );
}
