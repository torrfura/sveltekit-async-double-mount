import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

// As of @sveltejs/kit@3.0.0-next, svelte.config.js is gone — SvelteKit config is
// passed to the sveltekit(...) plugin here. The bug ONLY reproduces with
// compilerOptions.experimental.async = true.
//
// No adapter: this is a dev-only repro (`npm run dev`); an adapter is only
// needed for `vite build`.
export default defineConfig(async () => ({
  plugins: [
    ...(await sveltekit({
      preprocess: vitePreprocess(),
      compilerOptions: {
        experimental: {
          async: true
        }
      }
    }))
  ]
}));
