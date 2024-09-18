/*
 * This file imports the original `i18next` types and extends them to configure the
 * Starlight namespace.
 *
 * Note that the top-level `import` makes this module non-ambient, so can’t be
 * combined with other `.d.ts` files such as `locals.d.ts`.
 */

import 'i18next';

declare module 'i18next' {
	interface CustomTypeOptions {
		defaultNS: typeof import('./utils/createTranslationSystem').I18nextNamespace;
		resources: {
			starlight: Record<import('./utils/createTranslationSystem').I18nKeys, string>;
		};
	}
}
