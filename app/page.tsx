"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import TrustStrip from "./components/TrustStrip";
import Toast from "./components/Toast";

const FOUND_ISSUES = 14;

export default function Home() {
  const [url, setUrl] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const submit = useCallback(() => {
    const target = (url.trim() || "your-app.com").replace(/^https?:\/\//, "");
    showToast(`Spinning up your scan for ${target} — opens in a new tab.`);
  }, [url, showToast]);

  // Reveal-on-scroll for [data-reveal] elements.
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
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  return (
    <div style={{ overflowX: "hidden" }}>
      <Nav onGetRoast={submit} />
      <Hero
        url={url}
        onUrlChange={setUrl}
        onSubmit={submit}
        foundIssues={FOUND_ISSUES}
      />
      <TrustStrip />
      <Toast message={toast} />
    </div>
  );
}
