# SvelteKit `experimental.async` — destination `+page` mounts twice

On the experimental async compiler surface, a destination route's `+page`
component **mounts twice** on a single client-side navigation. Only the
destination `+page` leaf doubles — its `+layout` and every other route/layout
mount once. (Every layout and page is instrumented; watch the on-page tally and
the console.)

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
twice — the console (and the on-page tally) show:

```
[repro] onMount: b/+page (#1)
[repro] onMount: b/+page (#2)
```

`b/+layout` and everything else stay at 1.

## The three conditions (each control removes one → single mount)

| Navigation | Outgoing teleports its child route? | Destination | destination `+page` mounts |
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

## Why this pattern?

It's how our app's layout shell works. A persistent, animated multi-pane grid
(named regions — a main area, side rails, a wide work area) stays mounted across
navigations so View Transitions can animate panes in/out and the chrome stays
put. Each route declares which regions it fills via a small `<Pane>` component
that registers its content (a snippet) into a context store; the persistent root
renders each registered snippet into its grid cell. So route content is declared
deep in the route tree but rendered by the persistent shell — the teleport. A
standard "persistent shell + slots" layout, not a contrived setup.

## Why it matters

The discarded first instance renders and is then torn down **while still
reactively alive**, which surfaces in real apps as Svelte `derived_inert`
warnings ("Reading a derived belonging to a now-destroyed effect") plus a wasted
render. It is stripped from production builds, but points at a fragile
teardown/mount interaction under `experimental.async`.
