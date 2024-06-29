import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import node from '@astrojs/node';

export default defineConfig({
	output: 'server',
	adapter: node({ mode: 'standalone' }),
	integrations: [
		starlight({
			title: 'Docs',
			prerender: process.env.STARLIGHT_SSR !== 'yes',
			pagefind: false,
		}),
	],
});
