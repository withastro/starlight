// @ts-check
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
	legacy: {
		collectionsBackwardsCompat: true,
	},
	integrations: [
		starlight({
			title: 'Legacy collections backwards compat',
			pagefind: false,
		}),
	],
});
