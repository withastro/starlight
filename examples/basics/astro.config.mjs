import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
// TODO(HiDeoo) Remove or keep depending on the final decision regarding the peer dep change
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
	integrations: [
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
			],
		}),
		// TODO(HiDeoo) Remove or keep depending on the final decision regarding the peer dep change
		mdx(),
	],
});
