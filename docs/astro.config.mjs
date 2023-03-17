import { defineConfig } from 'astro/config';
import starbook from 'starbook';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starbook({
      title: 'StarBook',
      tagline: 'Launch your next docs with Astro',
    }),
  ],
});
