import type { AstroConfig } from 'astro';
import { AstroError } from 'astro/errors';
import type { StarlightConfig } from './user-config';

/**
 * A list of well-known right-to-left languages used as a fallback when determining the text
 * direction of a locale is not supported by the `Intl.Locale` API in the current environment.
 *
 * @see getLocaleDir()
 * @see https://en.wikipedia.org/wiki/IETF_language_tag#List_of_common_primary_language_subtags
 */
const wellKnownRTL = ['ar', 'fa', 'he', 'prs', 'ps', 'syc', 'ug', 'ur'];

/** Informations about the built-in default locale used as a fallback when no locales are defined. */
export const BuiltInDefaultLocale = { ...getLocaleInfo('en'), lang: 'en' };

/**
 * Processes the Astro and Starlight i18n configurations to generate/update them accordingly:
 *
 * 	- If no Astro and Starlight i18n configurations are provided, the built-in default locale is
 * used in Starlight and the generated Astro i18n configuration will match it.
 * 	- If only a Starlight i18n configuration is provided, an equivalent Astro i18n configuration is
 * generated.
 * 	- If only an Astro i18n configuration is provided, an equivalent Starlight i18n configuration is
 * used.
 * 	- If both an Astro and Starlight i18n configurations are provided, an error is thrown.
 */
export function processI18nConfig(
	starlightConfig: StarlightConfig,
	astroI18nConfig: AstroConfig['i18n']
) {
	// We don't know what to do if both an Astro and Starlight i18n configuration are provided.
	if (astroI18nConfig && !starlightConfig.isUsingBuiltInDefaultLocale) {
		throw new AstroError(
			'Cannot provide both an Astro `i18n` configuration and a Starlight `locales` configuration.',
			'Remove one of the two configurations.\nSee more at https://starlight.astro.build/guides/i18n/'
		);
	} else if (astroI18nConfig) {
		// If a Starlight compatible Astro i18n configuration is provided, we generate the matching
		// Starlight configuration.
		return {
			astroI18nConfig,
			starlightConfig: {
				...starlightConfig,
				...getStarlightI18nConfig(astroI18nConfig),
			} as StarlightConfig,
		};
	}
	// Otherwise, we generate the Astro i18n configuration based on the Starlight configuration.
	return { astroI18nConfig: getAstroI18nConfig(starlightConfig), starlightConfig: starlightConfig };
}

/** Generate an Astro i18n configuration based on a Starlight configuration. */
function getAstroI18nConfig(config: StarlightConfig): NonNullable<AstroConfig['i18n']> {
	return {
		// When using custom locale `path`s, the default locale must match one of these paths.
		// In Starlight, this matches the `locale` property if defined, and we fallback to the `lang`
		// property if not (which would be set to the language’s directory name by default).
		defaultLocale:
			// If the default locale is explicitly set to `root`, we use the `lang` property instead.
			(config.defaultLocale.locale === 'root'
				? config.defaultLocale.lang
				: (config.defaultLocale.locale ?? config.defaultLocale.lang)) ?? BuiltInDefaultLocale.lang,
		locales: config.locales
			? Object.entries(config.locales).map(([locale, localeConfig]) => {
					return {
						codes: [localeConfig?.lang ?? locale],
						path: locale === 'root' ? (localeConfig?.lang ?? BuiltInDefaultLocale.lang) : locale,
					};
				})
			: [config.defaultLocale.lang],
		routing: {
			prefixDefaultLocale:
				// Sites with multiple languages without a root locale.
				(config.isMultilingual && config.locales?.root === undefined) ||
				// Sites with a single non-root language different from the built-in default locale.
				(!config.isMultilingual && config.locales !== undefined),
			redirectToDefaultLocale: false,
			fallbackType: 'redirect',
		},
	};
}

/** Generate a Starlight i18n configuration based on an Astro configuration. */
function getStarlightI18nConfig(
	astroI18nConfig: NonNullable<AstroConfig['i18n']>
): Pick<StarlightConfig, 'isMultilingual' | 'locales' | 'defaultLocale'> {
	if (astroI18nConfig.routing === 'manual') {
		throw new AstroError(
			'Starlight is not compatible with the `manual` routing option in the Astro i18n configuration.'
		);
	}

	const prefixDefaultLocale = astroI18nConfig.routing.prefixDefaultLocale;
	const isMultilingual = astroI18nConfig.locales.length > 1;
	const isMonolingualWithRootLocale = !isMultilingual && !prefixDefaultLocale;

	const locales = isMonolingualWithRootLocale
		? undefined
		: Object.fromEntries(
				astroI18nConfig.locales.map((locale) => [
					isDefaultAstroLocale(astroI18nConfig, locale) && !prefixDefaultLocale
						? 'root'
						: isAstroLocaleExtendedConfig(locale)
							? locale.path
							: locale,
					inferStarlightLocaleFromAstroLocale(locale),
				])
			);

	const defaultAstroLocale = astroI18nConfig.locales.find((locale) =>
		isDefaultAstroLocale(astroI18nConfig, locale)
	);

	// This should never happen as Astro validation should prevent this case.
	if (!defaultAstroLocale) {
		throw new AstroError(
			'Astro default locale not found.',
			'This should never happen. Please open a new issue: https://github.com/withastro/starlight/issues/new?template=---01-bug-report.yml'
		);
	}

	return {
		isMultilingual,
		locales,
		defaultLocale: {
			...inferStarlightLocaleFromAstroLocale(defaultAstroLocale),
			locale:
				isMonolingualWithRootLocale || (isMultilingual && !prefixDefaultLocale)
					? undefined
					: isAstroLocaleExtendedConfig(defaultAstroLocale)
						? defaultAstroLocale.codes[0]
						: defaultAstroLocale,
		},
	};
}

/** Infer Starlight locale informations based on a locale from an Astro i18n configuration. */
function inferStarlightLocaleFromAstroLocale(astroLocale: AstroLocale) {
	const lang = isAstroLocaleExtendedConfig(astroLocale) ? astroLocale.codes[0] : astroLocale;
	return { ...getLocaleInfo(lang), lang };
}

/** Check if the passed locale is the default locale in an Astro i18n configuration. */
function isDefaultAstroLocale(
	astroI18nConfig: NonNullable<AstroConfig['i18n']>,
	locale: AstroLocale
) {
	return (
		(isAstroLocaleExtendedConfig(locale) ? locale.path : locale) === astroI18nConfig.defaultLocale
	);
}

/**
 * Check if the passed Astro locale is using the object variant.
 * @see AstroLocaleExtendedConfig
 */
function isAstroLocaleExtendedConfig(locale: AstroLocale): locale is AstroLocaleExtendedConfig {
	return typeof locale !== 'string';
}

/** Returns the locale informations such as a label and a direction based on a BCP-47 tag. */
function getLocaleInfo(lang: string) {
	try {
		const locale = new Intl.Locale(lang);
		const label = new Intl.DisplayNames(locale, { type: 'language' }).of(lang);
		if (!label || lang === label) throw new Error('Label not found.');
		return {
			label: label[0]?.toLocaleUpperCase(locale) + label.slice(1),
			dir: getLocaleDir(locale),
		};
	} catch (error) {
		throw new AstroError(
			`Failed to get locale informations for the '${lang}' locale.`,
			'Make sure to provide a valid BCP-47 tags (e.g. en, ar, or zh-CN).'
		);
	}
}

/**
 * Returns the direction of the passed locale.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getTextInfo
 */
function getLocaleDir(locale: Intl.Locale): 'ltr' | 'rtl' {
	if ('textInfo' in locale) {
		// @ts-expect-error - `textInfo` is not typed but is available in v8 based environments.
		return locale.textInfo.direction;
	} else if ('getTextInfo' in locale) {
		// @ts-expect-error - `getTextInfo` is not typed but is available in some non-v8 based environments.
		return locale.getTextInfo().direction;
	}
	// Firefox does not support `textInfo` or `getTextInfo` yet so we fallback to a well-known list
	// of right-to-left languages.
	return wellKnownRTL.includes(locale.language) ? 'rtl' : 'ltr';
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

type AstroLocale = NonNullable<AstroConfig['i18n']>['locales'][number];
type AstroLocaleExtendedConfig = Exclude<AstroLocale, string>;
