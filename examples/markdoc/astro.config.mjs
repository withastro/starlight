import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import markdoc from '@astrojs/markdoc';

// https://astro.build/config
export default defineConfig({
	integrations: [
		markdoc(),
		starlight({
			title: 'My Docs',
			social: {
				github: 'https://github.com/withastro/starlight',
			},
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
				// TODO(HiDeoo) Remove this entire group once the feature is ready.
				{
					label: '⚠️ Demo ⚠️',
					badge: { text: 'To remove', variant: 'danger' },
					autogenerate: { directory: 'demo' },
				},
			],
		}),
	],
});
