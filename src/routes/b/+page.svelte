<script lang="ts">
  import { onMount } from 'svelte';
  import { recordMount } from '../mounts.svelte';

  onMount(() => recordMount('b/+page'));
</script>

<h1>/b — 2-level destination (BUG)</h1>
<p>A single <strong>/a → /b</strong> navigation mounts this <code>+page</code> twice — see the tally above / the console.</p>
