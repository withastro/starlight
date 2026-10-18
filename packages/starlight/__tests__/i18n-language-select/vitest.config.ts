import { defineVitestConfig } from '../test-config';

export default defineVitestConfig({
	title: 'i18n language select',
	// The `root` locale is intentionally not the first key so that the order of the `locales` object
	// cannot mask the currently selected locale in the language picker.
	locales: {
		en: { label: 'English', lang: 'en-US' },
		root: { label: 'Français', lang: 'fr' },
	},
});
