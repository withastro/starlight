import { basename, dirname } from 'node:path';
import config from 'virtual:starlight/user-config';
import { pathWithBase } from './base';
import { pickLang } from './i18n';
import { type Route, getLocaleRoutes, routes } from './routing';
import { localeToLang, slugToPathname } from './slugs';
import type { AutoSidebarGroup, SidebarItem, SidebarLinkItem } from './user-config';
import type { PrevNextLinkConfig } from '../schemas/prevNextLink';

export interface Link {
	type: 'link';
	label: string;
	href: string;
	isCurrent: boolean;
}

interface Group {
	type: 'group';
	label: string;
	entries: (Link | Group)[];
	collapsed: boolean;
}

export type SidebarEntry = Link | Group;

/**
 * A representation of the route structure. For each object entry:
 * if it’s a folder, the key is the directory name, and value is the directory
 * content; if it’s a route entry, the key is the last segment of the route, and value
 * is the entry’s full slug.
 */
interface Dir {
	[item: string]: Dir | string;
}

/** Convert an item in a user’s sidebar config to a sidebar entry. */
function configItemToEntry(
	item: SidebarItem,
	currentPathname: string,
	locale: string | undefined,
	routes: Route[]
): SidebarEntry {
	if ('link' in item) {
		return linkFromConfig(item, locale, currentPathname);
	} else if ('autogenerate' in item) {
		return groupFromAutogenerateConfig(item, locale, routes, currentPathname);
	} else {
		return {
			type: 'group',
			label: pickLang(item.translations, localeToLang(locale)) || item.label,
			entries: item.items.map((i) => configItemToEntry(i, currentPathname, locale, routes)),
			collapsed: item.collapsed,
		};
	}
}

/** Autogenerate a group of links from a user’s sidebar config. */
function groupFromAutogenerateConfig(
	item: AutoSidebarGroup,
	locale: string | undefined,
	routes: Route[],
	currentPathname: string
): Group {
	const { collapsed: subgroupCollapsed, directory } = item.autogenerate;
	const localeDir = locale ? locale + '/' + directory : directory;
	const dirDocs = routes.filter(
		(doc) =>
			// Match against `foo.md` or `foo/index.md`.
			stripExtension(doc.id) === localeDir ||
			// Match against `foo/anything/else.md`.
			doc.id.startsWith(localeDir + '/')
	);
	const tree = treeify(dirDocs, localeDir);
	return {
		type: 'group',
		label: pickLang(item.translations, localeToLang(locale)) || item.label,
		entries: sidebarFromDir(tree, currentPathname, locale, subgroupCollapsed ?? item.collapsed),
		collapsed: item.collapsed,
	};
}

/** Check if a string starts with one of `http://` or `https://`. */
const isAbsolute = (link: string) => /^https?:\/\//.test(link);

/** Ensure the passed path starts and ends with trailing slashes. */
function ensureLeadingAndTrailingSlashes(href: string): string {
	if (href[0] !== '/') href = '/' + href;
	if (href[href.length - 1] !== '/') href += '/';
	return href;
}

/** Create a link entry from a user config object. */
function linkFromConfig(
	item: SidebarLinkItem,
	locale: string | undefined,
	currentPathname: string
) {
	let href = item.link;
	if (!isAbsolute(href)) {
		href = ensureLeadingAndTrailingSlashes(href);
		// Inject current locale into link.
		if (locale) href = '/' + locale + href;
	}
	const label = pickLang(item.translations, localeToLang(locale)) || item.label;
	return makeLink(href, label, currentPathname);
}

/** Create a link entry. */
function makeLink(href: string, label: string, currentPathname: string): Link {
	if (!isAbsolute(href)) href = pathWithBase(href);
	const isCurrent = href === currentPathname;
	return { type: 'link', label, href, isCurrent };
}

/** Get the segments leading to a page. */
function getBreadcrumbs(path: string, baseDir: string): string[] {
	// Strip extension from path.
	const pathWithoutExt = stripExtension(path);
	// Index paths will match `baseDir` and don’t include breadcrumbs.
	if (pathWithoutExt === baseDir) return [];
	// Ensure base directory ends in a trailing slash.
	if (!baseDir.endsWith('/')) baseDir += '/';
	// Strip base directory from path if present.
	const relativePath = pathWithoutExt.startsWith(baseDir)
		? pathWithoutExt.replace(baseDir, '')
		: pathWithoutExt;
	let dir = dirname(relativePath);
	// Return no breadcrumbs for items in the root directory.
	if (dir === '.') return [];
	return dir.split('/');
}

/** Turn a flat array of routes into a tree structure. */
function treeify(routes: Route[], baseDir: string): Dir {
	const treeRoot: Dir = {};
	routes.forEach((doc) => {
		const breadcrumbs = getBreadcrumbs(doc.id, baseDir);

		// Walk down the route’s path to generate the tree.
		let currentDir = treeRoot;
		breadcrumbs.forEach((dir) => {
			// Create new folder if needed.
			if (typeof currentDir[dir] === 'undefined') currentDir[dir] = {};
			// Go into the subdirectory.
			currentDir = currentDir[dir] as Dir;
		});
		// We’ve walked through the path. Register the route in this directory.
		currentDir[basename(doc.slug)] = doc.slug;
	});
	return treeRoot;
}

/** Create a link entry for a given content collection entry. */
function linkFromSlug(slug: string, currentPathname: string): Link {
	const doc = routes.find((doc) => doc.slug === slug)!;
	return makeLink(slugToPathname(doc.slug), doc.entry.data.title, currentPathname);
}

/** Create a group entry for a given content collection directory. */
function groupFromDir(
	dir: Dir,
	fullPath: string,
	dirName: string,
	currentPathname: string,
	locale: string | undefined,
	collapsed: boolean
): Group {
	const entries = Object.entries(dir).map(([key, dirOrSlug]) =>
		dirToItem(dirOrSlug, `${fullPath}/${key}`, key, currentPathname, locale, collapsed)
	);
	return {
		type: 'group',
		label: dirName,
		entries,
		collapsed,
	};
}

/** Create a sidebar entry for a directory or content slug. */
function dirToItem(
	dirOrSlug: Dir[string],
	fullPath: string,
	dirName: string,
	currentPathname: string,
	locale: string | undefined,
	collapsed: boolean
): SidebarEntry {
	return typeof dirOrSlug === 'string'
		? linkFromSlug(dirOrSlug, currentPathname)
		: groupFromDir(dirOrSlug, fullPath, dirName, currentPathname, locale, collapsed);
}

/** Create a sidebar entry for a given content directory. */
function sidebarFromDir(
	tree: Dir,
	currentPathname: string,
	locale: string | undefined,
	collapsed: boolean
) {
	return Object.entries(tree).map(([key, dirOrSlug]) =>
		dirToItem(dirOrSlug, key, key, currentPathname, locale, collapsed)
	);
}

/** Get the sidebar for the current page. */
export function getSidebar(pathname: string, locale: string | undefined): SidebarEntry[] {
	const routes = getLocaleRoutes(locale);
	if (config.sidebar) {
		return config.sidebar.map((group) => configItemToEntry(group, pathname, locale, routes));
	} else {
		const tree = treeify(routes, locale || '');
		return sidebarFromDir(tree, pathname, locale, false);
	}
}

/** Turn the nested tree structure of a sidebar into a flat list of all the links. */
export function flattenSidebar(sidebar: SidebarEntry[]): Link[] {
	return sidebar.flatMap((entry) =>
		entry.type === 'group' ? flattenSidebar(entry.entries) : entry
	);
}

/** Get previous/next pages in the sidebar or the ones from the frontmatter if any. */
export function getPrevNextLinks(
	sidebar: SidebarEntry[],
	paginationEnabled: boolean,
	config: {
		prev?: PrevNextLinkConfig;
		next?: PrevNextLinkConfig;
	}
): {
	prev: Link | undefined;
	next: Link | undefined;
} {
	const entries = flattenSidebar(sidebar);
	const currentIndex = entries.findIndex((entry) => entry.isCurrent);
	const prev = applyPrevNextLinkConfig(entries[currentIndex - 1], paginationEnabled, config.prev);
	const next = applyPrevNextLinkConfig(
		currentIndex > -1 ? entries[currentIndex + 1] : undefined,
		paginationEnabled,
		config.next
	);
	return { prev, next };
}

/** Apply a prev/next link config to a navigation link. */
function applyPrevNextLinkConfig(
	link: Link | undefined,
	paginationEnabled: boolean,
	config: PrevNextLinkConfig | undefined
): Link | undefined {
	// Explicitly remove the link.
	if (config === false) return undefined;
	// Use the generated link if any.
	else if (config === true) return link;
	// If a link exists, update its label if needed.
	else if (typeof config === 'string' && link) {
		return { ...link, label: config };
	} else if (typeof config === 'object') {
		if (link) {
			// If a link exists, update both its label and href if needed.
			return {
				...link,
				label: config.label ?? link.label,
				href: config.link ?? link.href,
			};
		} else if (config.link && config.label) {
			// If there is no link and the frontmatter contains both a URL and a label,
			// create a new link.
			return makeLink(config.link, config.label, config.link);
		}
	}
	// Otherwise, if the global config is enabled, return the generated link if any.
	return paginationEnabled ? link : undefined;
}

/** Remove the extension from a path. */
const stripExtension = (path: string) => path.replace(/\.\w+$/, '');
