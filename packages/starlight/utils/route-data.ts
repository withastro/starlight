import type { MarkdownHeading } from 'astro';
import { fileURLToPath } from 'node:url';
import project from 'virtual:starlight/project-context';
import config from 'virtual:starlight/user-config';
import { generateToC, type TocItem } from './generateToC';
import { getFileCommitDate } from './git';
import { getPrevNextLinks, getSidebar, type SidebarEntry } from './navigation';
import { ensureTrailingSlash, stripLeadingAndTrailingSlashes } from './path';
import type { Route, StarlightDocsEntry, VirtualDocsEntry, VirtualRoute } from './routing';
import { localizedId, slugToLocaleData } from './slugs';
import { useTranslations } from './translations';
import { StarlightVirtualFrontmatterSchema } from '../schema';

interface PageProps extends Route {
	headings: MarkdownHeading[];
}

interface BaseRouteData {
	/** Array of Markdown headings extracted from the current page. */
	headings: MarkdownHeading[];
	/** Whether or not the sidebar should be displayed on this page. */
	hasSidebar: boolean;
}

export interface StarlightRouteData extends BaseRouteData, Route {
	/** Site navigation sidebar entries for this page. */
	sidebar: SidebarEntry[];
	/** Links to the previous and next page in the sidebar if enabled. */
	pagination: ReturnType<typeof getPrevNextLinks>;
	/** Table of contents for this page if enabled. */
	toc: { minHeadingLevel: number; maxHeadingLevel: number; items: TocItem[] } | undefined;
	/** JS Date object representing when this page was last updated if enabled. */
	lastUpdated: Date | undefined;
	/** URL object for the address where this page can be edited if enabled. */
	editUrl: URL | undefined;
	/** Record of UI strings localized for the current page. */
	labels: ReturnType<ReturnType<typeof useTranslations>['all']>;
}

export interface VirtualPageProps extends BaseRouteData, VirtualRoute {
	/** Site navigation sidebar entries for this page or fallback to the generated sidebar. */
	sidebar?: SidebarEntry[] | undefined;
}

export function generateRouteData({
	props,
	url,
}: {
	props: PageProps;
	url: URL;
}): StarlightRouteData {
	const { entry, locale } = props;
	const sidebar = getSidebar(url.pathname, locale);
	return {
		...props,
		sidebar,
		hasSidebar: entry.data.template !== 'splash',
		pagination: getPrevNextLinks(sidebar, config.pagination, entry.data),
		toc: getToC(props),
		lastUpdated: getLastUpdated(props),
		editUrl: getEditUrl(props),
		labels: useTranslations(locale).all(),
	};
}

export function generateVirtualRouteData({
	props,
	url,
}: {
	props: VirtualPageProps;
	url: URL;
}): StarlightRouteData {
	const { dir, lastUpdated, lang, slug } = props;
	const virtualFrontmatter = StarlightVirtualFrontmatterSchema.parse(props);
	const id = `${stripLeadingAndTrailingSlashes(slug)}.md`;
	const entryMeta = slugToLocaleData(slug);
	const sidebar = props.sidebar ?? getSidebar(url.pathname, entryMeta.locale);
	const virtualEntry: VirtualDocsEntry = {
		id,
		slug,
		body: '',
		collection: 'docs',
		data: {
			...virtualFrontmatter,
			editUrl: false,
			sidebar: {
				attrs: {},
				hidden: false,
			},
		},
	};
	const entry = virtualEntry as StarlightDocsEntry;
	return {
		...props,
		...entryMeta,
		id,
		editUrl: undefined,
		entry,
		entryMeta: { dir: dir, lang: lang, locale: entryMeta.locale },
		hasSidebar: props.hasSidebar ?? entry.data.template !== 'splash',
		labels: useTranslations(entryMeta.locale).all(),
		lastUpdated: lastUpdated instanceof Date ? lastUpdated : undefined,
		pagination: getPrevNextLinks(sidebar, config.pagination, entry.data),
		sidebar,
		slug,
		toc: getToC({ ...props, entry, entryMeta, id, locale: entryMeta.locale }),
	};
}

function getToC({ entry, locale, headings }: PageProps) {
	const tocConfig =
		entry.data.template === 'splash'
			? false
			: entry.data.tableOfContents !== undefined
			? entry.data.tableOfContents
			: config.tableOfContents;
	if (!tocConfig) return;
	const t = useTranslations(locale);
	return {
		...tocConfig,
		items: generateToC(headings, { ...tocConfig, title: t('tableOfContents.overview') }),
	};
}

function getLastUpdated({ entry }: PageProps): Date | undefined {
	if (entry.data.lastUpdated ?? config.lastUpdated) {
		const currentFilePath = fileURLToPath(new URL('src/content/docs/' + entry.id, project.root));
		let date = typeof entry.data.lastUpdated !== 'boolean' ? entry.data.lastUpdated : undefined;
		if (!date) {
			try {
				({ date } = getFileCommitDate(currentFilePath, 'newest'));
			} catch {}
		}
		return date;
	}
	return;
}

function getEditUrl({ entry, id, isFallback }: PageProps): URL | undefined {
	const { editUrl } = entry.data;
	// If frontmatter value is false, editing is disabled for this page.
	if (editUrl === false) return;

	let url: string | undefined;
	if (typeof editUrl === 'string') {
		// If a URL was provided in frontmatter, use that.
		url = editUrl;
	} else if (config.editLink.baseUrl) {
		const srcPath = project.srcDir.replace(project.root, '');
		const filePath = isFallback ? localizedId(id, config.defaultLocale.locale) : id;
		// If a base URL was added in Starlight config, synthesize the edit URL from it.
		url = ensureTrailingSlash(config.editLink.baseUrl) + srcPath + 'content/docs/' + filePath;
	}
	return url ? new URL(url) : undefined;
}
