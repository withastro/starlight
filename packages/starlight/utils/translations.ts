import { getCollection } from 'astro:content';
import config from 'virtual:starlight/user-config';
import { i18nSchema } from '../schema';

/** User-configured default locale. */
const defaultLocale = config.defaultLocale?.locale || 'root';

/** All translation data from the i18n collection, keyed by `id`, which matches locale. */
const translations = Object.fromEntries(
  (await getCollection('i18n')).map((entry) => [entry.id, entry.data] as const)
);

/** Default map of UI strings based on Starlight’s English defaults + those for the user-configured default locale. */
const defaults = { ...i18nSchema().parse({}), ...translations[defaultLocale] };

/**
 * Generate a utility function that returns UI strings for the given `locale`.
 *
 * @example
 * const t = useTranslations('en');
 * const label = t('search.label'); // => 'Search'
 */
export function useTranslations(locale: string | undefined) {
  const dictionary = { ...defaults, ...translations[locale || 'root'] };
  return (key: keyof typeof dictionary) => dictionary[key];
}
