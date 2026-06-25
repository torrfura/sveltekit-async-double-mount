<script lang="ts">
  import { onMount } from 'svelte';
  import { track } from '../mounts.svelte';

  // THE BUG: on `/teleporter → /nested`, this onMount fires TWICE for one
  // navigation. Its +layout (and every other component) mounts once.
  onMount(() => track('nested/+page'));
</script>

<h1>/nested — 2-level destination</h1>
<p>
  A single <code>/teleporter → /nested</code> navigation mounts this <code>+page</code>
  <strong>twice</strong> — see the tally above / the console.
</p>
