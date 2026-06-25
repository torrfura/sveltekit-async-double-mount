<script lang="ts">
  import { getContext, untrack, type Snippet } from 'svelte';

  // A portal: registers its `children` snippet into the persistent host's slot
  // and renders NOTHING itself. The host renders the snippet elsewhere in its
  // own tree (see the teleport target in `+layout.svelte`).
  let { children }: { children: Snippet } = $props();
  const slot = getContext<{ teleported?: Snippet }>('teleport');

  // Register synchronously at setup so the slot is populated during SSR.
  untrack(() => {
    slot.teleported = children;
  });

  // Keep it fresh on prop changes; clear it on unmount.
  $effect(() => {
    slot.teleported = children;
    return () => {
      slot.teleported = undefined;
    };
  });
</script>
