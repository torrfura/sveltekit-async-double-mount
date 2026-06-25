<script lang="ts">
  import { onMount } from 'svelte';
  import { track } from '../mounts.svelte';

  // Control — an outgoing route that renders its child route INLINE instead of
  // teleporting it. Identical to /teleporter except it does not use <Teleport>.
  let { children } = $props();
  onMount(() => track('inline/+layout'));
</script>

<div>{@render children()}</div>
