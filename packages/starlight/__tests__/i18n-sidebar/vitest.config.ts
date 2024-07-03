import { defineVitestConfig } from '../test-config';

export default defineVitestConfig({
	title: 'i18n sidebar',
	defaultLocale: 'en',
	locales: {
		fr: { label: 'French' },
		en: { label: 'English', lang: 'en-US' },
	},
	sidebar: [
		{ slug: 'index' },
		'getting-started',
		{ slug: 'manual-setup' },
		{ slug: 'environmental-impact' },
		{
			label: 'Guides',
			items: [{ slug: 'guides/pages' }, { slug: 'guides/authoring-content' }],
		},
		'resources/plugins',
	],
});
