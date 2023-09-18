import type { MarkdownHeading } from 'astro';
import { fileURLToPath } from 'node:url';
import project from 'virtual:starlight/project-context';
import config from 'virtual:starlight/user-config';
import { generateToC, type TocItem } from '../components/TableOfContents/generateToC';
import { getPrevNextLinks, getSidebar, type SidebarEntry } from './navigation';
import type { Route } from './routing';
import { useTranslations } from './translations';
import { getFileCommitDate } from './git';

export interface PageProps extends Route {
	headings: MarkdownHeading[];
}

export interface StarlightRouteData extends Route {
	/** Array of Markdown headings extracted from the current page. */
	headings: MarkdownHeading[];
	/** Site navigation sidebar entries for this page. */
	sidebar: SidebarEntry[];
	/** Whether or not the sidebar should be displayed on this page. */
	hasSidebar: boolean;
	/** Links to the previous and next page in the sidebar if enabled. */
	pagination: ReturnType<typeof getPrevNextLinks>;
	/** Table of contents for this page if enabled. */
	toc: { minHeadingLevel: number; maxHeadingLevel: number; items: TocItem[] } | undefined;
	/** JS Date object representing when this page was last updated if enabled. */
	lastUpdated: Date | undefined;
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

function getLastUpdated({ entry, id }: PageProps): Date | undefined {
	if (entry.data.lastUpdated ?? config.lastUpdated) {
		const currentFilePath = fileURLToPath(new URL('src/content/docs/' + id, project.root));
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
