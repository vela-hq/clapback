"use client";

import { CSSProperties, useEffect, useState } from "react";
import Mockup from "./Mockup";
import { FINDINGS, SEVERITY_STYLE } from "../data/findings";
import { urlFieldProps } from "./urlField";
import { displayUrl } from "@/lib/url";
import styles from "./Hero.module.css";

type HeroProps = {
  url: string;
  onUrlChange: (value: string) => void;
  onSubmit: () => void;
  foundIssues: number;
};

const TYPE_SPEED = 46; // ms per character
const TYPE_DELAY = 360; // let the card settle before the title types
const READ_HOLD = 7800; // dwell after the title finishes, before the next finding

// Ticks from 0 up to `target` once `start` flips true, easing out. Reads as the
// agent discovering issues in real time. Respects reduced-motion.
function useCountUp(target: number, duration: number, start: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);

  return value;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

// Types `text` out one character at a time after a short delay. When disabled
// (reduced-motion) it returns the full string already "done". `done` lets
// callers stage what happens once the line lands.
function useTypewriter(text: string, enabled: boolean) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setOut(text);
      setDone(true);
      return;
    }
    setOut("");
    setDone(false);
    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setOut(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, TYPE_SPEED);
    }, TYPE_DELAY);
    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [text, enabled]);

  return { out, done };
}

export default function Hero({ url, onUrlChange, onSubmit, foundIssues }: HeroProps) {
  const urlDisplay = displayUrl(url) || "your-app.com";

  // Hold the count-up until the panel has slid in, so the badge animates as the
  // window settles rather than during the entrance.
  const [counting, setCounting] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setCounting(true), 620);
    return () => clearTimeout(id);
  }, []);
  const foundCount = useCountUp(foundIssues, 1100, counting);

  // The panel works through the real backlog findings: each card settles in,
  // its title types out like the agent is writing the report, then it holds for
  // reading before the next one. Held static for reduced-motion.
  const reduced = usePrefersReducedMotion();
  const [current, setCurrent] = useState(0);
  const finding = FINDINGS[current];
  const sevStyle = SEVERITY_STYLE[finding.sev];
  const { out: typedTitle, done } = useTypewriter(finding.title, !reduced);

  // Advance only once the current title has finished typing, so the rhythm
  // follows the writing rather than a fixed metronome.
  useEffect(() => {
    if (reduced || !done) return;
    const id = setTimeout(
      () => setCurrent((c) => (c + 1) % FINDINGS.length),
      READ_HOLD,
    );
    return () => clearTimeout(id);
  }, [done, reduced]);

  return (
    <section className={styles.hero} data-screen-label="Hero">
      <div className={styles.copy}>
        <h1 className={styles.title}>
          Your UX sucks.
          <br />
          <span className={styles.accent}>Here&rsquo;s the receipts.</span>
        </h1>
        <p className={styles.lede}>
          An AI agent uses your product like a real user, roasts everything that
          sucks, and turns it into Jira tickets you can ship. Not vibes,{" "}
          <em>actual UX research.</em>
        </p>

        <div className={styles.form}>
          <div className={styles.field}>
            <span className={styles.scheme}>https://</span>
            <input
              id="roast-url"
              className={styles.input}
              placeholder="your-app.com"
              aria-label="Your site URL"
              {...urlFieldProps(url, onUrlChange, onSubmit)}
            />
          </div>
          <button className={styles.submit} onClick={onSubmit}>
            Get my free roast →
          </button>
        </div>

        <div className={styles.hint}>
          Paste your own site, or a competitor you love to hate. We won&rsquo;t
          tell. Takes about two minutes.
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.window}>
          <div className={styles.windowBar}>
            <span className={styles.dots}>
              <span />
              <span />
              <span />
            </span>
            <span className={styles.urlPill}>{urlDisplay}</span>
          </div>

          <div className={styles.windowBody}>
            <div className={styles.findingMeta}>
              <span className={styles.label}>
                Example finding · {current + 1} of {foundIssues}
              </span>
              <span className={styles.count}>{foundCount} found</span>
            </div>
            <div className={styles.card} key={current}>
              <div className={styles.shot}>
                <Mockup shot={finding.shot} />
                <span className={styles.scan} aria-hidden="true" />
                <span className={styles.annotation} />
                <span className={styles.pin}>{current + 1}</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.tags}>
                  <span
                    className={styles.sev}
                    style={
                      {
                        color: sevStyle.fg,
                        background: sevStyle.bg,
                        border: sevStyle.border,
                      } as CSSProperties
                    }
                  >
                    {finding.sev}
                  </span>
                  <span className={styles.cat}>{finding.cat}</span>
                  <span className={styles.rule}>{finding.ruleShort}</span>
                </div>
                <div className={styles.cardTitle}>
                  {/* Invisible full title reserves the exact height so the body
                      doesn't shift as the visible copy types in. */}
                  <span className={styles.cardTitleGhost} aria-hidden="true">
                    {finding.title}
                  </span>
                  <span className={styles.cardTitleType}>
                    {typedTitle}
                    {!reduced && <span className={styles.caret} aria-hidden="true" />}
                  </span>
                </div>
                <div
                  className={`${styles.cardWhy} ${
                    !reduced && !done ? styles.cardWhyHidden : ""
                  }`}
                >
                  {finding.why}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
