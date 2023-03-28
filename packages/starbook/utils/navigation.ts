import { CollectionEntry, getCollection } from 'astro:content';
import { basename, dirname } from 'node:path';
import { slugToLocale, slugToPathname } from '../utils/slugs';
import config from 'virtual:starbook/user-config';

const allDocs = await getCollection('docs');

export function getSidebar(slug: CollectionEntry<'docs'>['slug']) {
  let docs = allDocs;
  const locale = slugToLocale(slug);

  if (config.locales) {
    if (locale && locale in config.locales) {
      docs = allDocs.filter((doc) => doc.id.startsWith(locale + '/'));
    } else if (config.locales.root) {
      const langKeys = Object.keys(config.locales).filter((k) => k !== 'root');
      const isLangDir = new RegExp(`^(${langKeys.join('|')})/`);
      docs = allDocs.filter((doc) => !isLangDir.test(doc.id));
    }
  }

  /**
   * A representation of the file structure. For each object entry:
   * If it's a folder, the key is the directory name, and value is the directory
   * content; If it's a doc file, the key is the doc's source file name, and value
   * is the collection entry.
   */
  interface Dir {
    [item: string]: Dir | CollectionEntry<'docs'>['id'];
  }

  /** Turn flat array of docs into a tree structure. */
  function treeify(docs: CollectionEntry<'docs'>[]) {
    function getBreadcrumb(doc: CollectionEntry<'docs'>): string[] {
      const dir = dirname(doc.id);
      // Return no breadcrumbs for items in the root directory.
      if (dir === '.') return [];
      return dir.split('/');
    }
    const treeRoot: Dir = {};
    docs.forEach((doc) => {
      const breadcrumb = getBreadcrumb(doc);

      // Walk down the file's path to generate the fs structure
      let currentDir = treeRoot;
      breadcrumb.forEach((dir) => {
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

  interface PageEntry {
    type: 'page';
    label: string;
    href: string;
  }

  function makePageEntry(id: CollectionEntry<'docs'>['id']): PageEntry {
    const doc = docs.find((doc) => doc.id === id)!;
    return {
      type: 'page',
      label: doc.data.title,
      href: slugToPathname(doc.slug),
    };
  }

  interface Category {
    type: 'category';
    label: string;
    entries: (PageEntry | Category)[];
  }

  function makeCategory(dir: Dir, fullPath: string, dirName: string): Category {
    const entries = Object.entries(dir).map(([key, dirOrId]) =>
      dirToItem(dirOrId, `${fullPath}/${key}`, key)
    );
    return {
      type: 'category',
      label: dirName,
      entries,
    };
  }

  function dirToItem(dirOrId: Dir[string], fullPath: string, dirName: string) {
    return typeof dirOrId === 'string'
      ? makePageEntry(dirOrId)
      : makeCategory(dirOrId, fullPath, dirName);
  }

  function makeSidebar(tree: Dir) {
    return Object.entries(tree).map(([key, dirOrId]) =>
      dirToItem(dirOrId, key, key)
    );
  }

  return makeSidebar(treeify(docs));
}
