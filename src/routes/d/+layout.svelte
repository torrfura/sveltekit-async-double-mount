<script lang="ts">
  import { onMount } from 'svelte';
  import { recordMount } from '../mounts.svelte';

  // Control — outgoing route WITHOUT teleport: renders the child route inline.
  let { children } = $props();

  onMount(() => recordMount('d/+layout (renders child inline)'));
</script>

<div>{@render children()}</div>
