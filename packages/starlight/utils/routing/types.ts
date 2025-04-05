import type { MarkdownHeading } from 'astro';
import type { CollectionEntry, RenderResult } from 'astro:content';
import type { TocItem } from '../generateToC';
import type { LinkHTMLAttributes } from '../../schemas/sidebar';
import type { Badge } from '../../schemas/badge';
import type { HeadConfig } from '../../schemas/head';

export interface LocaleData {
	/** Writing direction. */
	dir: 'ltr' | 'rtl';
	/** BCP-47 language tag. */
	lang: string;
	/** The base path at which a language is served. `undefined` for root locale slugs. */
	locale: string | undefined;
}

export interface SidebarLink {
	type: 'link';
	label: string;
	href: string;
	isCurrent: boolean;
	badge: Badge | undefined;
	attrs: LinkHTMLAttributes;
}

export interface SidebarGroup {
	type: 'group';
	label: string;
	entries: (SidebarLink | SidebarGroup)[];
	collapsed: boolean;
	badge: Badge | undefined;
}

export type SidebarEntry = SidebarLink | SidebarGroup;

export interface PaginationLinks {
	/** Link to previous page in the sidebar. */
	prev: SidebarLink | undefined;
	/** Link to next page in the sidebar. */
	next: SidebarLink | undefined;
}

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
	/** Whether this page is untranslated in the current language and using fallback content from the default locale. */
	isFallback?: boolean;
	[key: string]: unknown;
}

export interface StarlightRouteData extends Route {
	/** Title of the site. */
	siteTitle: string;
	/** URL or path used as the link when clicking on the site title. */
	siteTitleHref: string;
	/** Array of Markdown headings extracted from the current page. */
	headings: MarkdownHeading[];
	/** Site navigation sidebar entries for this page. */
	sidebar: SidebarEntry[];
	/** Whether or not the sidebar should be displayed on this page. */
	hasSidebar: boolean;
	/** Links to the previous and next page in the sidebar if enabled. */
	pagination: PaginationLinks;
	/** Table of contents for this page if enabled. */
	toc: { minHeadingLevel: number; maxHeadingLevel: number; items: TocItem[] } | undefined;
	/** JS Date object representing when this page was last updated if enabled. */
	lastUpdated: Date | undefined;
	/** URL object for the address where this page can be edited if enabled. */
	editUrl: URL | undefined;
	/** An Astro component to render the current page’s content if this route is a Markdown page. */
	Content?: RenderResult['Content'];
	/** Array of tags to include in the `<head>` of the current page. */
	head: HeadConfig;
}
