<script lang="ts">
  import { onMount } from 'svelte';
  import { recordMount } from '../mounts.svelte';

  onMount(() => recordMount('c/+page'));
</script>

<h1>/c — 1-level destination (control)</h1>
<p><strong>/a → /c</strong> mounts once — /c has no <code>+layout</code>, so it is not a 2-level route.</p>
