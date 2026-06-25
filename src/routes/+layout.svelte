<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { mounts, recordMount } from './mounts.svelte';

  // Ingredient #1 — the persistent "teleport root". Holds a snippet registry in
  // context, renders {@render children()} (where panes register), and renders
  // the registered "side" snippet ELSEWHERE in its own tree. It survives every
  // navigation below, so it keeps rendering the registered snippet across them.
  const slots = $state<{ side?: Snippet }>({});
  setContext('repro', slots);

  let { children } = $props();
  const side = $derived(slots.side);

  onMount(() => recordMount('+layout (root, persistent)'));
</script>

<nav>
  <a href="/a">/a teleport-outgoing</a>
  <a href="/b">/b 2-level dest</a>
  <a href="/c">/c 1-level dest</a>
  <a href="/d">/d no-teleport outgoing</a>
</nav>

<!-- onMount tally (every layout + page is instrumented; reset on full reload) -->
<table>
  <tbody>
    {#each Object.entries(mounts) as [name, n] (name)}
      <tr><td>{name}</td><td><strong>{n}</strong></td></tr>
    {/each}
  </tbody>
</table>

<hr />

<!-- Registration host: the child route tree mounts here; <Pane> registers + renders nothing here. -->
<div style="display:contents">{@render children()}</div>

<!-- Teleport target: the registered snippet renders HERE, not where it was declared. -->
{#each side ? [side] : [] as s (1)}
  <div class="side-slot">{@render s()}</div>
{/each}
