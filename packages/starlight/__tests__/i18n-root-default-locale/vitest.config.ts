import { defineVitestConfig } from '../test-config';

export default defineVitestConfig({
	title: 'i18n with root default locale',
	defaultLocale: 'root',
	locales: {
		root: { label: 'French', lang: 'fr' },
		en: { label: 'English', lang: 'en-US' },
		ar: { label: 'Arabic', dir: 'rtl' },
	},
});
