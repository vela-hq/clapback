import type { Metadata } from "next";
import { preload } from "react-dom";
import { notFound } from "next/navigation";
import Link from "next/link";
import RoastReport from "@/app/components/RoastReport";
import { loadRoast, type StoredRoast } from "@/lib/roastStore";
import { severityTally, type RoastFinding } from "@/app/data/roast";
import styles from "./Report.module.css";

// The permalink for one archived run.
//
// Nothing is generated ahead of time: run ids are minted by Cooper in
// production, so this app cannot know them at build time and there is nothing
// to enumerate. Every id is rendered on demand, and an id we cannot load is a
// 404 rather than a build error.
export const dynamicParams = true;

// Roasts are other people's sites. We link them, the owner shares them, and
// that is the whole point — but ClapBack does not get to put someone else's
// product under a headline about its UX problems into Google's index. Set on
// every branch below, including the failures.
const NO_INDEX = { index: false, follow: false } as const;

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return "that site";
  }
}

/** "1 Blocker, 3 Major and 2 Minor" — the tally as prose, for meta text. */
function tallyPhrase(findings: RoastFinding[]): string {
  const parts = severityTally(findings).map((t) => `${t.count} ${t.sev}`);
  if (parts.length <= 1) return parts[0] ?? "";
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}

// Title and description for one stored run. Shared by generateMetadata and the
// OG image, so the card and the tab agree about what this page is.
function describe(roast: StoredRoast): { title: string; description: string } {
  const host = hostOf(roast.url);
  const r = roast.result;

  if (r.status === "findings") {
    const n = r.findings.length;
    return {
      title: `${n} UX ${plural(n, "issue", "issues")} on ${host} — ClapBack`,
      description: `ClapBack roasted ${host} and found ${tallyPhrase(r.findings)} ${plural(
        n,
        "issue",
        "issues",
      )}, each one tied to a named usability law and shown on the page it breaks.`,
    };
  }
  if (r.status === "clean") {
    return {
      title: `No UX issues on ${host} — ClapBack`,
      description: `ClapBack roasted ${host} and came back with nothing. Rare, and worth saying out loud.`,
    };
  }
  if (r.status === "cannot_review") {
    return {
      title: `Couldn't roast ${host} — ClapBack`,
      description: `ClapBack couldn't read ${host} well enough to review it, so it said so instead of inventing findings.`,
    };
  }
  return {
    title: `Roast of ${host} failed — ClapBack`,
    description: `This roast of ${host} broke before it finished.`,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const roast = await loadRoast(id);
  // Expired or bogus: the page itself will 404, and not-found.tsx carries the
  // copy. Nothing useful to title it with here.
  if (!roast) return { title: "Roast not found — ClapBack", robots: NO_INDEX };

  const { title, description } = describe(roast);
  return {
    title,
    description,
    alternates: { canonical: `/r/${roast.runId}` },
    robots: NO_INDEX,
    openGraph: { type: "article", url: `/r/${roast.runId}`, siteName: "ClapBack", title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function RoastPermalink({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  // Cached per request by roastStore, so generateMetadata's load and this one
  // are a single fetch.
  const roast = await loadRoast(id);
  if (!roast) notFound();

  const r = roast.result;

  if (r.status === "findings") {
    // The map is the page. Without this the browser only learns its URL once
    // RoastReport has hydrated, so a ~400 KB image that has to come from a
    // private bucket through a lambda starts late and lands after everything
    // else — the reader watches markers float over an empty rectangle. React
    // hoists this into <head>, so the fetch begins with the document.
    if (r.page && r.shots[r.page.shot]) {
      preload(r.shots[r.page.shot], { as: "image", fetchPriority: "high" });
    }

    // `?fresh=1` is set by the run overlay when it routes the author here off
    // their own roast. It changes nothing on screen — it only lets the view
    // event tell the person who paid the wait from the person they sent it to,
    // which is the difference between a funnel step and a share.
    const { fresh } = await searchParams;
    return (
      <RoastReport
        runId={roast.runId}
        url={roast.url}
        findings={r.findings}
        shots={r.shots}
        page={r.page}
        durationMs={r.durationMs}
        site={r.site}
        firstParty={fresh === "1"}
      />
    );
  }

  // The three ways a run ends with nothing to show. Each one is a real answer,
  // so each one gets said plainly rather than dressed up as the other two: a
  // clean page is a compliment, an abstention is Cooper refusing to make things
  // up, and a crash is our fault.
  const host = hostOf(roast.url);
  const card =
    r.status === "clean"
      ? {
          eyebrow: "Nothing to roast",
          title: `${host} came back clean`,
          body: "ClapBack went through it and found nothing worth shouting about. That is rare enough to be worth saying out loud.",
        }
      : r.status === "cannot_review"
        ? {
            eyebrow: "Couldn't review",
            title: `We couldn't read ${host}`,
            body: r.reason,
          }
        : {
            eyebrow: "Roast failed",
            title: `This roast of ${host} broke`,
            body: r.message,
          };

  return (
    <main className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.eyebrow}>{card.eyebrow}</div>
        <h1 className={styles.title}>{card.title}</h1>
        <p className={styles.body}>{card.body}</p>
        <Link className={styles.cta} href="/">
          Roast another site
        </Link>
      </div>
      <div className={styles.runId}>{roast.runId}</div>
    </main>
  );
}
