import type { MarkdownHeading, AstroGlobal } from 'astro';
import config from 'virtual:starlight/user-config';
import { generateToC, type TocItem } from '../components/TableOfContents/generateToC';
import { getSidebar, type SidebarEntry } from './navigation';
import type { Route } from './routing';
import { useTranslations } from './translations';

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
	/** Table of contents for this page if enabled. */
	toc?: { minHeadingLevel: number; maxHeadingLevel: number; items: TocItem[] };
}

export function generateRouteData({ props, url }: AstroGlobal<PageProps>): StarlightRouteData {
	const { entry, headings, locale } = props;

	const routeData: StarlightRouteData = {
		...props,
		sidebar: getSidebar(url.pathname, locale),
		hasSidebar: entry.data.template !== 'splash',
	};

	const tocConfig =
		entry.data.template === 'splash'
			? false
			: entry.data.tableOfContents !== undefined
			? entry.data.tableOfContents
			: config.tableOfContents;
	if (tocConfig) {
		const t = useTranslations(locale);
		routeData.toc = {
			...tocConfig,
			items: generateToC(headings, { ...tocConfig, title: t('tableOfContents.overview') }),
		};
	}
	return routeData;
}
