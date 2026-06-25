<script lang="ts">
  import Pane from '../pane.svelte';

  // Ingredient #2 — the outgoing route teleports its CHILD ROUTE
  // ({@render children()}) through the persistent root's side slot.
  let { children } = $props();
</script>

<Pane>{@render children()}</Pane>
