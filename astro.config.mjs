import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

const BASE = process.env.ASTRO_BASE || '/';

export default defineConfig({
  base: BASE,
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
  output: 'static',
});
