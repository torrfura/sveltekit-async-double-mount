<script lang="ts">
  import { onMount } from 'svelte';
  import { recordMount } from '../mounts.svelte';

  onMount(() => recordMount('a/+page'));
</script>

<p>/a — page content (teleported into the side slot by the persistent root).</p>
