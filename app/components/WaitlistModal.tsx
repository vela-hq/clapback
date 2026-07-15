"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./WaitlistModal.module.css";
import { identify, track } from "@/lib/analytics";
import { displayUrl } from "@/lib/url";

type WaitlistModalProps = {
  open: boolean;
  url: string;
  leadId: string;
  onClose: () => void;
};

type Status = "idle" | "submitting" | "success" | "error";

export default function WaitlistModal({ open, url, leadId, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const cleanUrl = displayUrl(url);

  // Reset and focus the email field each time the modal opens.
  useEffect(() => {
    if (!open) return;
    setStatus("idle");
    setError(null);
    setEmail("");
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock the page behind the modal so the landing doesn't scroll underneath.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const submit = async () => {
    if (status === "submitting") return;
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, email, url }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Try again.");
        setStatus("error");
        return;
      }
      // Tie the anonymous session to this lead, then record the conversion.
      identify(leadId);
      track("waitlist_submitted", { lead_id: leadId, has_url: cleanUrl.length > 0 });
      setStatus("success");
    } catch {
      setError("Network error. Try again.");
      setStatus("error");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submit();
  };

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          ✕
        </button>

        {status === "success" ? (
          <div className={styles.success}>
            <span className={styles.badge}>You&rsquo;re on the list</span>
            <h2 className={styles.title} id="waitlist-title">
              Roast incoming.
            </h2>
            <p className={styles.lede}>
              We&rsquo;ll email you the moment your spot opens
              {cleanUrl ? <>, starting with <strong>{cleanUrl}</strong></> : null}.
            </p>
            <button className={styles.submit} onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <span className={styles.badge}>Closed alpha</span>
            <h2 className={styles.title} id="waitlist-title">
              We&rsquo;re onboarding in small batches.
            </h2>
            <p className={styles.lede}>
              ClapBack is in closed alpha. Drop your email and we&rsquo;ll send you a
              roast of{" "}
              <strong>{cleanUrl || "your site"}</strong> as soon as a spot opens.
            </p>

            <div className={styles.field}>
              <input
                ref={inputRef}
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="you@company.com"
                aria-label="Your email"
                autoComplete="email"
              />
            </div>

            {error ? <div className={styles.error}>{error}</div> : null}

            <button
              className={styles.submit}
              onClick={submit}
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Saving your spot…" : "Get on the list →"}
            </button>

            <p className={styles.fine}>No spam. We&rsquo;ll only email about your spot.</p>
          </>
        )}
      </div>
    </div>
  );
}
