<h1>SvelteKit <code>experimental.async</code> — destination <code>+page</code> double-mounts</h1>

<p>Open the browser console, go to <a href="/a">/a</a>, then click <strong>/b</strong>.</p>

<ul>
  <li><strong>/a → /b</strong>: <code>/b</code> <code>onMount</code> fires <strong>twice</strong> (bug).</li>
  <li><strong>/a → /c</strong>: fires once (destination is 1-level).</li>
  <li><strong>/d → /b</strong>: fires once (outgoing doesn't teleport).</li>
</ul>

<p>See <code>README.md</code>.</p>
