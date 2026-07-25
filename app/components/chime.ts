// The "your roast landed" notification sound.
//
// Synthesized rather than shipped as an asset: it is two sine notes, and a file
// would be a network request on a page whose whole point is that nothing is
// loading. Deliberately short and soft — it fires when the user has walked away
// from the modal and is reading the page, so it has to read as a notification,
// not an alarm.
//
// Everything here is best-effort. Autoplay policy, a missing AudioContext, a
// locked-down browser: none of that is worth an error, because the pill already
// says the same thing visually.
export function playRoastChime(): void {
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return;

    const ctx = new Ctx();
    // Started from a click on "get my roast", so the context is normally already
    // running; resume covers the case where the tab was backgrounded.
    if (ctx.state === "suspended") void ctx.resume();

    const now = ctx.currentTime;
    // A5 then E6 — a rising fifth, the shape every "done" chime has.
    const notes: [number, number][] = [
      [880, 0],
      [1318.5, 0.13],
    ];

    for (const [freq, at] of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      // Ramp both ends: a raw start/stop on a sine is a click.
      gain.gain.setValueAtTime(0.0001, now + at);
      gain.gain.exponentialRampToValueAtTime(0.16, now + at + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + at + 0.4);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + at);
      osc.stop(now + at + 0.45);
    }

    // Contexts are a finite resource; let this one go once the tail is done.
    setTimeout(() => void ctx.close().catch(() => {}), 1200);
  } catch {
    // Sound is a garnish. Never let it break the run.
  }
}
