import type { GetStaticPathsItem } from 'astro';
import type { CollectionEntry } from 'astro:content';
import config from 'virtual:starbook/user-config';
import { docs } from './collections';
import {
  LocaleData,
  localizedSlug,
  slugToLocaleData,
  slugToParam,
} from './slugs';

export interface Route extends LocaleData {
  entry: CollectionEntry<'docs'>;
  entryMeta: LocaleData;
  slug: string;
  isFallback?: true;
  [key: string]: unknown;
}

interface Path extends GetStaticPathsItem {
  params: { slug: string | undefined };
  props: Route;
}

function getRoutes(): Route[] {
  const routes: Route[] = docs.map((entry) => ({
    entry,
    slug: entry.slug,
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
      const locale = config.locales[key];
      if (!locale) continue;
      const localeDocs = getLocaleDocs(key === 'root' ? undefined : key);
      for (const fallback of defaultLocaleDocs) {
        const slug = localizedSlug(fallback.slug, key);
        const doesNotNeedFallback = localeDocs.some((doc) => doc.slug === slug);
        if (doesNotNeedFallback) continue;
        routes.push({
          entry: fallback,
          slug,
          isFallback: true,
          lang: locale.lang || 'en',
          locale: key,
          dir: locale.dir,
          entryMeta: slugToLocaleData(fallback.slug),
        });
      }
    }
  }

  return routes;
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
function getLocaleDocs(locale: string | undefined): CollectionEntry<'docs'>[] {
  return filterByLocale(docs, locale);
}

/** Filter an array to find items whose slug matches the passed locale. */
function filterByLocale<T extends { slug: string }>(
  items: T[],
  locale: string | undefined
): T[] {
  if (config.locales) {
    if (locale && locale in config.locales) {
      return items.filter((i) => i.slug.startsWith(locale + '/'));
    } else if (config.locales.root) {
      const langKeys = Object.keys(config.locales).filter((k) => k !== 'root');
      const isLangDir = new RegExp(`^(${langKeys.join('|')})/`);
      return items.filter((i) => !isLangDir.test(i.slug));
    }
  }
  return items;
}
