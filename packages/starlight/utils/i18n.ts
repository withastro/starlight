import type { AstroConfig } from 'astro';
import { AstroError } from 'astro/errors';
import type { StarlightConfig } from './user-config';

/** Informations about the built-in default locale used as a fallback when no locales are defined. */
export const BuiltInDefaultLocale = makeBuiltInDefaultLocale('en');

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
	if (astroI18nConfig && !isUsingBuiltInDefaultLocale(starlightConfig)) {
		throw new AstroError(
			'Cannot provide both an Astro i18n configuration and a Starlight i18n configuration.',
			'Remove one of the i18n configurations.\nSee more at https://starlight.astro.build/guides/i18n/'
		);
	} else if (astroI18nConfig) {
		if (astroI18nConfig.fallback) {
			throw new AstroError(
				'Starlight is not compatible with the `fallback` option in the Astro i18n configuration.',
				'Starlight uses its own fallback strategy showing readers content for a missing page in the default language.\nSee more at https://starlight.astro.build/guides/i18n/#fallback-content'
			);
		}

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
			redirectToDefaultLocale: false,
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
	if (!defaultAstroLocale) throw new Error('Astro default locale not found.');

	return {
		isMultilingual,
		locales,
		defaultLocale: {
			...inferStarlightLocaleFromAstroLocale(defaultAstroLocale),
			locale: isMonolingualWithRootLocale
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

/** Check if the Starlight built-in default locale is used in a Starlight config. */
function isUsingBuiltInDefaultLocale(config: StarlightConfig) {
	return (
		!config.isMultilingual &&
		config.locales === undefined &&
		config.defaultLocale.label === BuiltInDefaultLocale.label &&
		config.defaultLocale.lang === BuiltInDefaultLocale.lang &&
		config.defaultLocale.dir === BuiltInDefaultLocale.dir
	);
}

/** Returns the locale informations such as a label and a direction based on a BCP-47 tag. */
function getLocaleInfo(lang: string) {
	try {
		const locale = new Intl.Locale(lang);
		const label = new Intl.DisplayNames(locale, { type: 'language' }).of(lang);
		if (!label || lang === label) throw new Error('Label not found.');
		return {
			label: label[0]?.toLocaleUpperCase(locale) + label.slice(1),
			// `textInfo` is not part of the `Intl.Locale` type but is available in Node.js 18.0.0+.
			dir: (locale as Intl.Locale & { textInfo: { direction: 'ltr' | 'rtl' } }).textInfo.direction,
		};
	} catch (error) {
		throw new AstroError(
			`Failed to get locale informations for the '${lang}' locale.`,
			'Make sure to provide a valid BCP-47 tags (e.g. en, ar, or zh-CN).'
		);
	}
}

/** Generates the built-in default locale informations used as a fallback when no locales are defined. */
function makeBuiltInDefaultLocale(tag: string) {
	return { ...getLocaleInfo(tag), lang: tag };
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
