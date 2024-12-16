import i18next, { type ExistsFunction, type TFunction } from 'i18next';
import type { i18nSchemaOutput } from '../schemas/i18n';
import builtinTranslations from '../translations/index';
import { BuiltInDefaultLocale } from './i18n';
import type { StarlightConfig } from './user-config';
import type { UserI18nKeys, UserI18nSchema } from './translations';

/**
 * The namespace for i18next resources used by Starlight.
 * All translations handled by Starlight are stored in the same namespace and Starlight always use
 * a new instance of i18next configured for this namespace.
 */
export const I18nextNamespace = 'starlight' as const;

export function createTranslationSystem<T extends i18nSchemaOutput>(
	config: Pick<StarlightConfig, 'defaultLocale' | 'locales'>,
	userTranslations: Record<string, T>,
	pluginTranslations: Record<string, T> = {}
) {
	const defaultLocale =
		config.defaultLocale.lang || config.defaultLocale?.locale || BuiltInDefaultLocale.lang;

	const translations = {
		[defaultLocale]: buildResources(
			builtinTranslations[defaultLocale],
			builtinTranslations[stripLangRegion(defaultLocale)],
			pluginTranslations[defaultLocale],
			userTranslations[defaultLocale]
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
	 * Generate a utility function that returns UI strings for the given language.
	 *
	 * Also includes a few utility methods:
	 * - `all()` method for getting the entire dictionary.
	 * - `exists()` method for checking if a key exists in the dictionary.
	 * - `dir()` method for getting the text direction of the locale.
	 *
	 * @param {string | undefined} [lang]
	 * @example
	 * const t = useTranslations('en');
	 * const label = t('search.label');
	 * // => 'Search'
	 * const dictionary = t.all();
	 * // => { 'skipLink.label': 'Skip to content', 'search.label': 'Search', ... }
	 * const exists = t.exists('search.label');
	 * // => true
	 * const dir = t.dir();
	 * // => 'ltr'
	 */
	return (lang: string | undefined) => {
		lang ??= config.defaultLocale?.lang || BuiltInDefaultLocale.lang;

		const t = i18n.getFixedT(lang, I18nextNamespace) as I18nT;
		t.all = () => i18n.getResourceBundle(lang, I18nextNamespace);
		t.exists = (key, options) => i18n.exists(key, { lng: lang, ns: I18nextNamespace, ...options });
		t.dir = (dirLang = lang) => i18n.dir(dirLang);

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
): { [I18nextNamespace]: BuiltInStrings & T } {
	const dictionary: Partial<BuiltInStrings> = {};
	// Iterate over alternate dictionaries to avoid overwriting preceding values with `undefined`.
	for (const dict of dictionaries) {
		for (const key in dict) {
			const value = dict[key as keyof typeof dict];
			if (value) dictionary[key as keyof typeof dictionary] = value;
		}
	}
	return { [I18nextNamespace]: dictionary as BuiltInStrings & T };
}

// `keyof BuiltInStrings` and `UserI18nKeys` may contain some identical keys, e.g. the built-in UI
// strings. We let TypeScript merge them into a single union type so that plugins with a TypeScript
// configuration preventing `UserI18nKeys` to be properly inferred can still get auto-completion
// for built-in UI strings.
export type I18nKeys = keyof BuiltInStrings | UserI18nKeys | keyof StarlightApp.I18n;

export type I18nT = TFunction<'starlight', undefined> & {
	all: () => UserI18nSchema;
	exists: ExistsFunction;
	dir: (lang?: string) => 'ltr' | 'rtl';
};
