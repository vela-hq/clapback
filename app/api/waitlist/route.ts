import { NextResponse } from "next/server";

// Forwards waitlist data to a Google Apps Script Web App, which upserts a row in
// a Google Sheet keyed by leadId. Two phases:
//   1. "lead"  — URL captured the moment the CTA is pressed (email may be blank)
//   2. "email" — email added later; updates the same row via leadId
// Configure SHEETS_WEBHOOK_URL (and optionally SHEETS_WEBHOOK_SECRET) in Vercel.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { leadId?: unknown; url?: unknown; email?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const leadId = typeof body.leadId === "string" ? body.leadId.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const url = typeof body.url === "string" ? body.url.trim() : "";

  if (!leadId || leadId.length > 64) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Email is optional (lead phase), but must be valid when provided.
  if (email && (!EMAIL_RE.test(email) || email.length > 254)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  const webhook = process.env.SHEETS_WEBHOOK_URL;
  if (!webhook) {
    console.error("SHEETS_WEBHOOK_URL is not set.");
    return NextResponse.json({ error: "Signups are not configured yet." }, { status: 500 });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId,
        email,
        url: url.slice(0, 2048),
        secret: process.env.SHEETS_WEBHOOK_SECRET ?? "",
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      console.error("Sheets webhook responded", res.status);
      return NextResponse.json({ error: "Could not save your spot. Try again." }, { status: 502 });
    }
  } catch (err) {
    console.error("Sheets webhook failed", err);
    return NextResponse.json({ error: "Could not save your spot. Try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
