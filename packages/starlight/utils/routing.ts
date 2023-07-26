import type { GetStaticPathsItem } from 'astro';
import { type CollectionEntry, getCollection } from 'astro:content';
import config from 'virtual:starlight/user-config';
import {
	type LocaleData,
	localizedId,
	localizedSlug,
	slugToLocaleData,
	slugToParam,
} from './slugs';

export type StarlightDocsEntry = Omit<CollectionEntry<'docs'>, 'slug'> & {
	slug: string;
};

export interface Route extends LocaleData {
  entry: StarlightDocsEntry;
  entryMeta: LocaleData;
  slug: string;
  sidebarOrder: number | undefined;
  id: string;
  isFallback?: true;
  [key: string]: unknown;
}

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

/** All entries in the docs content collection. */
const docs: StarlightDocsEntry[] = (await getCollection('docs')).map(({ slug, ...entry }) => ({
	...entry,
	slug: normalizeIndexSlug(slug),
}));

function getRoutes(): Route[] {
  const routes: Route[] = docs.map((entry) => ({
    entry,
    slug: entry.slug,
    id: entry.id,
    sidebarOrder: entry.data.sidebar?.order,
    entryMeta: slugToLocaleData(entry.slug),
    ...slugToLocaleData(entry.slug),
  }));

  // In multilingual sites, add required fallback routes.
  if (config.isMultilingual) {
    /** Entries in the docs content collection for the default locale. */
    const defaultLocaleDocs = getLocaleDocs(
      config.defaultLocale?.locale === 'root'
        ? undefined
        : config.defaultLocale?.locale
    );
    for (const key in config.locales) {
      if (key === config.defaultLocale.locale) continue;
      const localeConfig = config.locales[key];
      if (!localeConfig) continue;
      const locale = key === 'root' ? undefined : key;
      const localeDocs = getLocaleDocs(locale);
      for (const fallback of defaultLocaleDocs) {
        const slug = localizedSlug(fallback.slug, locale);
        const id = localizedId(fallback.id, locale);
        const sidebarOrder = fallback.data.sidebar?.order;
        const doesNotNeedFallback = localeDocs.some((doc) => doc.slug === slug);
        if (doesNotNeedFallback) continue;
        routes.push({
          entry: fallback,
          slug,
          id,
          sidebarOrder,
          isFallback: true,
          lang: localeConfig.lang || 'en',
          locale,
          dir: localeConfig.dir,
          entryMeta: slugToLocaleData(fallback.slug),
        });
      }
    }
  }

  // Sort alphabetically by order then page slug to guarantee order regardless of platform.
  return routes.sort((a, b) => {
    // If no order value is found, set it to the largest number possible.
    const aOrder = a.sidebarOrder ? a.sidebarOrder : Number.MAX_VALUE
    const bOrder = b.sidebarOrder ? b.sidebarOrder : Number.MAX_VALUE

    if (aOrder !== bOrder) return aOrder < bOrder ? -1 : 1 // Pages are sorted by order in ascending order.
    return a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0 // If two pages have the same order value they will be sorted by their slug.
  });
}
export const routes = getRoutes();

function getPaths(): Path[] {
	return routes.map((route) => ({
		params: { slug: slugToParam(route.slug) },
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
function filterByLocale<T extends { slug: string }>(items: T[], locale: string | undefined): T[] {
	if (config.locales) {
		if (locale && locale in config.locales) {
			return items.filter((i) => i.slug === locale || i.slug.startsWith(locale + '/'));
		} else if (config.locales.root) {
			const langKeys = Object.keys(config.locales).filter((k) => k !== 'root');
			const isLangIndex = new RegExp(`^(${langKeys.join('|')})$`);
			const isLangDir = new RegExp(`^(${langKeys.join('|')})/`);
			return items.filter((i) => !isLangIndex.test(i.slug) && !isLangDir.test(i.slug));
		}
	}
	return items;
}
