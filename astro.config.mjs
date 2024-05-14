import { defineConfig } from 'astro/config';

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  site: "https://m1cro.xyz",
  integrations: [svelte()]
});