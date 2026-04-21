import type { GetStaticPathsItem } from 'astro';
import { getCollection } from 'astro:content';
import config from 'virtual:starlight/user-config';
import { localizedSlug, slugToLocaleData, slugToParam } from '../slugs';
import { validateLogoImports } from '../validateLogoImports';
import { BuiltInDefaultLocale } from '../i18n';
import type { Route, StarlightDocsCollectionEntry, StarlightDocsEntry } from './types';

// Validate any user-provided logos imported correctly.
// We do this here so all pages trigger it and at the top level so it runs just once.
validateLogoImports();

interface Path extends GetStaticPathsItem {
	params: { slug: string | undefined };
	props: Route;
}

/**
 * Astro is inconsistent in its `index.md` slug generation. In most cases,
 * `index` is stripped, but in the root of a collection, we get a slug of `index`.
 * We map that to an empty string for consistent behaviour.
 */
const normalizeIndexSlug = (slug: string) => (slug === 'index' ? '' : slug);

/** Normalize a collection entry. */
export function normalizeCollectionEntry(entry: StarlightDocsCollectionEntry): StarlightDocsEntry {
	return {
		...entry,
		// The `id` is a slug and should be normalized.
		id: normalizeIndexSlug(entry.id),
		// At the moment, Starlight only supports file-based loaders which always include a `filePath`.
		filePath: entry.filePath!,
	};
}

/** All entries in the docs content collection. */
const docs: StarlightDocsEntry[] = (
	(await getCollection('docs', ({ data }) => {
		// In production, filter out drafts.
		return import.meta.env.MODE !== 'production' || data.draft === false;
	})) ?? []
).map(normalizeCollectionEntry);

function getRoutes(): Route[] {
	const routes: Route[] = docs.map((entry) => ({
		entry,
		id: entry.id,
		entryMeta: slugToLocaleData(entry.id),
		...slugToLocaleData(entry.id),
	}));

	// In multilingual sites, add required fallback routes.
	if (config.isMultilingual) {
		/** Entries in the docs content collection for the default locale. */
		const defaultLocaleDocs = getLocaleDocs(
			config.defaultLocale?.locale === 'root' ? undefined : config.defaultLocale?.locale
		);
		for (const key in config.locales) {
			if (key === config.defaultLocale.locale) continue;
			const localeConfig = config.locales[key];
			if (!localeConfig) continue;
			const locale = key === 'root' ? undefined : key;
			const localeDocs = getLocaleDocs(locale);
			for (const fallback of defaultLocaleDocs) {
				const id = localizedSlug(fallback.id, locale);
				const doesNotNeedFallback = localeDocs.some((doc) => doc.id === id);
				if (doesNotNeedFallback) continue;
				routes.push({
					entry: fallback,
					id,
					isFallback: true,
					lang: localeConfig.lang || BuiltInDefaultLocale.lang,
					locale,
					dir: localeConfig.dir,
					entryMeta: slugToLocaleData(fallback.id),
				});
			}
		}
	}

	return routes;
}
export const routes = getRoutes();

function getParamRouteMapping(): ReadonlyMap<string | undefined, Route> {
	const map = new Map<string | undefined, Route>();
	for (const route of routes) {
		map.set(slugToParam(route.id), route);
	}
	return map;
}
const routesBySlugParam = getParamRouteMapping();

export function getRouteBySlugParam(slugParam: string | undefined): Route | undefined {
	return routesBySlugParam.get(slugParam?.replace(/\/$/, '') || undefined);
}

function getPaths(): Path[] {
	return routes.map((route) => ({
		params: { slug: slugToParam(route.id) },
		props: route,
	}));
}
export const paths = getPaths();

/**
 * Get all routes for a specific locale.
 * A locale of `undefined` is treated as the “root” locale, if configured.
 */
export function getLocaleRoutes(locale: string | undefined): Route[] {
	return filterByLocale(routes, locale);
}

/**
 * Get all entries in the docs content collection for a specific locale.
 * A locale of `undefined` is treated as the “root” locale, if configured.
 */
function getLocaleDocs(locale: string | undefined): StarlightDocsEntry[] {
	return filterByLocale(docs, locale);
}

/** Filter an array to find items whose slug matches the passed locale. */
function filterByLocale<T extends { id: string }>(items: T[], locale: string | undefined): T[] {
	if (config.locales) {
		if (locale && locale in config.locales) {
			return items.filter((i) => i.id === locale || i.id.startsWith(locale + '/'));
		} else if (config.locales.root) {
			const langKeys = Object.keys(config.locales).filter((k) => k !== 'root');
			const isLangIndex = new RegExp(`^(${langKeys.join('|')})$`);
			const isLangDir = new RegExp(`^(${langKeys.join('|')})/`);
			return items.filter((i) => !isLangIndex.test(i.id) && !isLangDir.test(i.id));
		}
	}
	return items;
}
