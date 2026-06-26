<script lang="ts">
  import { onMount } from 'svelte';
  import { track } from '../../mounts.svelte';

  onMount(() => track('keep/b/+page'));
</script>

<h1>/keep/b</h1>
<p>The /keep layout (and its teleported rail) persisted across the swap from /keep/a.</p>
