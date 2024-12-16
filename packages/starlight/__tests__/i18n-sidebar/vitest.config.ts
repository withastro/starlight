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
		{
			slug: 'manual-setup',
			label: 'Do it yourself',
			translations: { fr: 'Fait maison' },
			badge: { text: { 'en-US': 'New', fr: 'Nouveau' } },
		},
		{
			slug: 'environmental-impact',
			badge: {
				variant: 'success',
				text: { 'en-US': 'Eco-friendly', fr: 'Écologique' },
			},
		},
		{
			label: 'Guides',
			items: [{ slug: 'guides/pages' }, { slug: 'guides/authoring-content', badge: 'Deprecated' }],
		},
		'resources/plugins',
	],
});
