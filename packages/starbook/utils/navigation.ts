import { CollectionEntry, getCollection } from 'astro:content';
import { basename, dirname } from 'node:path';
import { slugToPathname } from '../utils/slugs';
import config from 'virtual:starbook/user-config';
import type {
  AutoSidebarGroup,
  SidebarItem,
  SidebarLinkItem,
} from './user-config';

const allDocs = await getCollection('docs');

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
 * A representation of the file structure. For each object entry:
 * if it's a folder, the key is the directory name, and value is the directory
 * content; if it's a doc file, the key is the doc's source file name, and value
 * is the collection entry.
 */
interface Dir {
  [item: string]: Dir | CollectionEntry<'docs'>['id'];
}

/** Convert an item in a user’s sidebar config to a sidebar entry. */
function configItemToEntry(
  item: SidebarItem,
  currentPathname: string,
  locale: string | undefined,
  docs: CollectionEntry<'docs'>[]
): SidebarEntry {
  if ('link' in item) {
    return linkFromConfig(item, locale, currentPathname);
  } else if ('autogenerate' in item) {
    return groupFromAutogenerateConfig(item, locale, docs, currentPathname);
  } else {
    return {
      type: 'group',
      label: item.label,
      entries: item.items.map((i) =>
        configItemToEntry(i, currentPathname, locale, docs)
      ),
    };
  }
}

/** Autogenerate a group of links from a user’s sidebar config. */
function groupFromAutogenerateConfig(
  item: AutoSidebarGroup,
  locale: string | undefined,
  docs: CollectionEntry<'docs'>[],
  currentPathname: string
): Group {
  const { directory } = item.autogenerate;
  const localeDir = locale ? locale + '/' + directory : directory;
  const dirDocs = docs.filter((doc) => doc.id.startsWith(localeDir));
  const tree = treeify(dirDocs, localeDir);
  return {
    type: 'group',
    label: item.label,
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
  return makeLink(href, item.label, currentPathname);
}

/** Create a link entry. */
function makeLink(href: string, label: string, currentPathname: string): Link {
  if (!isAbsolute(href)) {
    href = ensureLeadingAndTrailingSlashes(href);
    /** Base URL with trailing `/` stripped. */
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    if (base) href = base + href;
  }
  const isCurrent = href === currentPathname;
  return { type: 'link', label, href, isCurrent };
}

/** Get the segments leading to a page. */
function getBreadcrumbs(
  id: CollectionEntry<'docs'>['id'],
  baseDir: string
): string[] {
  // Ensure base directory ends in a trailing slash.
  if (!baseDir.endsWith('/')) baseDir += '/';
  // Strip base directory from file ID if present.
  const relativeId = id.startsWith(baseDir) ? id.replace(baseDir, '') : id;
  let dir = dirname(relativeId);
  // Return no breadcrumbs for items in the root directory.
  if (dir === '.') return [];
  return dir.split('/');
}

/** Turn a flat array of docs into a tree structure. */
function treeify(docs: CollectionEntry<'docs'>[], baseDir: string): Dir {
  const treeRoot: Dir = {};
  docs.forEach((doc) => {
    const breadcrumbs = getBreadcrumbs(doc.id, baseDir);

    // Walk down the file's path to generate the fs structure
    let currentDir = treeRoot;
    breadcrumbs.forEach((dir) => {
      // Create new folder if needed.
      if (typeof currentDir[dir] === 'undefined') currentDir[dir] = {};
      // Go into the subdirectory.
      currentDir = currentDir[dir] as Dir;
    });
    // We've walked through the path. Register the file in this directory.
    currentDir[basename(doc.id)] = doc.id;
  });
  return treeRoot;
}

/** Create a link entry for a given content collection entry. */
function linkFromId(
  id: CollectionEntry<'docs'>['id'],
  currentPathname: string
): Link {
  const doc = allDocs.find((doc) => doc.id === id)!;
  return makeLink(slugToPathname(doc.slug), doc.data.title, currentPathname);
}

/** Create a group entry for a given content collection directory. */
function groupFromDir(
  dir: Dir,
  fullPath: string,
  dirName: string,
  currentPathname: string,
  locale: string | undefined
): Group {
  const entries = Object.entries(dir).map(([key, dirOrId]) =>
    dirToItem(dirOrId, `${fullPath}/${key}`, key, currentPathname, locale)
  );
  return {
    type: 'group',
    label: dirName,
    entries,
  };
}

/** Create a sidebar entry for a directory or content ID. */
function dirToItem(
  dirOrId: Dir[string],
  fullPath: string,
  dirName: string,
  currentPathname: string,
  locale: string | undefined
): SidebarEntry {
  return typeof dirOrId === 'string'
    ? linkFromId(dirOrId, currentPathname)
    : groupFromDir(dirOrId, fullPath, dirName, currentPathname, locale);
}

/** Create a sidebar entry for a given content directory. */
function sidebarFromDir(
  tree: Dir,
  currentPathname: string,
  locale: string | undefined
) {
  return Object.entries(tree).map(([key, dirOrId]) =>
    dirToItem(dirOrId, key, key, currentPathname, locale)
  );
}

/** Get the sidebar for the current page. */
export function getSidebar(
  pathname: string,
  locale: string | undefined
): SidebarEntry[] {
  let docs = allDocs;
  if (config.locales) {
    if (locale && locale in config.locales) {
      docs = allDocs.filter((doc) => doc.id.startsWith(locale + '/'));
    } else if (config.locales.root) {
      const langKeys = Object.keys(config.locales).filter((k) => k !== 'root');
      const isLangDir = new RegExp(`^(${langKeys.join('|')})/`);
      docs = allDocs.filter((doc) => !isLangDir.test(doc.id));
    }
  }

  if (config.sidebar) {
    return config.sidebar.map((group) =>
      configItemToEntry(group, pathname, locale, docs)
    );
  } else {
    const tree = treeify(docs, locale || '');
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
  const next = entries[currentIndex + 1];
  return { prev, next };
}
