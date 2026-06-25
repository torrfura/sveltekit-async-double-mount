<script lang="ts">
  // Ingredient #3 — this +layout makes /b a TWO-LEVEL route (+layout + +page).
  // Passthrough — it does nothing but exist. Remove it (making /b 1-level, like
  // /c) and the double-mount disappears.
  let { children } = $props();
</script>

{@render children()}
