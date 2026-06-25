<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { onMount, setContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { recordMount, recordNav, stats } from './mounts.svelte';

  // Ingredient #1 — the persistent "teleport root". Holds a snippet registry in
  // context, renders {@render children()} (where panes register), and renders
  // the registered "side" snippet ELSEWHERE in its own tree. Survives every
  // navigation below, so it keeps rendering the registered snippet across them.
  const slots = $state<{ side?: Snippet }>({});
  setContext('repro', slots);

  let { children } = $props();
  const side = $derived(slots.side);

  afterNavigate((nav) => recordNav(nav.to?.url.pathname ?? '?', nav.type === 'enter'));
  onMount(() => recordMount('root +layout'));

  // Component tree (indent = nesting). `visits` = navigations to that route;
  // `mounts` = onMount count. mounts > visits ⇒ mounted more than once per visit.
  type Node = { label: string; depth: number; route: string | null };
  const tree: Node[] = [
    { label: 'root +layout', depth: 0, route: null },
    { label: 'index +page', depth: 1, route: '/' },
    { label: 'a/+layout', depth: 1, route: '/a' },
    { label: 'pane', depth: 2, route: '/a' },
    { label: 'a/+page', depth: 3, route: '/a' },
    { label: 'b/+layout', depth: 1, route: '/b' },
    { label: 'b/+page', depth: 2, route: '/b' },
    { label: 'c/+page', depth: 1, route: '/c' },
    { label: 'd/+layout', depth: 1, route: '/d' },
    { label: 'd/+page', depth: 2, route: '/d' }
  ];

  const treeText = $derived(
    tree
      .map((n) => {
        const name = `${'  '.repeat(n.depth)}${n.label}`;
        const visits = n.route === null ? stats.navs : (stats.byRoute[n.route] ?? 0);
        const mounts = stats.byNode[n.label] ?? 0;
        const flag = mounts > visits && visits > 0 ? '   <-- mounted twice per visit' : '';
        return `${name.padEnd(22)}visits: ${visits}   mounts: ${mounts}${flag}`;
      })
      .join('\n')
  );
</script>

<nav>
  <a href="/a">/a</a>
  <a href="/b">/b</a>
  <a href="/c">/c</a>
  <a href="/d">/d</a>
</nav>

<strong>clicks: {stats.clicks} | mounts: {stats.mounts}</strong>

<pre>{treeText}</pre>

<hr />

<!-- Registration host: the child route tree mounts here; <Pane> registers + renders nothing here. -->
<div style="display:contents">{@render children()}</div>

<!-- Teleport target: the registered snippet renders HERE, not where it was declared. -->
{#each side ? [side] : [] as s (1)}
  <div class="side-slot">{@render s()}</div>
{/each}
