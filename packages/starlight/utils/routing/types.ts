import type { CollectionEntry } from 'astro:content';
import type { LocaleData } from '../slugs';

// The type returned from `CollectionEntry` is different for legacy collections and collections
// using a loader. This type is a common subset of both types.
export type StarlightDocsCollectionEntry = Omit<
	CollectionEntry<'docs'>,
	'id' | 'filePath' | 'render' | 'slug'
> & {
	// Update the `id` property to be a string like in the loader type.
	id: string;
	// Add the `filePath` property which is only present in the loader type.
	filePath?: string;
	// Add the `slug` property which is only present in the legacy type.
	slug?: string;
};

export type StarlightDocsEntry = StarlightDocsCollectionEntry & {
	filePath: string;
	slug: string;
};

export interface Route extends LocaleData {
	/** Content collection entry for the current page. Includes frontmatter at `data`. */
	entry: StarlightDocsEntry;
	/** Locale metadata for the page content. Can be different from top-level locale values when a page is using fallback content. */
	entryMeta: LocaleData;
	/** @deprecated Migrate to the new Content Layer API and use `id` instead. */
	slug: string;
	/** The slug or unique ID if using the `legacy.collections` flag. */
	id: string;
	/** True if this page is untranslated in the current language and using fallback content from the default locale. */
	isFallback?: true;
	[key: string]: unknown;
}
