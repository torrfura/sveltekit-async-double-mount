// Records EVERY +layout / +page onMount so the full mount picture is visible
// (on-page tally in the root layout + a console line). Uniform instrumentation —
// no route is left out, so you can see exactly what mounts once vs twice.
export const mounts = $state<Record<string, number>>({});

export function recordMount(name: string) {
  mounts[name] = (mounts[name] ?? 0) + 1;
  console.log(`[repro] onMount: ${name} (#${mounts[name]})`);
}
