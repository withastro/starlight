import type { Nodes, Root } from 'hast';
import { toString } from 'hast-util-to-string';
import { h } from 'hastscript';
import type { Transformer } from 'unified';
import { SKIP, visit } from 'unist-util-visit';
import { anchorLinkIconPath } from './anchor-icon';
import type { MarkdownProcessorPluginOptions } from './markdown-processor';

const AnchorLinkIcon = h(
	'span',
	{ ariaHidden: 'true', class: 'sl-anchor-icon' },
	h(
		'svg',
		{ width: 16, height: 16, viewBox: '0 0 24 24' },
		h('path', { fill: 'currentcolor', d: anchorLinkIconPath })
	)
);

/**
 * Add anchor links to headings.
 */
export default function rehypeAutolinkHeadings({
	absolutePathToLang,
	useTranslations,
}: MarkdownProcessorPluginOptions) {
	const transformer: Transformer<Root> = (tree, file) => {
		const pageLang = absolutePathToLang(file.path);
		const t = useTranslations(pageLang);

		visit(tree, 'element', function (node, index, parent) {
			if (!headingRank(node) || !node.properties.id || typeof index !== 'number' || !parent) {
				return;
			}

			const accessibleLabel = t('heading.anchorLabel', {
				title: toString(node),
				interpolation: { escapeValue: false },
			});

			// Wrap the heading in a div and append the anchor link.
			parent.children[index] = h(
				'div',
				{ class: `sl-heading-wrapper level-${node.tagName}` },
				// Heading
				node,
				// Anchor link
				{
					type: 'element',
					tagName: 'a',
					properties: { class: 'sl-anchor-link', href: '#' + String(node.properties.id) },
					children: [
						AnchorLinkIcon,
						h('span', { class: 'sr-only', 'data-pagefind-ignore': true }, accessibleLabel),
					],
				}
			);

			return SKIP;
		});
	};

	return function attacher() {
		return transformer;
	};
}

// This utility is inlined from https://github.com/syntax-tree/hast-util-heading-rank
// Copyright (c) 2020 Titus Wormer <tituswormer@gmail.com>
// MIT License: https://github.com/syntax-tree/hast-util-heading-rank/blob/main/license
/**
 * Get the rank (`1` to `6`) of headings (`h1` to `h6`).
 * @param node Node to check.
 * @returns Rank of the heading or `undefined` if not a heading.
 */
function headingRank(node: Nodes): number | undefined {
	const name = node.type === 'element' ? node.tagName.toLowerCase() : '';
	const code = name.length === 2 && name.charCodeAt(0) === 104 /* `h` */ ? name.charCodeAt(1) : 0;
	return code > 48 /* `0` */ && code < 55 /* `7` */ ? code - 48 /* `0` */ : undefined;
}
