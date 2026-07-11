import type { Metadata } from "next";
import Link from "next/link";
import BlogNav from "../components/blog/BlogNav";
import Footer from "../components/Footer";
import { ARTICLES, BLOG_NAME, BLOG_TAGLINE } from "./articles";
import styles from "./Blog.module.css";

export const metadata: Metadata = {
  title: `${BLOG_NAME} · The ClapBack blog on UX evidence`,
  description:
    "UX audits, usability heuristics, and conversion evidence for founders and PMs who ship. Savage takes, checkable citations, zero consultant-speak.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "https://clapback.run/blog",
    siteName: "ClapBack",
    title: `${BLOG_NAME} · The ClapBack blog`,
    description: BLOG_TAGLINE,
  },
};

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogIndex() {
  const posts = [...ARTICLES].sort((a, b) =>
    b.datePublished.localeCompare(a.datePublished),
  );

  return (
    <div>
      <BlogNav />
      <header className={styles.header}>
        <div className={styles.eyebrow}>The ClapBack blog</div>
        <h1 className={styles.title}>
          Receipts<span className={styles.titleAccent}>.</span>
        </h1>
        <p className={styles.lede}>{BLOG_TAGLINE}</p>
      </header>

      <main className={styles.grid}>
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.card}>
            <div className={styles.cardTop}>
              <span className={styles.cardCat}>{post.category}</span>
              <span className={styles.cardSep}>·</span>
              <span className={styles.cardMin}>{post.readingMinutes} min</span>
            </div>
            <div className={styles.cardTitle}>{post.h1}</div>
            <div className={styles.cardExcerpt}>{post.excerpt}</div>
            <div className={styles.cardDate}>{formatDate(post.datePublished)}</div>
          </Link>
        ))}
      </main>
      <Footer />
    </div>
  );
}
