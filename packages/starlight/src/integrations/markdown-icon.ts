import type { ElementContent, Root } from 'hast';
import { htmlToHast } from 'satteri';
import { Icons } from '../components-internals/Icons';

export const headingLinkIconSvgChildrenHtml = Icons['link-alt'];
export const headingLinkIconChildren = parseIconChildren(headingLinkIconSvgChildrenHtml);

/** Parse a Starlight icon SVG fragment as children of an `<svg>` element. */
export function parseIconChildren(icon: string): ElementContent[] {
	const tree = htmlToHast(icon, { fragment: true, space: 'svg' }) as Root;
	return tree.children as ElementContent[];
}
