import { getCollection, type CollectionEntry, type DataCollectionKey } from 'astro:content';
import config from 'virtual:starlight/user-config';
import pluginTranslations from 'virtual:starlight/plugin-translations';
import type { i18nSchemaOutput } from '../schemas/i18n';
import { createTranslationSystem } from './createTranslationSystem';
import type { RemoveIndexSignature } from './types';

export type UserI18nSchema = 'i18n' extends DataCollectionKey
	? CollectionEntry<'i18n'> extends { data: infer T }
		? i18nSchemaOutput & T
		: i18nSchemaOutput
	: i18nSchemaOutput;
export type UserI18nKeys = keyof RemoveIndexSignature<UserI18nSchema>;

/** Get all translation data from the i18n collection, keyed by `id`, which matches locale. */
async function loadTranslations() {
	// Briefly override `console.warn()` to silence logging when a project has no i18n collection.
	const warn = console.warn;
	console.warn = () => {};
	const userTranslations: Record<string, UserI18nSchema> = Object.fromEntries(
		// @ts-ignore — may be a type error in projects without an i18n collection
		(await getCollection('i18n')).map(({ id, data }) => [id, data] as const)
	);
	// Restore the original warn implementation.
	console.warn = warn;
	return userTranslations;
}

/**
 * Generate a utility function that returns UI strings for the given language.
 * @param {string | undefined} [lang]
 * @example
 * const t = useTranslations('en');
 * const label = t('search.label'); // => 'Search'
 */
export const useTranslations = createTranslationSystem(
	config,
	await loadTranslations(),
	pluginTranslations
);
