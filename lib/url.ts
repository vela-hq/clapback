// The URL as the UI talks about it: no scheme, no trailing slash, no stray
// whitespace from a copied address bar.
//
// The form renders "https://" as fixed chrome beside the input, so the scheme is
// noise in the value itself — a pasted "https://example.com/" showing up whole
// reads as "https://https://example.com/". Stripping it here keeps the field
// honest in both directions: what the user sees (the chrome plus this value) is
// exactly the URL checkUrl reconstructs and roasts.
//
// http:// goes too, even though the chrome then contradicts what was pasted. The
// field has no way to render a scheme other than https, so keeping http:// in
// the value would mean quietly roasting a different URL than the one on screen.
// Losing it costs nothing real: the http-only sites left are on private networks,
// which urlguard blocks anyway.
export function displayUrl(raw: string): string {
  return raw.trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");
}
