import { defineVitestConfig } from '../test-config';

export default defineVitestConfig({
	title: 'i18n sidebar',
	locales: {
		fr: { label: 'French' },
		root: { label: 'English', lang: 'en-US' },
	},
	sidebar: [
		{ slug: 'index' },
		'getting-started',
		{ slug: 'manual-setup', label: 'Do it yourself', translations: { fr: 'Fait maison' } },
		{ slug: 'environmental-impact' },
		{
			label: 'Guides',
			items: [{ slug: 'guides/pages' }, { slug: 'guides/authoring-content' }],
		},
		'resources/plugins',
	],
});
