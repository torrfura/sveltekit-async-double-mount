# `experimental.async`: a destination `+page` mounts twice on one navigation

Minimal reproduction. With Svelte's `compilerOptions.experimental.async` enabled, a
destination route's **`+page` component is instantiated twice on a single
client-side navigation** — its `onMount` fires twice, and the first instance is
created, rendered, and then torn down again while still reactively alive.

It happens only in a specific (but ordinary) shape: a **persistent layout that
renders a snippet teleported up from a descendant**, when you navigate **from** a
route that teleports its child **to** a two-level destination route. Only the
destination `+page` leaf doubles — every layout, and the persistent host itself,
mount once.

There are **no `await` expressions anywhere in this repro** — so this is not about
async data or update coordination. It is purely the `experimental.async` rendering
machinery's mount/teardown behaviour. (Turn the flag off and the bug disappears.)

## Environment

| | |
| --- | --- |
| `svelte` | `5.56.3` |
| `@sveltejs/kit` | `3.0.0-next.4` |
| `@sveltejs/vite-plugin-svelte` | `7.1.2` |
| `vite` | `8.0.16` |
| node | `24.14.0` (macOS; not OS-specific) |

The flag is set in `vite.config.ts` (as of `@sveltejs/kit@3.0.0-next`, there is no
`svelte.config.js`; SvelteKit config is passed to the `sveltekit({...})` plugin):

```ts
sveltekit({
  compilerOptions: { experimental: { async: true } }
})
```

## Reproduce

```bash
npm install
npm run dev          # http://localhost:5173
```

1. Open the page and the browser console.
2. Click **`/teleporter`**.
3. Click **`/nested`**.

That single `/teleporter → /nested` navigation mounts `nested/+page` **twice**.

### What you'll see

The on-page panel **resets at the start of every navigation** (via `beforeNavigate`)
and lists only the components that mounted during *that one* navigation, with a
verdict — so there is nothing cumulative to misread:

```
Last navigation: /teleporter → /nested
  nested/+layout — mounted 1×
  nested/+page   — mounted 2×   ← MOUNTED TWICE
🐛 BUG: nested/+page mounted twice in this single navigation.
```

The console logs `🐛 DOUBLE MOUNT: nested/+page mounted 2× …`. `nested/+layout` and
everything else mount once; the persistent host mounted once on load and never
again (shown on its own line).

## Expected vs actual

- **Expected:** `nested/+page` mounts once per navigation to `/nested`.
- **Actual:** it mounts twice — two `onMount` calls (and two `$effect`/`$derived`
  set-ups) for one navigation; the first instance is then destroyed.

## The three conditions (remove any one → single mount)

Each row is a button in the app; the two control rows mount the destination once.

| Navigation | Outgoing teleports its child route? | Destination shape | destination `+page` mounts |
| --- | --- | --- | --- |
| `/teleporter → /nested` | **yes** | **2-level** (`+layout` + `+page`) | **twice** 🐛 |
| `/teleporter → /flat` | yes | 1-level (`+page` only) | once ✅ |
| `/inline → /nested` | no (renders child inline) | 2-level | once ✅ |

All three must hold:

1. **A persistent parent `+layout` teleports a descendant's snippet.** It receives a
   snippet through a context store and renders it **elsewhere** in its own tree (a
   "portal"), and it survives the navigation.
   → `src/routes/+layout.svelte` (the host + the `{@render slot.teleported()}`
   target) and `src/routes/teleport.svelte` (registers the snippet, renders nothing).
2. **The outgoing route teleports its own child route** through that parent —
   `<Teleport>{@render children()}</Teleport>`.
   → `src/routes/teleporter/+layout.svelte`.
3. **The destination is a 2-level route** (`+layout` + `+page`).
   → `src/routes/nested/` (delete `nested/+layout.svelte` to make it 1-level → the
   double-mount stops).

## It is specifically the *render* of the teleported snippet

A fourth knob, inside the persistent host: delete the
`{@render slot.teleported()}` target in `src/routes/+layout.svelte` (keep
everything else) and the destination `+page` drops back to **one** mount. So the
trigger is the persistent host **rendering the outgoing route's teleported
snippet, concurrent with the navigation**. Rendering a host-owned snippet in the
same spot does *not* cause it — only a snippet owned by the outgoing (now
tearing-down) route does.

## What it is NOT (ruled out)

- **Not the `{#each}` key.** The host renders the snippet with a plain
  `{#if slot.teleported}{@render slot.teleported()}{/if}` — no keyed block.
- **Not `await` / async data.** There are no `await` expressions in the repro.
- **Not SSR / hydration.** It happens on a client-side navigation, after the first
  page is already hydrated.
- **Not the clear-on-unmount.** The portal clears its slot on unmount; never
  clearing it still double-mounts.
- **Not the flag being off.** Set `experimental.async: false` and it stops.

## Why this pattern is not contrived

It is a standard persistent-shell layout. A persistent, View-Transition-animated
multi-pane grid stays mounted across navigations; each route declares which pane it
fills via a small component that registers its content (a snippet) into a context
store, and the persistent shell renders each registered snippet into its grid cell.
Route content is therefore *declared* deep in the route tree but *rendered* by the
persistent shell — exactly the teleport here. This repro is the smallest version of
that shell.

## Why it matters

The discarded first instance renders and is then torn down **while still reactively
alive**. In a real app this surfaces as Svelte `derived_inert` warnings ("Reading a
derived belonging to a now-destroyed effect"), duplicated `onMount` side effects,
and a wasted render. The `derived_inert` warning is stripped from production builds,
but the double instantiation is not.

## Code map

| File | Role |
| --- | --- |
| `src/routes/+layout.svelte` | Persistent host: context slot, render host (`{@render children()}`), teleport target (`{@render slot.teleported()}`), per-navigation panel. |
| `src/routes/teleport.svelte` | Portal: registers `children` into the slot, renders nothing. |
| `src/routes/teleporter/` | Outgoing route that teleports its child (`+layout` wraps `{@render children()}` in `<Teleport>`). |
| `src/routes/nested/` | 2-level destination — `nested/+page` is the one that mounts twice. |
| `src/routes/flat/` | Control: 1-level destination. |
| `src/routes/inline/` | Control: outgoing route that renders its child inline (no teleport). |
| `src/routes/mounts.svelte.ts` | Per-navigation mount log + console logging. |
