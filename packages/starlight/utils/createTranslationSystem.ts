import i18next, { type TOptions } from 'i18next';
import type { i18nSchemaOutput } from '../schemas/i18n';
import builtinTranslations from '../translations/index';
import { BuiltInDefaultLocale } from './i18n';
import type { StarlightConfig } from './user-config';
import type { UserI18nKeys, UserI18nSchema } from './translations';
import type { RemoveIndexSignature } from './types';

/**
 * The namespace for i18next resources used by Starlight.
 * All translations handled by Starlight are stored in the same namespace and Starlight always use
 * a new instance of i18next configured with only the resources available to Starlight.
 */
const i18nextNamespace = 'starlight';

export function createTranslationSystem<T extends i18nSchemaOutput>(
	config: Pick<StarlightConfig, 'defaultLocale' | 'locales'>,
	userTranslations: Record<string, T>,
	pluginTranslations: Record<string, T> = {}
) {
	const translations = {
		[BuiltInDefaultLocale.lang]: buildResources(
			builtinTranslations[BuiltInDefaultLocale.lang]!,
			pluginTranslations[BuiltInDefaultLocale.lang],
			userTranslations[BuiltInDefaultLocale.lang]
		),
	};

	if (config.locales) {
		for (const locale in config.locales) {
			const lang = localeToLang(locale, config.locales, config.defaultLocale);

			translations[lang] = buildResources(
				builtinTranslations[lang] || builtinTranslations[stripLangRegion(lang)],
				pluginTranslations[lang],
				userTranslations[lang]
			);
		}
	}

	const i18n = i18next.createInstance();
	i18n.init({
		resources: translations,
		fallbackLng:
			config.defaultLocale.lang || config.defaultLocale?.locale || BuiltInDefaultLocale.lang,
	});

	/**
	 * Generate a utility function that returns UI strings for the given `locale`.
	 *
	 * Also includes an `all()` method for getting the entire dictionary.
	 *
	 * @param {string | undefined} [locale]
	 * @example
	 * const t = useTranslations('en');
	 * const label = t('search.label');
	 * // => 'Search'
	 * const dictionary = t.all();
	 * // => { 'skipLink.label': 'Skip to content', 'search.label': 'Search', ... }
	 */
	return (locale: string | undefined) => {
		const lang = localeToLang(locale, config.locales, config.defaultLocale);
		const fixedT = i18n.getFixedT(lang);

		const t: I18nT = (key: I18nKey, options?: I18nOptions): string => {
			return fixedT(key, {
				...options,
				/** @see I18nOptions for the reasons why some options are enforced. */
				ns: i18nextNamespace,
				returnObjects: false,
				returnDetails: false,
			});
		};
		t.all = () => i18n.getResourceBundle(lang, i18nextNamespace);
		t.exists = (key: I18nKey) => i18n.exists(key, { lng: lang, ns: i18nextNamespace });

		return t;
	};
}

/**
 * Strips the region subtag from a BCP-47 lang string.
 * @param {string} [lang]
 * @example
 * const lang = stripLangRegion('en-GB'); // => 'en'
 */
function stripLangRegion(lang: string) {
	return lang.replace(/-[a-zA-Z]{2}/, '');
}

/**
 * Get the BCP-47 language tag for the given locale.
 * @param locale Locale string or `undefined` for the root locale.
 */
function localeToLang(
	locale: string | undefined,
	locales: StarlightConfig['locales'],
	defaultLocale: StarlightConfig['defaultLocale']
): string {
	const lang = locale ? locales?.[locale]?.lang : locales?.root?.lang;
	const defaultLang = defaultLocale?.lang || defaultLocale?.locale;
	return lang || defaultLang || BuiltInDefaultLocale.lang;
}

type BuiltInStrings = (typeof builtinTranslations)['en'];

/** Build an i18next resources dictionary by layering preferred translation sources. */
function buildResources<T extends Record<string, string | undefined>>(
	...dictionaries: (T | BuiltInStrings | undefined)[]
): { [i18nextNamespace]: BuiltInStrings & T } {
	const dictionary: Partial<BuiltInStrings> = {};
	// Iterate over alternate dictionaries to avoid overwriting preceding values with `undefined`.
	for (const dict of dictionaries) {
		for (const key in dict) {
			const value = dict[key as keyof typeof dict];
			if (value) dictionary[key as keyof typeof dictionary] = value;
		}
	}
	return { [i18nextNamespace]: dictionary as BuiltInStrings & T };
}

type I18nKeys = UserI18nKeys | keyof StarlightApp.I18n;
type I18nKey = I18nKeys | I18nKeys[];
type I18nOptions = Omit<
	RemoveIndexSignature<TOptions>,
	/**
	 * Some options are not user-configurable and are enforced by the translation system:
	 *
	 * - `ns` is always set to a single namespace.
	 * - `returnDetails` is always `false` so that `t()` always returns a UI string and not the
	 * 		details object which is mostly useless in a single namespace context and would comlicate
	 * 		typing.
	 * - `returnObjects` is always `false` so that `t()` always returns a string and not nested
	 * 		translation objects as this would conflict with the i18n schema and require typegen.
	 */
	'ns' | 'returnDetails' | 'returnObjects'
> & {
	// Adding back support for any key that can be used for interpolation.
	[key: string]: unknown;
};

export type I18nT = ((key: I18nKey, options?: I18nOptions) => string) & {
	all: () => UserI18nSchema;
	exists: (key: I18nKey) => boolean;
};
