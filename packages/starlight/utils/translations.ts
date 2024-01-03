import { getCollection } from 'astro:content';
import config from 'virtual:starlight/user-config';
import type { i18nSchemaOutput } from '../schemas/i18n';
import { createTranslationSystem } from './createTranslationSystem';

/** All translation data from the i18n collection, keyed by `id`, which matches locale. */
let userTranslations: Record<string, i18nSchemaOutput> = {};
try {
	// Load the user’s i18n collection and ignore the error if it doesn’t exist.
	userTranslations = Object.fromEntries(
		// @ts-ignore — may be an error in projects without an i18n collection

		(await getCollection('i18n')).map(({ id, data }) => [id, data] as const)
	);
} catch {}

/**
 * Generate a utility function that returns UI strings for the given `locale`.
 * @param {string | undefined} [locale]
 * @example
 * const t = useTranslations('en');
 * const label = t('search.label'); // => 'Search'
 */
export const useTranslations = createTranslationSystem(userTranslations, config);
