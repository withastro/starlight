// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import node from '@astrojs/node';

const prerendering = process.env.STARLIGHT_PRERENDER === 'yes';

export default defineConfig({
	output: 'server',
	adapter: node({ mode: 'standalone' }),
	compressHTML: false, // for easier debugging
	// Output to different folders so the servers don't conflict with each other during tests.
	outDir: prerendering ? 'dist' : 'build',
	integrations: [
		starlight({
			title: 'SSR',
			prerender: prerendering,
			pagefind: false,
		}),
	],
});
