import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import node from '@astrojs/node';

export default defineConfig({
	output: 'server',
	adapter: node({ mode: 'standalone' }),
	compressHTML: false, // for easier debugging
	integrations: [
		starlight({
			title: 'Docs',
			prerender: process.env.STARLIGHT_PRERENDER === 'yes',
			pagefind: false,
		}),
	],
});
