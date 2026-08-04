import type { Metadata } from "next";
import { loadRoast } from "@/lib/roastStore";
import PricingContent, { type RunSummary } from "./PricingContent";

// The ask, separated from the evidence. The report proves the product is worth
// wanting and never names a price; this page's whole job is the price, made as
// easy to say yes to as we know how. Reached as /pricing?r=<run_id> from a
// report (personalized) or bare from the nav (generic).

export const metadata: Metadata = {
  title: "The full roast · ClapBack",
  description:
    "The full roast signs into your product with its own throwaway account, walks every page and every flow, and files a screenshot-backed ticket for everything it can prove. $49, once.",
  alternates: { canonical: "/pricing" },
};

export default async function Pricing({
  searchParams,
}: {
  searchParams: Promise<{ r?: string }>;
}) {
  const { r } = await searchParams;

  // A bad, expired or missing run id degrades to the generic page, never to an
  // error: the person on this page is the closest to paying of anyone on the
  // site, and "your personalization broke" is not a thing to show them.
  let run: RunSummary | null = null;
  if (r) {
    try {
      const roast = await loadRoast(r);
      if (roast && (roast.result.status === "findings" || roast.result.status === "clean")) {
        run = {
          runId: roast.runId,
          url: roast.url,
          findings:
            roast.result.status === "findings" ? roast.result.findings.length : 0,
          siteType: roast.result.site.siteType,
          surfaces: roast.result.site.untestedSurfaces,
        };
      }
    } catch {
      // The archive hiccuped. Same answer as an expired id: the generic page.
    }
  }

  return <PricingContent run={run} />;
}
