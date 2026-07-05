import { NextResponse } from "next/server";

// Upserts the waitlist entry as a Mixpanel People profile, keyed by leadId.
// Runs server-side so ad/tracking blockers can't drop it (unlike the browser
// SDK). Two phases, both hitting the same profile via $distinct_id = leadId:
//   1. "lead"  — URL captured the moment the CTA is pressed (email may be blank)
//   2. "email" — email added later; merges into the same profile
// EU data residency, so we post to api-eu.mixpanel.com. Uses the public project
// token (NEXT_PUBLIC_MIXPANEL_TOKEN); /engage needs no secret.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIXPANEL_ENGAGE = "https://api-eu.mixpanel.com/engage?verbose=1";

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

  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  if (!token) {
    console.error("NEXT_PUBLIC_MIXPANEL_TOKEN is not set.");
    return NextResponse.json({ error: "Signups are not configured yet." }, { status: 500 });
  }

  const now = new Date().toISOString();
  // /engage allows exactly one operation ($set OR $set_once) per record, so we
  // send two records for the same profile. $ip:"0" is Vercel's datacenter, not
  // the visitor, so skip geolocation to avoid tagging every lead the same.
  const base = { $token: token, $distinct_id: leadId, $ip: "0" };
  const profile = [
    {
      ...base,
      // $set upserts, so the email phase merges into the row the lead phase
      // created. Only write fields we actually have this call.
      $set: {
        ...(email && { $email: email }),
        ...(url && { target_url: url.slice(0, 2048) }),
        status: "waitlist",
        updated_at: now,
      },
    },
    // First-touch timestamp, never overwritten by the second phase.
    { ...base, $set_once: { first_seen: now } },
  ];

  try {
    const res = await fetch(MIXPANEL_ENGAGE, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(JSON.stringify(profile)),
    });
    const data = (await res.json().catch(() => ({}))) as { status?: number; error?: string };
    if (!res.ok || data.status !== 1) {
      console.error("Mixpanel engage failed", res.status, data.error);
      return NextResponse.json({ error: "Could not save your spot. Try again." }, { status: 502 });
    }
  } catch (err) {
    console.error("Mixpanel engage request failed", err);
    return NextResponse.json({ error: "Could not save your spot. Try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
