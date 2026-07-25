"use client";

import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { track } from "@/lib/analytics";
import type { ScanNode } from "../../scans/scans";
import styles from "./Scan.module.css";

/* The three interactive parts of a scan page. Everything else SSRs. */

/** Fires scan_viewed once, and wires the global [data-reveal] contract. Blog
    pages have no observer of their own, so the scan brings its own. */
export function ScanReveal({ slug }: { slug: string }) {
  useEffect(() => {
    track("scan_viewed", { slug });
  }, [slug]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}

/** Any link into the funnel. `where` is the position on the page, so the
    chapter that converts is measurable rather than inferred. */
export function TrackedCta({
  href,
  where,
  className,
  children,
}: {
  href: string;
  where: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => track("scan_cta_clicked", { where })}
    >
      {children}
    </Link>
  );
}

/** The signature visual: the funnel as walked, with refusal detours hanging
    below the happy path. Hand-authored coordinates live in the registry; this
    only draws them and turns each node into a jump to its chapter. */
export function FlowMap({
  nodes,
  caption,
  slug,
}: {
  nodes: ScanNode[];
  caption: string;
  slug: string;
}) {
  const jump = (node: ScanNode) => {
    if (!node.target) return;
    track("scan_node_clicked", { slug, node: node.id });
    const el = document.getElementById(node.target);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const main = nodes.filter((n) => !n.detour);

  return (
    <div className={styles.flowScroll}>
      <svg
        className={styles.flowSvg}
        viewBox="0 0 1180 296"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Flow diagram of the booking funnel, with refusal detours branching off the main path"
      >
        <defs>
          <marker
            id="scan-arrow"
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 z" fill="#9a948a" />
          </marker>
          <marker
            id="scan-arrow-ref"
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 z" fill="#d43e24" />
          </marker>
        </defs>

        {/* Main path: one connector per adjacent pair of top-row nodes. */}
        {main.slice(0, -1).map((n, i) => (
          <line
            key={n.id}
            className={styles.edge}
            x1={n.x + n.w}
            y1={n.y + 20}
            x2={main[i + 1].x - 4}
            y2={n.y + 20}
            markerEnd="url(#scan-arrow)"
          />
        ))}

        {/* Refusal detours: down into the re-ask, back up to the funnel. */}
        <path
          className={`${styles.edge} ${styles.edgeRef}`}
          d="M395,112 C395,150 395,168 410,188"
          markerEnd="url(#scan-arrow-ref)"
        />
        <path
          className={`${styles.edge} ${styles.edgeRef}`}
          d="M470,213 C505,210 512,150 512,115"
          markerEnd="url(#scan-arrow-ref)"
        />
        <text className={styles.edgeLabel} x="300" y="158">
          decline ×2
        </text>

        <path
          className={`${styles.edge} ${styles.edgeRef}`}
          d="M615,112 C600,148 585,172 572,188"
          markerEnd="url(#scan-arrow-ref)"
        />
        <path
          className={`${styles.edge} ${styles.edgeRef}`}
          d="M625,213 L648,213"
          markerEnd="url(#scan-arrow-ref)"
        />
        <path
          className={`${styles.edge} ${styles.edgeRef}`}
          d="M760,213 C798,206 795,148 740,114"
          markerEnd="url(#scan-arrow-ref)"
        />
        <text className={styles.edgeLabel} x="560" y="152">
          refuse
        </text>
        <text className={styles.edgeLabel} x="790" y="162">
          refuse
        </text>

        {nodes.map((n) => {
          const h = n.detour ? 46 : 40;
          const cx = n.x + n.w / 2;
          const clickable = Boolean(n.target);
          return (
            <g
              key={n.id}
              className={`${styles.node} ${n.detour ? styles.detour : ""} ${
                n.stop ? styles.stopNode : ""
              }`}
              onClick={() => jump(n)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  jump(n);
                }
              }}
              role={clickable ? "button" : undefined}
              tabIndex={clickable ? 0 : undefined}
              aria-label={clickable ? `Jump to the ${n.label} chapter` : undefined}
              style={clickable ? undefined : { cursor: "default" }}
            >
              <rect x={n.x} y={n.y} width={n.w} height={h} rx={8} />
              <text className={styles.nodeText} x={cx} y={n.y + 19} textAnchor="middle">
                {n.label}
              </text>
              <text className={styles.nodeSub} x={cx} y={n.y + 33} textAnchor="middle">
                {n.sub}
              </text>
              {n.findings && (
                <g>
                  <circle
                    className={styles.badgeCircle}
                    cx={n.x + n.w - 4}
                    cy={n.y}
                    r={9}
                  />
                  <text
                    className={styles.badgeText}
                    x={n.x + n.w - 4}
                    y={n.y + 3.5}
                    textAnchor="middle"
                  >
                    {n.findings}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        <text className={styles.mapCaption} x="8" y="278">
          {caption}
        </text>
      </svg>
    </div>
  );
}
