import { getCollection } from 'astro:content';
import config from 'virtual:starlight/user-config';
import builtinTranslations from '../translations';

/** User-configured default locale. */
const defaultLocale = config.defaultLocale?.locale || 'root';

/** All translation data from the i18n collection, keyed by `id`, which matches locale. */
const userTranslations = Object.fromEntries(
  (await getCollection('i18n')).map((entry) => [entry.id, entry.data] as const)
);

/** Default map of UI strings based on Starlight’s defaults + those for the user-configured default locale. */
const defaults = {
  ...builtinTranslations['en'],
  ...builtinTranslations[defaultLocale],
  ...userTranslations[defaultLocale],
};

/**
 * Generate a utility function that returns UI strings for the given `locale`.
 * @param {string | undefined} [locale]
 * @example
 * const t = useTranslations('en');
 * const label = t('search.label'); // => 'Search'
 */
export function useTranslations(locale = 'root') {
  // TODO: Use better locale mapping, e.g. so that `en-GB` matches `en`.
  // TODO: Use `lang` instead of `locale` for translations? Otherwise root locales won’t work properly.
  const dictionary = {
    ...defaults,
    ...builtinTranslations[locale],
    ...userTranslations[locale],
  };
  return (key: keyof typeof dictionary) => dictionary[key];
}
