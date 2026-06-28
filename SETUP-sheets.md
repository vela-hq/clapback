# Waitlist → Google Sheet setup

The "Get my free roast" button captures data in two phases:

1. **On click** — if a URL was typed, a lead row is written immediately (URL +
   a `leadId`, email blank). This means you still get data if the visitor
   churns out of the modal without giving an email.
2. **On email submit** — the same row (matched by `leadId`) is updated with the
   email. If there was no URL, a fresh row is appended instead.

Both POST to `/api/waitlist`, which forwards to a Google Apps Script Web App
that **upserts** a row in a Google Sheet. ~5 minutes, no GCP project or service
account.

## 1. Make the sheet

1. Create a new Google Sheet.
2. Put headers in row 1: `LeadID` | `Timestamp` | `Updated` | `Email` | `URL`.

## 2. Add the script

In the sheet: **Extensions → Apps Script**. Replace the contents with:

```js
// Optional: must match SHEETS_WEBHOOK_SECRET in Vercel. Leave "" to skip.
const SECRET = "";

// Columns (1-indexed): A LeadID, B Timestamp, C Updated, D Email, E URL
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // serialize the lead + email writes for one visitor
  try {
    const data = JSON.parse(e.postData.contents);
    if (SECRET && data.secret !== SECRET) {
      return json({ ok: false, error: "forbidden" });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    const now = data.submittedAt || new Date().toISOString();
    const ids = sheet.getRange("A2:A").getValues(); // existing LeadIDs
    let row = 0;
    for (let i = 0; i < ids.length; i++) {
      if (ids[i][0] && ids[i][0] === data.leadId) { row = i + 2; break; }
    }

    if (row === 0) {
      // New lead: append a row.
      sheet.appendRow([data.leadId, now, now, data.email || "", data.url || ""]);
    } else {
      // Existing lead: fill in whatever this call provides, don't clobber.
      sheet.getRange(row, 3).setValue(now); // Updated
      if (data.email) sheet.getRange(row, 4).setValue(data.email);
      if (data.url) sheet.getRange(row, 5).setValue(data.url);
    }
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Deploy as a Web App

1. **Deploy → New deployment** → gear icon → **Web app**.
2. Execute as: **Me**. Who has access: **Anyone**.
3. **Deploy**, authorize when prompted, copy the **Web app URL** (ends in `/exec`).

> Re-deploy ("Manage deployments → edit → new version") whenever you change the script.

## 4. Wire up the env vars

**Local:** copy `.env.local.example` to `.env.local` and set `SHEETS_WEBHOOK_URL`
to the `/exec` URL. If you set `SECRET` in the script, set `SHEETS_WEBHOOK_SECRET`
to the same string.

**Vercel:** Project → Settings → Environment Variables → add the same two vars
(Production + Preview), then redeploy.

## 5. Test

`npm run dev`. Type a URL in the hero field and click "Get my free roast" — a
row should appear immediately with the URL and a blank Email. Enter an email in
the modal and submit — the same row's Email column fills in. To check the churn
case, type a URL, click, then close the modal without an email: the row stays
with just the URL.
