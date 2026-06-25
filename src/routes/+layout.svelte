<script lang="ts">
  import { setContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { counter } from './counter.svelte';

  // Ingredient #1 — the persistent "teleport root". Holds a snippet registry in
  // context, renders {@render children()} (where panes register), and renders
  // the registered "side" snippet ELSEWHERE in its own tree. It survives every
  // navigation below, so it keeps rendering the registered snippet across them.
  const slots = $state<{ side?: Snippet }>({});
  setContext('repro', slots);

  let { children } = $props();
  const side = $derived(slots.side);
</script>

<nav>
  <a href="/a">/a teleport-outgoing</a>
  <a href="/b">/b 2-level dest</a>
  <a href="/c">/c 1-level dest</a>
  <a href="/d">/d no-teleport outgoing</a>
  <strong>total dest +page mounts: {counter.destMounts}</strong>
</nav>

<hr />

<!-- Registration host: the child route tree mounts here; <Pane> registers + renders nothing here. -->
<div style="display:contents">{@render children()}</div>

<!-- Teleport target: the registered snippet renders HERE, not where it was declared. -->
{#each side ? [side] : [] as s (1)}
  <div class="side-slot">{@render s()}</div>
{/each}
