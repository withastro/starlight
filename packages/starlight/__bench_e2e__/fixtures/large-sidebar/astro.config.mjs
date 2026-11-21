import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
	integrations: [
		starlight({
			title: 'Large sidebar benchmark',
			pagefind: false,
			sidebar: [{ label: 'Reference', items: [{ autogenerate: { directory: 'reference' } }] }],
		}),
	],
});
