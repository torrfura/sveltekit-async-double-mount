<script lang="ts">
  import { onMount } from 'svelte';
  import Pane from '../pane.svelte';
  import { recordMount } from '../mounts.svelte';

  // Ingredient #2 — the outgoing route teleports its CHILD ROUTE
  // ({@render children()}) through the persistent root's side slot.
  let { children } = $props();

  onMount(() => recordMount('a/+layout'));
</script>

<Pane>{@render children()}</Pane>
