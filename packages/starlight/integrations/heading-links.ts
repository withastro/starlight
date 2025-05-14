import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import type { AstroConfig, AstroUserConfig } from 'astro';
import type { Nodes, Root } from 'hast';
import { toString } from 'hast-util-to-string';
import { h } from 'hastscript';
import type { Transformer } from 'unified';
import { SKIP, visit } from 'unist-util-visit';
import type { HookParameters, StarlightConfig } from '../types';
import { resolveCollectionPath } from '../utils/collection';

const AnchorLinkIcon = h(
	'span',
	{ ariaHidden: 'true', class: 'sl-anchor-icon' },
	h(
		'svg',
		{ width: 16, height: 16, viewBox: '0 0 24 24' },
		h('path', {
			fill: 'currentcolor',
			d: 'm12.11 15.39-3.88 3.88a2.52 2.52 0 0 1-3.5 0 2.47 2.47 0 0 1 0-3.5l3.88-3.88a1 1 0 0 0-1.42-1.42l-3.88 3.89a4.48 4.48 0 0 0 6.33 6.33l3.89-3.88a1 1 0 1 0-1.42-1.42Zm8.58-12.08a4.49 4.49 0 0 0-6.33 0l-3.89 3.88a1 1 0 0 0 1.42 1.42l3.88-3.88a2.52 2.52 0 0 1 3.5 0 2.47 2.47 0 0 1 0 3.5l-3.88 3.88a1 1 0 1 0 1.42 1.42l3.88-3.89a4.49 4.49 0 0 0 0-6.33ZM8.83 15.17a1 1 0 0 0 1.1.22 1 1 0 0 0 .32-.22l4.92-4.92a1 1 0 0 0-1.42-1.42l-4.92 4.92a1 1 0 0 0 0 1.42Z',
		})
	)
);

/**
 * Add anchor links to headings.
 */
export default function rehypeAutolinkHeadings(
	docsCollectionPath: string,
	useTranslationsForLang: AutolinkHeadingsOptions['useTranslations'],
	absolutePathToLang: AutolinkHeadingsOptions['absolutePathToLang']
) {
	const transformer: Transformer<Root> = (tree, file) => {
		// If the document is not part of the Starlight docs collection, skip it.
		if (!normalizePath(file.path).startsWith(docsCollectionPath)) return;

		const pageLang = absolutePathToLang(file.path);
		const t = useTranslationsForLang(pageLang);

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
					properties: { class: 'sl-anchor-link', href: '#' + node.properties.id },
					children: [AnchorLinkIcon, h('span', { class: 'sr-only' }, accessibleLabel)],
				}
			);

			return SKIP;
		});
	};

	return function attacher() {
		return transformer;
	};
}

interface AutolinkHeadingsOptions {
	starlightConfig: Pick<StarlightConfig, 'markdown'>;
	astroConfig: Pick<AstroConfig, 'srcDir'> & {
		experimental: Pick<AstroConfig['experimental'], 'headingIdCompat'>;
	};
	useTranslations: HookParameters<'config:setup'>['useTranslations'];
	absolutePathToLang: HookParameters<'config:setup'>['absolutePathToLang'];
}
type RehypePlugins = NonNullable<NonNullable<AstroUserConfig['markdown']>['rehypePlugins']>;

export const starlightAutolinkHeadings = ({
	starlightConfig,
	astroConfig,
	useTranslations,
	absolutePathToLang,
}: AutolinkHeadingsOptions): RehypePlugins =>
	starlightConfig.markdown.headingLinks
		? [
				[
					rehypeHeadingIds,
					{ experimentalHeadingIdCompat: astroConfig.experimental?.headingIdCompat },
				],
				rehypeAutolinkHeadings(
					normalizePath(resolveCollectionPath('docs', astroConfig.srcDir)),
					useTranslations,
					absolutePathToLang
				),
			]
		: [];

/**
 * File path separators seems to be inconsistent on Windows when the rehype plugin is used on
 * Markdown vs MDX files.
 * For the time being, we normalize the path to unix style path.
 */
const backSlashRegex = /\\/g;
function normalizePath(path: string) {
	return path.replace(backSlashRegex, '/');
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
