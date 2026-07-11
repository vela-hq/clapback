import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import ArticleLayout from "../../components/blog/ArticleLayout";
import { ARTICLES, getArticle } from "../articles";

const SITE_URL = "https://clapback.run";

// Static map from slug to article body. Each body is a server component in
// app/blog/content/, free to pull in its own client islands.
const BODIES: Record<string, () => Promise<{ default: ComponentType }>> = {
  "what-is-an-ai-ux-audit": () => import("../content/what-is-an-ai-ux-audit"),
  "heuristic-evaluation-example": () =>
    import("../content/heuristic-evaluation-example"),
  "ux-statistics-sources": () => import("../content/ux-statistics-sources"),
  "ux-audit-cost": () => import("../content/ux-audit-cost"),
  "founder-ux-audit-checklist": () =>
    import("../content/founder-ux-audit-checklist"),
  "why-users-abandon-signup": () => import("../content/why-users-abandon-signup"),
  "chatgpt-ux-audit-prompts": () => import("../content/chatgpt-ux-audit-prompts"),
  "ai-agents-vs-synthetic-users-vs-real-users": () =>
    import("../content/ai-agents-vs-synthetic-users-vs-real-users"),
  "ux-findings-to-jira-tickets": () =>
    import("../content/ux-findings-to-jira-tickets"),
  "vibe-coded-app-ux": () => import("../content/vibe-coded-app-ux"),
};

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = getArticle(slug);
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: `/blog/${meta.slug}` },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/blog/${meta.slug}`,
      siteName: "ClapBack",
      title: meta.title,
      description: meta.description,
      publishedTime: meta.datePublished,
      modifiedTime: meta.dateModified,
      authors: ["ClapBack Research"],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getArticle(slug);
  const loadBody = BODIES[slug];
  if (!meta || !loadBody) notFound();

  const { default: Body } = await loadBody();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.datePublished,
    dateModified: meta.dateModified,
    url: `${SITE_URL}/blog/${meta.slug}`,
    mainEntityOfPage: `${SITE_URL}/blog/${meta.slug}`,
    author: {
      "@type": "Organization",
      name: "ClapBack Research",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "ClapBack",
      url: SITE_URL,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClapBack", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Receipts", item: `${SITE_URL}/blog` },
      {
        "@type": "ListItem",
        position: 3,
        name: meta.h1,
        item: `${SITE_URL}/blog/${meta.slug}`,
      },
    ],
  };

  const faqLd =
    meta.faq && meta.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: meta.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <>
      <ArticleLayout meta={meta}>
        <Body />
      </ArticleLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
    </>
  );
}
