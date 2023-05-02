import { CollectionEntry, getCollection } from 'astro:content';
import config from 'virtual:starbook/user-config';

/** All entries in the docs content collection. */
export const docs = await getCollection('docs');

/**
 * Get all entries in the docs content collection for a specific locale.
 * A locale of `undefined` is treated as the “root” locale, if configured.
 */
export function getLocaleDocs(locale?: string): CollectionEntry<'docs'>[] {
  if (config.locales) {
    if (locale && locale in config.locales) {
      return docs.filter((doc) => doc.id.startsWith(locale + '/'));
    } else if (config.locales.root) {
      const langKeys = Object.keys(config.locales).filter((k) => k !== 'root');
      const isLangDir = new RegExp(`^(${langKeys.join('|')})/`);
      return docs.filter((doc) => !isLangDir.test(doc.id));
    }
  }
  return docs;
}
