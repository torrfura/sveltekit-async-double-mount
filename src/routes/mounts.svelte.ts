// Shared debug stats. `byRoute` counts navigations that land on a route
// (visits); `byNode` counts component onMounts. When a node's mounts exceed its
// visits, it mounted more than once per visit — that's the bug.
export const stats = $state({
  clicks: 0, // navigations after the initial load
  navs: 0, // all navigations incl. the initial load
  mounts: 0, // total component onMounts
  byNode: {} as Record<string, number>, // node label -> onMount count
  byRoute: {} as Record<string, number> // route path -> visit count
});

export function recordMount(name: string) {
  stats.byNode[name] = (stats.byNode[name] ?? 0) + 1;
  stats.mounts += 1;
  console.log(`[repro] onMount: ${name} (#${stats.byNode[name]})`);
}

export function recordNav(path: string, initial: boolean) {
  stats.navs += 1;
  stats.byRoute[path] = (stats.byRoute[path] ?? 0) + 1;
  if (!initial) stats.clicks += 1;
}
