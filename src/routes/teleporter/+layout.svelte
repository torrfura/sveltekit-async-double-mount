<script lang="ts">
  import { onMount } from 'svelte';
  import { track } from '../mounts.svelte';
  import Teleport from '../teleport.svelte';

  // INGREDIENT 2 — the outgoing route teleports its CHILD ROUTE
  // ({@render children()}) up through the persistent host, via <Teleport>.
  let { children } = $props();
  onMount(() => track('teleporter/+layout'));
</script>

<Teleport>{@render children()}</Teleport>
