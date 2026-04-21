import { defineVitestConfig } from '../test-config';

export default defineVitestConfig({
	title: 'i18n with a single root locale',
	locales: {
		root: { label: 'Français', lang: 'fr-CA' },
	},
});
