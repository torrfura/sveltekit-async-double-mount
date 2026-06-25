<script lang="ts">
  import { onMount } from 'svelte';
  import { recordMount } from '../mounts.svelte';

  // Ingredient #3 — this +layout makes /b a TWO-LEVEL route (+layout + +page).
  // Passthrough — it does nothing but exist. Remove it (making /b 1-level, like
  // /c) and the double-mount disappears.
  let { children } = $props();

  onMount(() => recordMount('b/+layout'));
</script>

{@render children()}
