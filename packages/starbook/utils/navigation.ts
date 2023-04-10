import { CollectionEntry, getCollection } from 'astro:content';
import { basename, dirname } from 'node:path';
import { slugToLocale, slugToPathname } from '../utils/slugs';
import config from 'virtual:starbook/user-config';

const allDocs = await getCollection('docs');

interface Link {
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

/** Get the segments leading to a page. */
function getBreadcrumbs(
  id: CollectionEntry<'docs'>['id'],
  locale: string | undefined
): string[] {
  const dir = dirname(id);
  // Return no breadcrumbs for items in the root directory.
  if (dir === '.') return [];
  const breadcrumbs = dir.split('/');
  // If we’re in a localized root, ignore the base lang directory.
  if (breadcrumbs[0] === locale) return breadcrumbs.slice(1);
  return breadcrumbs;
}

/** Turn a flat array of docs into a tree structure. */
function treeify(
  docs: CollectionEntry<'docs'>[],
  locale: string | undefined
): Dir {
  const treeRoot: Dir = {};
  docs.forEach((doc) => {
    const breadcrumbs = getBreadcrumbs(doc.id, locale);

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

function makeLink(
  id: CollectionEntry<'docs'>['id'],
  currentSlug: CollectionEntry<'docs'>['slug']
): Link {
  const doc = allDocs.find((doc) => doc.id === id)!;
  return {
    type: 'link',
    label: doc.data.title,
    href: slugToPathname(doc.slug),
    isCurrent: doc.slug === currentSlug,
  };
}

function makeGroup(
  dir: Dir,
  fullPath: string,
  dirName: string,
  currentSlug: CollectionEntry<'docs'>['slug']
): Group {
  const entries = Object.entries(dir).map(([key, dirOrId]) =>
    dirToItem(dirOrId, `${fullPath}/${key}`, key, currentSlug)
  );
  return {
    type: 'group',
    label: dirName,
    entries,
  };
}

function dirToItem(
  dirOrId: Dir[string],
  fullPath: string,
  dirName: string,
  currentSlug: CollectionEntry<'docs'>['slug']
): SidebarEntry {
  return typeof dirOrId === 'string'
    ? makeLink(dirOrId, currentSlug)
    : makeGroup(dirOrId, fullPath, dirName, currentSlug);
}

export function getSidebar(
  currentSlug: CollectionEntry<'docs'>['slug']
): SidebarEntry[] {
  const locale = slugToLocale(currentSlug);

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

  const tree = treeify(docs, locale);
  return Object.entries(tree).map(([key, dirOrId]) =>
    dirToItem(dirOrId, key, key, currentSlug)
  );
}
