import type { CollectionEntry } from 'astro:content';
import config from 'virtual:starbook/user-config';

/**
 * Get the “locale” of a slug. This is the base path at which a language is served.
 * For example, if French docs are in `src/content/docs/french/`, the locale is `french`.
 * Root locale slugs will return `undefined`.
 * @param slug A collection entry slug
 */
export function slugToLocale(
  slug: CollectionEntry<'docs'>['slug']
): string | undefined {
  const locales = Object.keys(config.locales || {});
  const baseSegment = slug.split('/')[0];
  if (baseSegment && locales.includes(baseSegment)) return baseSegment;
  return undefined;
}

/**
 * Get the BCP-47 language tag for the locale of a slug.
 * @param slug A collection entry slug
 */
export function slugToLang(slug: CollectionEntry<'docs'>['slug']): string {
  const locale = slugToLocale(slug);
  const lang = locale
    ? config.locales?.[locale]?.lang
    : config.locales?.root?.lang;
  return lang || 'en';
}

/**
 * Get the configured writing direction for the locale of a slug.
 * @param slug A collection entry slug
 */
export function slugToDir(
  slug: CollectionEntry<'docs'>['slug']
): 'ltr' | 'rtl' {
  const locale = slugToLocale(slug);
  const dir = locale
    ? config.locales?.[locale]?.dir
    : config.locales?.root?.dir;
  return dir || 'ltr';
}

export function slugToParam(slug: string): string | undefined {
  return slug === 'index'
    ? undefined
    : slug.endsWith('/index')
    ? slug.replace('/index', '')
    : slug;
}

export function slugToPathname(slug: string): string {
  const param = slugToParam(slug);
  return param ? '/' + param + '/' : '/';
}
