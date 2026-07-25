// The roast's deadlines, in one place, because their ORDER is the contract and
// the order is easy to get backwards. Whoever gives up first is the one who
// gets to explain why, so the layer that knows the most has to be the layer
// that fires soonest:
//
//   Cooper's own budget  <  the function's ceiling  <  the browser's backstop
//
// They used to be two literals in two files, 280s in the route and 270s in the
// hook, with a comment claiming the server always answered first. It didn't:
// the browser aborted ten seconds early, every slow roast was reported as a
// client timeout, and the route's 504 branch was unreachable.

/** How long the route waits on Cooper before aborting it and answering 504. */
export const COOPER_TIMEOUT_MS = 280_000;

/**
 * Vercel Hobby's hard ceiling on a fluid-compute function, and the value of
 * `maxDuration` in app/api/roast/route.ts — which has to stay a literal there,
 * because Next reads it statically at build time and will not follow an import.
 * Kept here anyway: it is the middle term of the ordering above, and the reason
 * the client's number is what it is.
 */
export const FUNCTION_TIMEOUT_MS = 300_000;

/**
 * The browser's cutoff. Not a deadline — a backstop. It sits above both numbers
 * above so that a roast which merely runs long always comes back as a real
 * answer from the server (findings, abstention, or its own honest 504), and
 * this only ever fires for the one failure no server can report: a response
 * that never arrives at all — a slept laptop, a dropped connection, a proxy
 * that quietly closed an idle socket.
 */
export const CLIENT_TIMEOUT_MS = FUNCTION_TIMEOUT_MS + 20_000;
