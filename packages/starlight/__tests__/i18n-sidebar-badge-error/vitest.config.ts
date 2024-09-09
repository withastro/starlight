import { defineVitestConfig } from '../test-config';

export default defineVitestConfig({
	title: 'i18n sidebar badge error',
	locales: {
		fr: { label: 'French' },
		root: { label: 'English', lang: 'en-US' },
	},
	sidebar: [
		{
			slug: 'getting-started',
			badge: { text: { fr: 'Nouveau' } },
		},
	],
});
