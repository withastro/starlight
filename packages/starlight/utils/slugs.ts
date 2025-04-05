import config from 'virtual:starlight/user-config';
import { slugToLocale as getLocaleFromSlug } from '../integrations/shared/slugToLocale';
import { BuiltInDefaultLocale } from './i18n';
import { stripTrailingSlash } from './path';
import type { LocaleData } from './routing/types';

/**
 * Get the “locale” of a slug. This is the base path at which a language is served.
 * For example, if French docs are in `src/content/docs/french/`, the locale is `french`.
 * Root locale slugs will return `undefined`.
 * @param slug A collection entry slug
 */
function slugToLocale(slug: string): string | undefined {
	return getLocaleFromSlug(slug, config);
}

/** Get locale information for a given slug. */
export function slugToLocaleData(slug: string): LocaleData {
	const locale = slugToLocale(slug);
	return { dir: localeToDir(locale), lang: localeToLang(locale), locale };
}

/**
 * Get the BCP-47 language tag for the given locale.
 * @param locale Locale string or `undefined` for the root locale.
 */
export function localeToLang(locale: string | undefined): string {
	const lang = locale ? config.locales?.[locale]?.lang : config.locales?.root?.lang;
	const defaultLang = config.defaultLocale?.lang || config.defaultLocale?.locale;
	return lang || defaultLang || BuiltInDefaultLocale.lang;
}

/**
 * Get the configured writing direction for the given locale.
 * @param locale Locale string or `undefined` for the root locale.
 */
function localeToDir(locale: string | undefined): 'ltr' | 'rtl' {
	const dir = locale ? config.locales?.[locale]?.dir : config.locales?.root?.dir;
	return dir || config.defaultLocale.dir;
}

export function slugToParam(slug: string): string | undefined {
	return slug === 'index' || slug === ''
		? undefined
		: slug.endsWith('/index')
			? slug.slice(0, -6)
			: slug;
}

export function slugToPathname(slug: string): string {
	const param = slugToParam(slug);
	return param ? '/' + param + '/' : '/';
}

/**
 * Convert a slug to a different locale.
 * For example, passing a slug of `en/home` and a locale of `fr` results in `fr/home`.
 * An undefined locale is treated as the root locale, resulting in `home`
 * @param slug A collection entry slug
 * @param locale The target locale
 * @example
 * localizedSlug('en/home', 'fr')       // => 'fr/home'
 * localizedSlug('en/home', undefined)  // => 'home'
 */
export function localizedSlug(slug: string, locale: string | undefined): string {
	const slugLocale = slugToLocale(slug);
	if (slugLocale === locale) return slug;
	locale = locale || '';
	if (slugLocale === slug) return locale;
	if (slugLocale) {
		return stripTrailingSlash(slug.replace(slugLocale + '/', locale ? locale + '/' : ''));
	}
	return slug ? locale + '/' + slug : locale;
}

/**
 * Convert a legacy collection entry ID or filePath relative to the collection root to a different
 * locale.
 * For example, passing an ID of `en/home.md` and a locale of `fr` results in `fr/home.md`.
 * An undefined locale is treated as the root locale, resulting in `home.md`.
 * @param id A collection entry ID
 * @param locale The target locale
 * @example
 * localizedSlug('en/home.md', 'fr')       // => 'fr/home.md'
 * localizedSlug('en/home.md', undefined)  // => 'home.md'
 */
export function localizedId(id: string, locale: string | undefined): string {
	const idLocale = slugToLocale(id);
	if (idLocale) {
		return id.replace(idLocale + '/', locale ? locale + '/' : '');
	} else if (locale) {
		return locale + '/' + id;
	} else {
		return id;
	}
}

/** Extract the slug from a URL. */
export function urlToSlug(url: URL): string {
	let pathname = url.pathname;
	const base = stripTrailingSlash(import.meta.env.BASE_URL);
	if (pathname.startsWith(base)) pathname = pathname.replace(base, '');
	const segments = pathname.split('/');
	const htmlExt = '.html';
	if (segments.at(-1) === 'index.html') {
		// Remove trailing `index.html`.
		segments.pop();
	} else if (segments.at(-1)?.endsWith(htmlExt)) {
		// Remove trailing `.html`.
		const last = segments.pop();
		if (last) segments.push(last.slice(0, -1 * htmlExt.length));
	}
	return segments.filter(Boolean).join('/');
}
