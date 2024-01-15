import type { MarkdownHeading } from 'astro';
import { z } from 'astro/zod';
import { fileURLToPath } from 'node:url';
import project from 'virtual:starlight/project-context';
import config from 'virtual:starlight/user-config';
import { generateToC, type TocItem } from './generateToC';
import { getNewestCommitDate } from './git';
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
	/** Site navigation sidebar entries for this page. */
	sidebar: SidebarEntry[];
}

export interface StarlightRouteData extends BaseRouteData, Route {
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

export type VirtualPageProps = Partial<BaseRouteData> & VirtualRoute;

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
	const { isFallback, lastUpdated, slug, ...routeProps } = props;
	const virtualFrontmatter = getVirtualFrontmatter(props);
	const id = `${stripLeadingAndTrailingSlashes(slug)}.md`;
	const localeData = slugToLocaleData(slug);
	const sidebar = props.sidebar ?? getSidebar(url.pathname, localeData.locale);
	const headings = props.headings ?? [];
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
	const entryMeta: StarlightRouteData['entryMeta'] = {
		dir: props.dir ?? localeData.dir,
		lang: props.lang ?? localeData.lang,
		locale: localeData.locale,
	};
	const routeData: StarlightRouteData = {
		...routeProps,
		...localeData,
		id,
		editUrl: undefined,
		entry,
		entryMeta,
		hasSidebar: props.hasSidebar ?? entry.data.template !== 'splash',
		headings,
		labels: useTranslations(localeData.locale).all(),
		lastUpdated: lastUpdated instanceof Date ? lastUpdated : undefined,
		pagination: getPrevNextLinks(sidebar, config.pagination, entry.data),
		sidebar,
		slug,
		toc: getToC({
			...routeProps,
			...localeData,
			entry,
			entryMeta,
			headings,
			id,
			locale: localeData.locale,
			slug,
		}),
	};
	if (isFallback) {
		routeData.isFallback = true;
	}
	return routeData;
}

/** Extract the virtual frontmatter properties from the props received by a virtual page. */
function getVirtualFrontmatter(props: VirtualPageProps) {
	// This needs to be in sync with ImageMetadata.
	// https://github.com/withastro/astro/blob/cf993bc263b58502096f00d383266cd179f331af/packages/astro/src/assets/types.ts#L32
	return StarlightVirtualFrontmatterSchema({
		image: () =>
			z.object({
				src: z.string(),
				width: z.number(),
				height: z.number(),
				format: z.union([
					z.literal('png'),
					z.literal('jpg'),
					z.literal('jpeg'),
					z.literal('tiff'),
					z.literal('webp'),
					z.literal('gif'),
					z.literal('svg'),
					z.literal('avif'),
				]),
			}),
	}).parse(props);
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
	const { lastUpdated: frontmatterLastUpdated } = entry.data;
	const { lastUpdated: configLastUpdated } = config;

	if (frontmatterLastUpdated ?? configLastUpdated) {
		const currentFilePath = fileURLToPath(new URL('src/content/docs/' + entry.id, project.root));
		try {
			return frontmatterLastUpdated instanceof Date
				? frontmatterLastUpdated
				: getNewestCommitDate(currentFilePath);
		} catch {
			// If the git command fails, ignore the error.
			return undefined;
		}
	}

	return undefined;
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
