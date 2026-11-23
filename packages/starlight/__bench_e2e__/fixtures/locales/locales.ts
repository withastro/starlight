import builtinTranslations from '../../../src/translations';

export const nonRootLocales = Object.keys(builtinTranslations)
	.filter((lang) => lang !== 'en')
	// Lowercase key to match Astro content IDs.
	.map((lang) => ({ key: lang.toLowerCase(), lang }));
