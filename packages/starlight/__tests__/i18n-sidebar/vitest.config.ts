import { defineVitestConfig } from '../test-config';

export default defineVitestConfig({
	title: 'i18n sidebar',
	defaultLocale: 'en',
	locales: {
		fr: { label: 'French' },
		en: { label: 'English', lang: 'en-US' },
	},
	sidebar: [
		{ slug: 'getting-started' },
		{
			label: 'Group',
			items: [{ slug: 'guides/authoring-content' }, { slug: 'guides/components' }],
		},
	],
});
