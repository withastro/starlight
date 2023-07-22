import { getCollection } from 'astro:content';
import { filterByLocale, getPaths, getRoutes, type Route } from './routing-internals';
export type { Route, StarlightDocsEntry } from './routing-internals';

export const routes = getRoutes(await getCollection('docs'));
export const paths = getPaths(routes);

/**
 * Get all routes for a specific locale.
 * A locale of `undefined` is treated as the “root” locale, if configured.
 */
export function getLocaleRoutes(locale: string | undefined): Route[] {
  return filterByLocale(routes, locale);
}
