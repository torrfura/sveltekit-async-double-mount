// Per-NAVIGATION mount log. Cleared at the start of every navigation (see
// `beforeNavigate` in +layout.svelte), so the panel always shows ONLY what
// mounted during the LAST navigation — never an accumulation across clicks.
// A label with count > 1 here mounted more than once in ONE navigation = the bug.
export const lastNav = $state<{ from: string; to: string; mounts: Record<string, number> }>({
  from: '',
  to: '(initial load)',
  mounts: {}
});

// The persistent host's mount count — proves it mounts ONCE and survives every
// navigation (this stays 1 no matter how much you click).
export const host = $state<{ mounts: number }>({ mounts: 0 });

export function startNavigation(from: string, to: string) {
  lastNav.from = from;
  lastNav.to = to;
  lastNav.mounts = {};
}

/** Called from every route component's `onMount`. */
export function track(label: string) {
  const n = (lastNav.mounts[label] = (lastNav.mounts[label] ?? 0) + 1);
  if (n > 1) console.warn(`🐛 DOUBLE MOUNT: ${label} mounted ${n}× in one navigation → ${lastNav.to}`);
  else console.log(`[mount] ${label} → ${lastNav.to}`);
}

/** Called from the persistent host's `onMount` only. */
export function trackHost() {
  host.mounts += 1;
}
