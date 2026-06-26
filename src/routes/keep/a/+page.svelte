<script lang="ts">
  import { onMount } from 'svelte';
  import { track } from '../../mounts.svelte';

  onMount(() => track('keep/a/+page'));
</script>

<h1>/keep/a</h1>
<p>The /keep layout (and its teleported rail) persists when navigating to /keep/b.</p>
