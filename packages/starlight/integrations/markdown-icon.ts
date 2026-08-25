import type { Element, ElementContent } from 'hast';
import { fromHtml } from 'hast-util-from-html';
import { Icons } from '../components-internals/Icons';

export const headingLinkIconSvgChildrenHtml = Icons['link-alt'];
export const headingLinkIconChildren = parseIconChildren(headingLinkIconSvgChildrenHtml);

/** Parse a Starlight icon SVG fragment as children of an `<svg>` element. */
export function parseIconChildren(icon: string): ElementContent[] {
	const svg = fromHtml(`<svg>${icon}</svg>`, { fragment: true, space: 'svg' })
		.children[0] as Element;
	return svg.children;
}
