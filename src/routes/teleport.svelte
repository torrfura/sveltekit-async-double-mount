<script lang="ts">
  import { getContext, untrack, type Snippet } from 'svelte';
  import { page } from '$app/state';

  // A portal: registers its `children` snippet into the persistent host's slot
  // and renders NOTHING itself. The host renders the snippet elsewhere in its
  // own tree (see the teleport target in `+layout.svelte`).
  let { children }: { children: Snippet } = $props();
  const slot = getContext<{ teleported?: Snippet }>('teleport');

  // Register synchronously at setup so the slot is populated during SSR.
  untrack(() => {
    slot.teleported = children;
  });

  // EXP3 — persist-safe re-assert. The host clears the slot at nav-START (see
  // its onNavigate), which kills the LEAVING teleport's render before the
  // destination mounts (→ single mount). This effect reads `page.url` so it
  // re-runs on EVERY navigation: a SURVIVING teleport re-asserts its snippet
  // after the host cleared it; a LEAVING teleport unmounts and never re-runs.
  $effect(() => {
    void page.url; // dependency: re-run this effect on every navigation
    slot.teleported = children;
    return () => {
      slot.teleported = undefined;
    };
  });
</script>
