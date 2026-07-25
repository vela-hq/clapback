import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import ScanLayout from "../../components/scan/ScanLayout";
import { SCANS, getScan } from "../../scans/scans";

const SITE_URL = "https://clapback.run";

// Static map from slug to scan body, mirroring the blog's BODIES map. Each body
// is a server component free to pull in its own client islands.
const BODIES: Record<string, () => Promise<{ default: ComponentType }>> = {
  "ryanair-booking-flow": () => import("../../scans/content/ryanair-booking-flow"),
};

export function generateStaticParams() {
  return SCANS.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = getScan(slug);
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: `/scan/${meta.slug}` },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/scan/${meta.slug}`,
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

export default async function ScanPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getScan(slug);
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
    url: `${SITE_URL}/scan/${meta.slug}`,
    mainEntityOfPage: `${SITE_URL}/scan/${meta.slug}`,
    // The scan is criticism of a named product, and saying so in the markup is
    // the same disclosure the methodology footnotes make in prose.
    about: { "@type": "Thing", name: `${meta.host} ${meta.flow}` },
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
      { "@type": "ListItem", position: 2, name: "Scans", item: `${SITE_URL}/scan` },
      {
        "@type": "ListItem",
        position: 3,
        name: meta.h1,
        item: `${SITE_URL}/scan/${meta.slug}`,
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
      <ScanLayout meta={meta}>
        <Body />
      </ScanLayout>
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
