<script lang="ts">
  import { beforeNavigate } from '$app/navigation';
  import { onMount, setContext, type Snippet } from 'svelte';
  import { host, lastNav, startNavigation, trackHost } from './mounts.svelte';

  // INGREDIENT 1 — the persistent "teleport host".
  // A descendant registers a snippet here via context; we render it elsewhere in
  // our own tree (the teleport target at the bottom). This layout survives every
  // navigation below, so it keeps rendering whatever is currently registered.
  const slot = $state<{ teleported?: Snippet }>({});
  setContext('teleport', slot);

  let { children } = $props();

  // Reset the per-navigation mount log BEFORE each navigation, so the panel only
  // ever shows the components that mounted during the latest navigation.
  beforeNavigate((n) => startNavigation(n.from?.url.pathname ?? '', n.to?.url.pathname ?? '?'));

  // The host itself mounts once and never again — that's the persistence.
  onMount(trackHost);

  const entries = $derived(Object.entries(lastNav.mounts).sort(([a], [b]) => a.localeCompare(b)));
  const doubled = $derived(entries.filter(([, n]) => n > 1).map(([label]) => label));
</script>

<nav>
  <a href="/teleporter">/teleporter</a>
  <a href="/nested">/nested</a>
  <a href="/flat">/flat</a>
  <a href="/inline">/inline</a>
</nav>

<p class="host">Persistent host mounted <strong>{host.mounts}×</strong> total — it survives every navigation (stays 1).</p>

<div class="panel" class:bug={doubled.length > 0}>
  <div class="nav-line">
    Last navigation: <code>{lastNav.from || '(none)'}</code> → <code>{lastNav.to}</code>
  </div>

  <p class="hint">Components that mounted during this one navigation:</p>
  <ul>
    {#each entries as [label, n] (label)}
      <li class:double={n > 1}>
        <code>{label}</code> — mounted {n}×{n > 1 ? '  ← MOUNTED TWICE' : ''}
      </li>
    {:else}
      <li class="empty">(none yet — click a link)</li>
    {/each}
  </ul>

  {#if doubled.length > 0}
    <p class="verdict fail">🐛 BUG: <code>{doubled.join(', ')}</code> mounted <strong>twice</strong> in this single navigation.</p>
  {:else if entries.length > 0}
    <p class="verdict pass">✅ every component mounted exactly once.</p>
  {/if}
</div>

<!-- The routed page tree mounts here. A <Teleport> inside it registers its
     content into `slot` but renders nothing at this spot. -->
<div style="display:contents">{@render children()}</div>

<!-- TELEPORT TARGET — the registered snippet renders HERE, in the persistent
     host's tree, NOT where it was declared. Remove this render and the bug
     disappears (the destination +page then mounts once). -->
{#if slot.teleported}
  <div class="teleport-target">{@render slot.teleported()}</div>
{/if}

<style>
  nav {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }
  .host {
    margin: 0 0 0.75rem;
    color: #555;
    font-size: 0.9rem;
  }
  .panel {
    border: 2px solid #cfcfcf;
    border-radius: 6px;
    padding: 0.75rem 1rem;
    background: #fafafa;
  }
  .panel.bug {
    border-color: #d33;
    background: #fff5f5;
  }
  .nav-line {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  .hint {
    margin: 0 0 0.25rem;
    color: #777;
    font-size: 0.85rem;
  }
  ul {
    margin: 0;
    padding-left: 1.25rem;
  }
  li {
    font-family: ui-monospace, monospace;
    font-size: 0.9rem;
  }
  li.double {
    color: #c00;
    font-weight: 700;
  }
  li.empty {
    list-style: none;
    color: #999;
    font-style: italic;
  }
  .verdict {
    margin: 0.6rem 0 0;
    font-size: 1rem;
    font-weight: 600;
  }
  .verdict.fail {
    color: #c00;
  }
  .verdict.pass {
    color: #2a7;
  }
  code {
    background: #eee;
    padding: 0 0.25rem;
    border-radius: 3px;
  }
  .teleport-target {
    margin-top: 1rem;
    padding: 0.75rem;
    border: 1px dashed #bbb;
    border-radius: 4px;
  }
</style>
