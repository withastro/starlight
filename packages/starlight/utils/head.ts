import config from 'virtual:starlight/user-config';
import project from 'virtual:starlight/project-context';
import { version } from '../package.json';
import { type HeadConfig, HeadConfigSchema, type HeadUserConfig } from '../schemas/head';
import type { PageProps, RouteDataContext } from './routing/data';
import { fileWithBase } from './base';
import { formatCanonical } from './canonical';
import { localizedUrl } from './localizedUrl';

const HeadSchema = HeadConfigSchema();

/** Get the head for the current page. */
export function getHead(
	{ entry, lang }: PageProps,
	context: RouteDataContext,
	siteTitle: string
): HeadConfig {
	const { data } = entry;

	const canonical = context.site ? new URL(context.url.pathname, context.site) : undefined;
	const canonicalHref = canonical?.href
		? formatCanonical(canonical.href, {
				format: project.build.format,
				trailingSlash: project.trailingSlash,
			})
		: undefined;
	const description = data.description || config.description;

	const headDefaults: HeadUserConfig = [
		{ tag: 'meta', attrs: { charset: 'utf-8' } },
		{
			tag: 'meta',
			attrs: { name: 'viewport', content: 'width=device-width, initial-scale=1' },
		},
		{ tag: 'title', content: `${data.title} ${config.titleDelimiter} ${siteTitle}` },
		{ tag: 'link', attrs: { rel: 'canonical', href: canonicalHref } },
		{ tag: 'meta', attrs: { name: 'generator', content: context.generator } },
		{
			tag: 'meta',
			attrs: { name: 'generator', content: `Starlight v${version}` },
		},
		// Favicon
		{
			tag: 'link',
			attrs: {
				rel: 'shortcut icon',
				href: fileWithBase(config.favicon.href),
				type: config.favicon.type,
			},
		},
		// OpenGraph Tags
		{ tag: 'meta', attrs: { property: 'og:title', content: data.title } },
		{ tag: 'meta', attrs: { property: 'og:type', content: 'article' } },
		{ tag: 'meta', attrs: { property: 'og:url', content: canonicalHref } },
		{ tag: 'meta', attrs: { property: 'og:locale', content: lang } },
		{ tag: 'meta', attrs: { property: 'og:description', content: description } },
		{ tag: 'meta', attrs: { property: 'og:site_name', content: siteTitle } },
		// Twitter Tags
		{
			tag: 'meta',
			attrs: { name: 'twitter:card', content: 'summary_large_image' },
		},
	];

	if (description)
		headDefaults.push({
			tag: 'meta',
			attrs: { name: 'description', content: description },
		});

	// Link to language alternates.
	if (canonical && config.isMultilingual) {
		for (const locale in config.locales) {
			const localeOpts = config.locales[locale];
			if (!localeOpts) continue;
			headDefaults.push({
				tag: 'link',
				attrs: {
					rel: 'alternate',
					hreflang: localeOpts.lang,
					href: localizedUrl(canonical, locale, project.trailingSlash).href,
				},
			});
		}
	}

	// Link to sitemap, but only when `site` is set.
	if (context.site) {
		headDefaults.push({
			tag: 'link',
			attrs: {
				rel: 'sitemap',
				href: fileWithBase('/sitemap-index.xml'),
			},
		});
	}

	// Link to Twitter account if set in Starlight config.
	const twitterLink = config.social?.find(({ icon }) => icon === 'twitter' || icon === 'x.com');
	if (twitterLink) {
		headDefaults.push({
			tag: 'meta',
			attrs: {
				name: 'twitter:site',
				content: new URL(twitterLink.href).pathname.replace('/', '@'),
			},
		});
	}

	return createHead(headDefaults, config.head, data.head);
}

/** Create a fully parsed, merged, and sorted head entry array from multiple sources. */
function createHead(defaults: HeadUserConfig, ...heads: HeadConfig[]) {
	let head = HeadSchema.parse(defaults);
	for (const next of heads) {
		head = mergeHead(head, next);
	}
	return sortHead(head);
}

/**
 * Test if a head config object contains a matching `<title>` or `<meta>` or `<link rel="canonical">` tag.
 *
 * For example, will return true if `head` already contains
 * `<meta name="description" content="A">` and the passed `tag`
 * is `<meta name="description" content="B">`. Tests against `name`,
 * `property`, and `http-equiv` attributes for `<meta>` tags.
 */
function hasTag(head: HeadConfig, entry: HeadConfig[number]): boolean {
	switch (entry.tag) {
		case 'title':
			return head.some(({ tag }) => tag === 'title');
		case 'meta':
			return hasOneOf(head, entry, ['name', 'property', 'http-equiv']);
		case 'link':
			return head.some(
				({ attrs }) => entry.attrs?.rel === 'canonical' && attrs?.rel === 'canonical'
			);
		default:
			return false;
	}
}

/**
 * Test if a head config object contains a tag of the same type
 * as `entry` and a matching attribute for one of the passed `keys`.
 */
function hasOneOf(head: HeadConfig, entry: HeadConfig[number], keys: string[]): boolean {
	const attr = getAttr(keys, entry);
	if (!attr) return false;
	const [key, val] = attr;
	return head.some(({ tag, attrs }) => tag === entry.tag && attrs?.[key] === val);
}

/** Find the first matching key–value pair in a head entry’s attributes. */
function getAttr(
	keys: string[],
	entry: HeadConfig[number]
): [key: string, value: string | boolean] | undefined {
	let attr: [string, string | boolean] | undefined;
	for (const key of keys) {
		const val = entry.attrs?.[key];
		if (val) {
			attr = [key, val];
			break;
		}
	}
	return attr;
}

/** Merge two heads, overwriting entries in the first head that exist in the second. */
function mergeHead(oldHead: HeadConfig, newHead: HeadConfig) {
	return [...oldHead.filter((tag) => !hasTag(newHead, tag)), ...newHead];
}

/** Sort head tags to place important tags first and relegate “SEO” meta tags. */
function sortHead(head: HeadConfig) {
	return head.sort((a, b) => {
		const aImportance = getImportance(a);
		const bImportance = getImportance(b);
		return aImportance > bImportance ? -1 : bImportance > aImportance ? 1 : 0;
	});
}

/** Get the relative importance of a specific head tag. */
function getImportance(entry: HeadConfig[number]) {
	// 1. Important meta tags.
	if (
		entry.tag === 'meta' &&
		entry.attrs &&
		('charset' in entry.attrs || 'http-equiv' in entry.attrs || entry.attrs.name === 'viewport')
	) {
		return 100;
	}
	// 2. Page title
	if (entry.tag === 'title') return 90;
	// 3. Anything that isn’t an SEO meta tag.
	if (entry.tag !== 'meta') {
		// The default favicon should be below any extra icons that the user may have set
		// because if several icons are equally appropriate, the last one is used and we
		// want to use the SVG icon when supported.
		if (
			entry.tag === 'link' &&
			entry.attrs &&
			'rel' in entry.attrs &&
			entry.attrs.rel === 'shortcut icon'
		) {
			return 70;
		}
		return 80;
	}
	// 4. SEO meta tags.
	return 0;
}
