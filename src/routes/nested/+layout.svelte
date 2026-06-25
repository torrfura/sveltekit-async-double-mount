<script lang="ts">
  import { onMount } from 'svelte';
  import { track } from '../mounts.svelte';

  // INGREDIENT 3 — this +layout makes /nested a TWO-LEVEL route (+layout + +page).
  // It is a pure passthrough. Delete this file (making /nested one-level, like
  // /flat) and the double-mount disappears.
  let { children } = $props();
  onMount(() => track('nested/+layout'));
</script>

{@render children()}
