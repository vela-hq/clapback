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
