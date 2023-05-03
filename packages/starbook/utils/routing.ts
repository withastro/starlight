import type { GetStaticPathsItem } from 'astro';
import type { CollectionEntry } from 'astro:content';
import config from 'virtual:starbook/user-config';
import { defaultLocaleDocs, docs, getLocaleDocs } from './collections';
import {
  LocaleData,
  localizedSlug,
  slugToLocaleData,
  slugToParam,
} from './slugs';

interface Route extends LocaleData {
  entry: CollectionEntry<'docs'>;
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
    ...slugToLocaleData(entry.slug),
  }));

  // In multilingual sites, add required fallback routes.
  if (config.isMultilingual) {
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
