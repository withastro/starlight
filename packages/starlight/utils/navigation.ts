import { basename, dirname } from 'node:path';
import config from 'virtual:starlight/user-config';
import { pathWithBase } from './base';
import { pickLang } from './i18n';
import { Route, getLocaleRoutes, routes } from './routing';
import { localeToLang, slugToPathname } from './slugs';
import type {
  AutoSidebarGroup,
  SidebarItem,
  SidebarLinkItem,
} from './user-config';

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
      entries: item.items.map((i) =>
        configItemToEntry(i, currentPathname, locale, routes)
      ),
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
  const { directory } = item.autogenerate;
  const localeDir = locale ? locale + '/' + directory : directory;
  const dirDocs = routes.filter(
    (doc) =>
      // Match against `foo.md` or `foo/index.md`.
      doc.slug === localeDir ||
      // Match against `foo/anything/else.md`.
      doc.slug.startsWith(localeDir + '/')
  );
  const tree = treeify(dirDocs, localeDir);
  return {
    type: 'group',
    label: pickLang(item.translations, localeToLang(locale)) || item.label,
    entries: sidebarFromDir(tree, currentPathname, locale),
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
function getBreadcrumbs(slug: string, baseDir: string): string[] {
  // Index slugs will match `baseDir` and don’t include breadcrumbs.
  if (slug === baseDir) return [];
  // Ensure base directory ends in a trailing slash.
  if (!baseDir.endsWith('/')) baseDir += '/';
  // Strip base directory from slug if present.
  const relativeSlug = slug.startsWith(baseDir)
    ? slug.replace(baseDir, '')
    : slug;
  let dir = dirname(relativeSlug);
  // Return no breadcrumbs for items in the root directory.
  if (dir === '.') return [];
  return dir.split('/');
}

/** Turn a flat array of routes into a tree structure. */
function treeify(routes: Route[], baseDir: string): Dir {
  const treeRoot: Dir = {};
  routes.forEach((doc) => {
    const breadcrumbs = getBreadcrumbs(doc.slug, baseDir);

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
  return makeLink(
    slugToPathname(doc.slug),
    doc.entry.data.title,
    currentPathname
  );
}

/** Create a group entry for a given content collection directory. */
function groupFromDir(
  dir: Dir,
  fullPath: string,
  dirName: string,
  currentPathname: string,
  locale: string | undefined
): Group {
  const entries = Object.entries(dir).map(([key, dirOrSlug]) =>
    dirToItem(dirOrSlug, `${fullPath}/${key}`, key, currentPathname, locale)
  );
  return {
    type: 'group',
    label: dirName,
    entries,
  };
}

/** Create a sidebar entry for a directory or content slug. */
function dirToItem(
  dirOrSlug: Dir[string],
  fullPath: string,
  dirName: string,
  currentPathname: string,
  locale: string | undefined
): SidebarEntry {
  return typeof dirOrSlug === 'string'
    ? linkFromSlug(dirOrSlug, currentPathname)
    : groupFromDir(dirOrSlug, fullPath, dirName, currentPathname, locale);
}

/** Create a sidebar entry for a given content directory. */
function sidebarFromDir(
  tree: Dir,
  currentPathname: string,
  locale: string | undefined
) {
  return Object.entries(tree).map(([key, dirOrSlug]) =>
    dirToItem(dirOrSlug, key, key, currentPathname, locale)
  );
}

/** Get the sidebar for the current page. */
export function getSidebar(
  pathname: string,
  locale: string | undefined
): SidebarEntry[] {
  const routes = getLocaleRoutes(locale);
  if (config.sidebar) {
    return config.sidebar.map((group) =>
      configItemToEntry(group, pathname, locale, routes)
    );
  } else {
    const tree = treeify(routes, locale || '');
    return sidebarFromDir(tree, pathname, locale);
  }
}

/** Turn the nested tree structure of a sidebar into a flat list of all the links. */
function flattenSidebar(sidebar: SidebarEntry[]): Link[] {
  return sidebar.flatMap((entry) =>
    entry.type === 'group' ? flattenSidebar(entry.entries) : entry
  );
}

/** Get previous/next pages in the sidebar if there are any. */
export function getPrevNextLinks(sidebar: SidebarEntry[]): {
  prev: Link | undefined;
  next: Link | undefined;
} {
  const entries = flattenSidebar(sidebar);
  const currentIndex = entries.findIndex((entry) => entry.isCurrent);
  const prev = entries[currentIndex - 1];
  const next = currentIndex > -1 ? entries[currentIndex + 1] : undefined;
  return { prev, next };
}
