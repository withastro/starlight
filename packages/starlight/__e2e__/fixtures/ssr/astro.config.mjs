import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import node from '@astrojs/node';

const prerendering = process.env.STARLIGHT_PRERENDER === 'yes';

export default defineConfig({
	output: 'server',
	adapter: node({ mode: 'standalone' }),
	compressHTML: false, // for easier debugging
	// Output to different folders and expose on different ports
	// on each case so the servers don't conflict with
	// each other during tests.
	outDir: prerendering ? 'dist' : 'build',
	server: {
		port: prerendering ? 4322 : 4321,
	},
	integrations: [
		starlight({
			title: 'SSR',
			prerender: prerendering,
			pagefind: false,
		}),
	],
});
