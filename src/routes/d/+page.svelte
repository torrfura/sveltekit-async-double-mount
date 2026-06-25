<script lang="ts">
  import { onMount } from 'svelte';
  import { recordMount } from '../mounts.svelte';

  onMount(() => recordMount('d/+page'));
</script>

<p>/d — page content (rendered inline, no teleport). Navigate /d → /b: mounts once.</p>
