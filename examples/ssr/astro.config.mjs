import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
	output: 'server',
	adapter: node({
		mode: 'standalone',
	}),
	integrations: [
		starlight({
			title: 'My Docs',
			prerender: false,
			lastUpdated: true,
			social: {
				github: 'https://github.com/withastro/starlight',
			},
			sidebar: [
				{
					label: 'SSR Demo',
					link: '/demo',
				},
				{
					label: 'Guides',
					items: [
						{
							label: 'Example Guide',
							link: '/guides/example/',
						},
					],
				},
				{
					label: 'Reference',
					autogenerate: {
						directory: 'reference',
					},
				},
			],
		}),
	],
});
