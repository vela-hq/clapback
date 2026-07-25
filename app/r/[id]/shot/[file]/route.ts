import { isRunId, loadShot } from "@/lib/roastStore";

// The archive's images, served from our own origin.
//
// The bucket is private and stays that way: this route is the only door to it,
// and it opens onto exactly one shape of object — `runs/<run id>/shots/<file>`,
// both segments checked against fixed patterns in roastStore before anything
// touches the network. A request for anything else is a 404 with no detail,
// because "that object exists but you may not have it" is itself an answer.

// A run id names a finished run, and its bytes never change — so this is as
// immutable as an asset gets, and a re-read of a shared roast should never come
// back to the function. Deliberately a response header rather than a route
// segment `revalidate`: Next 15 does not cache route handlers by default, and
// the CDN + browser caching we actually want is the header's job. Putting
// screenshot bytes in the data cache as well would buy nothing.
// `s-maxage` as well as `max-age`: the browser's copy only helps the reader who
// already loaded the page, and the expensive part here is a lambda round trip
// to a private bucket. Vercel's CDN keys off `s-maxage`, so this is what stops
// a roast shared into a group chat from re-fetching the same 400 KB page map
// once per person.
const IMMUTABLE = "public, max-age=31536000, s-maxage=31536000, immutable";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; file: string }> },
) {
  // Next 15: dynamic params arrive as a promise.
  const { id, file } = await params;

  if (!isRunId(id)) return new Response("Not found", { status: 404 });

  const shot = await loadShot(id, file);
  // Null covers a malformed filename and a missing object alike — a run that
  // aged out of the bucket's 90-day lifecycle looks exactly like one that was
  // never written, and neither is worth distinguishing to a caller.
  if (!shot) return new Response("Not found", { status: 404 });

  return new Response(shot.body, {
    headers: {
      "Content-Type": shot.contentType,
      "Content-Length": String(shot.body.byteLength),
      "Cache-Control": IMMUTABLE,
    },
  });
}
