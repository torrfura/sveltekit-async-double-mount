<script lang="ts">
  import { onMount } from 'svelte';
  import { track } from '../mounts.svelte';
  import Teleport from '../teleport.svelte';

  // PERSIST scenario: this layout survives /keep/a ⇄ /keep/b (only the +page
  // swaps). It teleports a STABLE, layout-owned snippet (the "rail"), NOT its
  // child route. Tests whether the candidate nav-start-clear fix keeps a
  // PERSISTING teleport visible across a child swap (the real layout's nav rail
  // is exactly this — persists while a sibling pane leaves/swaps).
  let { children } = $props();
  onMount(() => track('keep/+layout'));
</script>

<Teleport>{@render rail()}</Teleport>
<div>{@render children()}</div>

{#snippet rail()}
  <p class="rail"><strong>PERSISTENT RAIL</strong> — teleported; must stay visible across /keep/a ⇄ /keep/b</p>
{/snippet}

<style>
  .rail {
    padding: 0.5rem 0.75rem;
    border: 2px solid #2a7;
    border-radius: 4px;
    background: #f0fff6;
  }
</style>
