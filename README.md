# SvelteKit `experimental.async` — destination `+page` mounts twice

On the experimental async compiler surface, a destination route's `+page`
component **mounts twice** on a single client-side navigation.

Versions: `@sveltejs/kit@3.0.0-next.4`, `svelte@5.56.3`, `vite@8`.
Requires `compilerOptions.experimental.async: true` (see `vite.config.ts`).

## Run

```bash
npm install
npm run dev
```

Open the browser console. Go to `/a`, then click **/b**.

## Expected vs actual

A single **`/a → /b`** navigation should mount `/b`'s `+page` once. It mounts
twice:

```
[repro] /b +page onMount #1
[repro] /b +page onMount #2
```

## The three conditions (each control removes one → single mount)

| Navigation | Outgoing teleports its child route? | Destination | `+page` `onMount` fires |
| --- | --- | --- | --- |
| `/a → /b` | yes | 2-level (`+layout` + `+page`) | **twice** |
| `/a → /c` | yes | 1-level (`+page` only) | once |
| `/d → /b` | no (renders child inline) | 2-level | once |

So all three must hold:

1. **A persistent parent `+layout`** registers a descendant's snippet (via
   context) and renders it **elsewhere** in its own tree — a "teleport" — and
   survives the navigation (`src/routes/+layout.svelte`, `src/routes/pane.svelte`).
2. **The outgoing route teleports its child route** `{@render children()}`
   through that parent (`src/routes/a/+layout.svelte`).
3. **The destination is a 2-level route** (`+layout` + `+page`) — `src/routes/b/`.

## Why it matters

The discarded first instance renders and is then torn down **while still
reactively alive**, which surfaces in real apps as Svelte `derived_inert`
warnings ("Reading a derived belonging to a now-destroyed effect") plus a wasted
render. It is stripped from production builds, but points at a fragile
teardown/mount interaction under `experimental.async`.

This is exactly the shape of a teleport/portal layout system (a pane registers
its content in a store; a persistent root renders it elsewhere), so any such
layout that teleports a child route trips it when navigating to a nested route.
