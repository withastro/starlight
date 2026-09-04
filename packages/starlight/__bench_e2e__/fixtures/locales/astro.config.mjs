import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import builtinTranslations from '../../../translations/index.ts';

export default defineConfig({
	integrations: [
		starlight({
			title: 'All locales benchmark',
			pagefind: false,
			defaultLocale: 'en',
			locales: Object.fromEntries(
				Object.keys(builtinTranslations).map((locale) => [locale, { label: locale }])
			),
		}),
	],
});
