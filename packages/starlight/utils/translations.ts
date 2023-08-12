import { type CollectionEntry, getCollection } from 'astro:content';
import config from 'virtual:starlight/user-config';
import builtinTranslations from '../translations';
import { localeToLang } from './slugs';

/** User-configured default locale. */
const defaultLocale = config.defaultLocale?.locale || 'root';

/** All translation data from the i18n collection, keyed by `id`, which matches locale. */
let userTranslations: Record<string, CollectionEntry<'i18n'>['data']> = {};
try {
	// Load the user’s i18n collection and ignore the error if it doesn’t exist.
	userTranslations = Object.fromEntries(
		(await getCollection('i18n')).map(({ id, data }) => [id, data] as const)
	);
} catch {}

/** Default map of UI strings based on Starlight and user-configured defaults. */
const defaults = buildDictionary(
	builtinTranslations.en!,
	userTranslations.en,
	builtinTranslations[defaultLocale] || builtinTranslations[stripLangRegion(defaultLocale)],
	userTranslations[defaultLocale]
);

/**
 * Strips the region subtag from a BCP-47 lang string.
 * @param {string} [lang]
 * @example
 * const lang = stripLangRegion('en-GB'); // => 'en'
 */
export function stripLangRegion(lang: string) {
	return lang.replace(/-[a-zA-Z]{2}/, '');
}

/**
 * Generate a utility function that returns UI strings for the given `locale`.
 * @param {string | undefined} [locale]
 * @example
 * const t = useTranslations('en');
 * const label = t('search.label'); // => 'Search'
 */
export function useTranslations(locale: string | undefined) {
	const lang = localeToLang(locale);
	const dictionary = buildDictionary(
		defaults,
		builtinTranslations[lang] || builtinTranslations[stripLangRegion(lang)],
		userTranslations[lang]
	);
	const t = <K extends keyof typeof dictionary>(key: K) => dictionary[key];
	t.pick = (startOfKey: string) =>
		Object.fromEntries(Object.entries(dictionary).filter(([k]) => k.startsWith(startOfKey)));
	return t;
}

/** Build a dictionary by layering preferred translation sources. */
function buildDictionary(
	base: (typeof builtinTranslations)[string],
	...dictionaries: (CollectionEntry<'i18n'>['data'] | undefined)[]
) {
	const dictionary = { ...base };
	// Iterate over alternate dictionaries to avoid overwriting preceding values with `undefined`.
	for (const dict of dictionaries) {
		for (const key in dict) {
			const value = dict[key as keyof typeof dict];
			if (value) dictionary[key as keyof typeof dict] = value;
		}
	}
	return dictionary;
}
