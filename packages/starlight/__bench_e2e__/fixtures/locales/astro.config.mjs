import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import { nonRootLocales } from './locales';

export default defineConfig({
	site: 'https://example.com',
	integrations: [
		starlight({
			title: 'All locales benchmark',
			pagefind: false,
			locales: {
				root: { label: 'English', lang: 'en' },
				...Object.fromEntries(nonRootLocales.map(({ key, lang }) => [key, { label: lang, lang }])),
			},
		}),
	],
});
