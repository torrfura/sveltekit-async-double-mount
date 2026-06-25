<script lang="ts">
  import { onMount } from 'svelte';
  import { track } from '../mounts.svelte';

  onMount(() => track('inline/+page'));
</script>

<h1>/inline — renders its child inline (control)</h1>
<p><code>/inline → /nested</code> mounts once — /inline does not teleport, so the destination mounts normally.</p>
