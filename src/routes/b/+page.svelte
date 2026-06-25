<script lang="ts">
  import { onMount } from 'svelte';
  import { counter } from '../counter.svelte';

  onMount(() => {
    counter.destMounts += 1;
    console.log(`[repro] /b +page onMount #${counter.destMounts}`);
  });
</script>

<h1>/b — 2-level destination (BUG)</h1>
<p>A single <strong>/a → /b</strong> navigation fires this <code>onMount</code> twice — see the console.</p>
