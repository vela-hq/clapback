import type { MetadataRoute } from "next";
import { ARTICLES } from "./blog/articles";
import { VERTICALS } from "./roast/verticals";

const SITE_URL = "https://clapback.run";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/roast`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...VERTICALS.map((v) => ({
      url: `${SITE_URL}/roast/${v.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    {
      // Bare /pricing only. The personalized form is /pricing?r=<run_id>, and
      // those ids are the whole access control on an unlisted report — they
      // belong in nobody's index.
      url: `${SITE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...ARTICLES.map((a) => ({
      url: `${SITE_URL}/blog/${a.slug}`,
      lastModified: new Date(a.dateModified + "T00:00:00Z"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
