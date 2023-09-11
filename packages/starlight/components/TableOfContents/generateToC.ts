import type { MarkdownHeading } from 'astro';

export interface TocItem extends MarkdownHeading {
	children: TocItem[];
}

function diveChildren(item: TocItem, depth: number): TocItem[] {
	if (depth === 1) {
		return item.children;
	} else if (item.children.length > 0) {
		return diveChildren(item.children.at(-1)!, depth - 1);
	} else {
		return [];
	}
}

interface TocOpts {
	minHeadingLevel: number;
	maxHeadingLevel: number;
	title?: string;
}

export function generateToC(
	headings: MarkdownHeading[],
	{ minHeadingLevel, maxHeadingLevel, title = 'Overview' }: TocOpts
) {
	const overview = { depth: 2, slug: '_top', text: title };
	headings = [
		overview,
		...headings.filter(({ depth }) => depth >= minHeadingLevel && depth <= maxHeadingLevel),
	];
	const toc: Array<TocItem> = [];

	for (const heading of headings) {
		if (toc.length === 0) {
			toc.push({ ...heading, children: [] });
		} else {
			const lastItemInToc = toc.at(-1)!;
			if (heading.depth < lastItemInToc.depth) {
				throw new Error(`Orphan heading found: ${heading.text}.`);
			}
			if (heading.depth === lastItemInToc.depth) {
				// same depth
				toc.push({ ...heading, children: [] });
			} else {
				// higher depth
				// push into children, or children's children alike
				const gap = heading.depth - lastItemInToc.depth;
				const target = diveChildren(lastItemInToc, gap);
				target.push({ ...heading, children: [] });
			}
		}
	}
	return toc;
}
