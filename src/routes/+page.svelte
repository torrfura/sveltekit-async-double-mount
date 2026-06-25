<script lang="ts">
  import { onMount } from 'svelte';
  import { recordMount } from './mounts.svelte';

  onMount(() => recordMount('index +page'));
</script>

<h1>SvelteKit <code>experimental.async</code> — destination <code>+page</code> double-mounts</h1>

<p>Open the browser console, go to <a href="/a">/a</a>, then click <strong>/b</strong>.</p>

<ul>
  <li><strong>/a → /b</strong>: <code>/b</code> <code>+page</code> mounts <strong>twice</strong> (bug).</li>
  <li><strong>/a → /c</strong>: mounts once (destination is 1-level).</li>
  <li><strong>/d → /b</strong>: mounts once (outgoing doesn't teleport).</li>
</ul>

<p>The tally above lists every layout/page <code>onMount</code>. See <code>README.md</code>.</p>
