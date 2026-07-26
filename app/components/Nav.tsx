"use client";

import { useEffect, useState } from "react";
import { HERO_URL_FIELD } from "./urlField";
import styles from "./Nav.module.css";

// `busy` says a roast is already running: the CTA then takes you back to it
// rather than offering a second one it would refuse to start.
export default function Nav({
  onGetRoast,
  busy = false,
}: {
  onGetRoast: () => void;
  busy?: boolean;
}) {
  // The CTA only exists once the hero's URL box has scrolled away.
  //
  // While the box is on screen it is a strictly better version of this button —
  // it can actually take a URL — and two competing "get your free roast" buttons
  // a few hundred pixels apart is how a visitor ends up pressing the one that
  // can't do anything on its own. Which is what happened: scroll back to the
  // top, press the button in the corner rather than the field below it.
  const [past, setPast] = useState(false);
  useEffect(() => {
    const field = document.getElementById(HERO_URL_FIELD);
    // No hero on this page: keep the CTA, it is the only one there is.
    if (!field) {
      setPast(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setPast(!entry.isIntersecting), {
      // This header is sticky and sits over the top of the page, so a field
      // "visible" underneath it is not visible at all.
      rootMargin: "-64px 0px 0px 0px",
    });
    io.observe(field);
    return () => io.disconnect();
  }, []);

  // A roast in flight is worth breaking the rule for: the pill can be
  // off-screen, and this is then the reliable way back to it.
  const showCta = past || busy;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <svg width="19" height="19" viewBox="0 0 100 100" aria-hidden="true">
              <g transform="translate(11 0) skewX(-13)">
                <polygon
                  points="50.0,4.0 57.7,31.5 82.5,17.5 68.5,42.3 96.0,50.0 68.5,57.7 82.5,82.5 57.7,68.5 50.0,96.0 42.3,68.5 17.5,82.5 31.5,57.7 4.0,50.0 31.5,42.3 17.5,17.5 42.3,31.5"
                  fill="var(--accent)"
                />
              </g>
            </svg>
          </div>
          <span className={styles.wordmark}>ClapBack</span>
        </div>
        <nav className={styles.nav}>
          <a href="#how">How it works</a>
          <a href="#sample">Sample roast</a>
          <a href="#backlog">Triage</a>
          <a href="/blog">Receipts</a>
          <a href="#faq">FAQ</a>
        </nav>
        <button
          className={`${styles.cta} ${showCta ? styles.ctaIn : styles.ctaOut}`}
          onClick={() => onGetRoast()}
          // Not merely invisible: a button that scrolls you to a box you are
          // already looking at is noise to a screen reader and a dead tab stop
          // for a keyboard user, both of whom have the real field right there.
          aria-hidden={!showCta}
          tabIndex={showCta ? undefined : -1}
        >
          {busy ? "Watch the roast" : "Get your free roast"}
        </button>
      </div>
    </header>
  );
}
