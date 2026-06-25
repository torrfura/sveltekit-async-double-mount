<script lang="ts">
  import { onMount } from 'svelte';
  import { track } from '../mounts.svelte';

  onMount(() => track('flat/+page'));
</script>

<h1>/flat — 1-level destination (control)</h1>
<p><code>/teleporter → /flat</code> mounts once — /flat has no <code>+layout</code>, so it is not a 2-level route.</p>
