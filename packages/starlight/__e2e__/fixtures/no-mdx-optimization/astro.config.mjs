// @ts-check
import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
	integrations: [
		starlight({
			title: 'Basics',
			pagefind: false,
		}),
		// Starlight sets `optimize: true`, so we provide our own copy of the MDX integration to test without optimization.
		mdx({ optimize: false }),
	],
});
