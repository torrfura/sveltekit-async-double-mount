<script lang="ts">
  import { getContext, untrack } from 'svelte';
  import type { Snippet } from 'svelte';

  // A "teleporting pane": registers its `children` snippet into the shared
  // context store and renders NOTHING itself. The root +layout renders the
  // registered snippet elsewhere in its own tree.
  let { children }: { children: Snippet } = $props();
  const slots = getContext<{ side?: Snippet }>('repro');

  // Register synchronously at setup (so the slot is populated during SSR/render).
  untrack(() => {
    slots.side = children;
  });

  // Keep fresh on prop changes; clear on unmount.
  $effect(() => {
    slots.side = children;
    return () => {
      slots.side = undefined;
    };
  });
</script>
