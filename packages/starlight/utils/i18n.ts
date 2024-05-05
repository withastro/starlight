import type { AstroUserConfig } from 'astro/config';
import type { StarlightConfig } from './user-config';

/** Informations about the built-in default locale used as a fallback when no locales are defined. */
export const BuiltInDefaultLocale = makeBuiltInDefaultLocale('en', 'ltr');

/** Generate the Astro i18n configuration to use based on a Starlight configuration. */
export function getAstroI18nConfig(config: StarlightConfig): NonNullable<AstroUserConfig['i18n']> {
	return {
		defaultLocale:
			config.defaultLocale.lang ?? config.defaultLocale.locale ?? BuiltInDefaultLocale.lang,
		locales: config.locales
			? Object.entries(config.locales).map(([locale, localeConfig]) => {
					return {
						codes: [localeConfig?.lang ?? locale],
						path: locale === 'root' ? localeConfig?.lang ?? BuiltInDefaultLocale.lang : locale,
					};
			  })
			: [BuiltInDefaultLocale.lang],
		routing: {
			prefixDefaultLocale:
				// Sites with multiple languages without a root locale.
				(config.isMultilingual && config.locales?.root === undefined) ||
				// Sites with a single non-root language different from the built-in default locale.
				(!config.isMultilingual && config.locales !== undefined),
		},
	};
}

/**
 * Get the string for the passed language from a dictionary object.
 *
 * TODO: Make this clever. Currently a simple key look-up, but should use
 * BCP-47 mapping so that e.g. `en-US` returns `en` strings, and use the
 * site’s default locale as a last resort.
 *
 * @example
 * pickLang({ en: 'Hello', fr: 'Bonjour' }, 'en'); // => 'Hello'
 */
export function pickLang<T extends Record<string, string>>(
	dictionary: T,
	lang: keyof T
): string | undefined {
	return dictionary[lang];
}

/** Generates the built-in default locale informations used as a fallback when no locales are defined. */
function makeBuiltInDefaultLocale(lang: string, dir: 'ltr' | 'rtl') {
	const label = new Intl.DisplayNames([lang], { type: 'language' }).of(lang);
	if (!label)
		throw new Error(
			`Failed to get the language name for '${lang}' when defining the built-in default locale.`
		);
	return { dir, label, lang };
}
