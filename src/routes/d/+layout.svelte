<script lang="ts">
  // Control — outgoing route WITHOUT teleport: renders the child route inline.
  let { children } = $props();
</script>

<div>{@render children()}</div>
