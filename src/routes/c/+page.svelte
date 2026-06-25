<script lang="ts">
  import { onMount } from 'svelte';
  import { counter } from '../counter.svelte';

  onMount(() => {
    counter.destMounts += 1;
    console.log(`[repro] /c +page onMount #${counter.destMounts}`);
  });
</script>

<h1>/c — 1-level destination (control)</h1>
<p><strong>/a → /c</strong> fires <code>onMount</code> once — /c has no <code>+layout</code>, so it is not a 2-level route.</p>
