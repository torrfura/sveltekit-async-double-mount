<script lang="ts">
  import { onMount } from 'svelte';
  import { track } from './mounts.svelte';

  onMount(() => track('index/+page'));
</script>

<h1><code>experimental.async</code> — destination <code>+page</code> mounts twice</h1>

<p>Open the console. Click <strong>/teleporter</strong>, then click <strong>/nested</strong>.</p>

<p>
  The panel above shows the components that mounted during the <em>last</em> navigation only (it resets on
  every navigation). For <code>/teleporter → /nested</code> it reports
  <strong><code>nested/+page</code> mounted twice</strong> with a 🐛 verdict. The two controls
  (<code>/flat</code>, <code>/inline</code>) report ✅ every component mounted once.
</p>

<p>See <code>README.md</code> for the three required conditions.</p>
