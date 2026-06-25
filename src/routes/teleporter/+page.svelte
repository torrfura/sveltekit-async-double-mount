<script lang="ts">
  import { onMount } from 'svelte';
  import { track } from '../mounts.svelte';

  onMount(() => track('teleporter/+page'));
</script>

<p>/teleporter — this page is teleported into the persistent host's slot.</p>
