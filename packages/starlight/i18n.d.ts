import 'i18next';

declare module 'i18next' {
	interface CustomTypeOptions {
		defaultNS: typeof import('./utils/createTranslationSystem').I18nextNamespace;
		resources: {
			starlight: Record<import('./utils/createTranslationSystem').I18nKeys, string>;
		};
	}
}
