import { getCollection } from 'astro:content';
import config from 'virtual:starlight/user-config';
import type { i18nSchemaOutput } from '../schemas/i18n';
import { createTranslationSystem } from './createTranslationSystem';

/** Get all translation data from the i18n collection, keyed by `id`, which matches locale. */
async function loadTranslations() {
	let userTranslations: Record<string, i18nSchemaOutput> = {};
	// Briefly override `console.warn()` to silence logging when a project has no i18n collection.
	const warn = console.warn;
	console.warn = () => {};
	try {
		// Load the user’s i18n collection while ignoring type errors if it doesn’t exist.
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
		const i18n = await getCollection('i18n' as Parameters<typeof getCollection>[0]) as { id: string; data: i18nSchemaOutput }[];
		userTranslations = Object.fromEntries(i18n.map(({ id, data }) => [id, data]));
	} catch {
		// Ignore runtime errors if the i18n collection doesn’t exist.
	}
	// Restore the original warn implementation.
	console.warn = warn;
	return userTranslations;
}

/**
 * Generate a utility function that returns UI strings for the given `locale`.
 * @param {string | undefined} [locale]
 * @example
 * const t = useTranslations('en');
 * const label = t('search.label'); // => 'Search'
 */
export const useTranslations = createTranslationSystem(await loadTranslations(), config);
