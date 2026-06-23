/// <reference types="mdast-util-directive" />

import { h as _h, s as _s, type Properties, type Result } from 'hastscript';
import type { Node, Paragraph as P, Parent, PhrasingContent, Root } from 'mdast';
import {
	type Directives,
	directiveToMarkdown,
	type TextDirective,
	type LeafDirective,
} from 'mdast-util-directive';
import { toMarkdown } from 'mdast-util-to-markdown';
import { toString } from 'mdast-util-to-string';
import type { Plugin, Transformer } from 'unified';
import { visit } from 'unist-util-visit';
import type { MarkdownProcessorPluginOptions } from './markdown-processor';
import type { StarlightIcon } from '../types';
import { Icons } from '../components-internals/Icons';
import { fromHtml } from 'hast-util-from-html';
import type { Element } from 'hast';
import { throwInvalidAsideIconError } from './asides-error';
import { asideIconPathAttrs, isAsideVariant, type AsideVariant } from './aside-icons';

/** Hacky function that generates an mdast HTML tree ready for conversion to HTML by rehype. */
function h(el: string, attrs: Properties = {}, children: unknown[] = []): P {
	const { tagName, properties } = _h(el, attrs);
	return {
		type: 'paragraph',
		data: { hName: tagName, hProperties: properties },
		children: children as P['children'],
	};
}

/** Hacky function that generates an mdast SVG tree ready for conversion to HTML by rehype. */
function s(el: string, attrs: Properties = {}, children: unknown[] = []): P {
	const { tagName, properties } = _s(el, attrs);
	return {
		type: 'paragraph',
		data: { hName: tagName, hProperties: properties },
		children: children as P['children'],
	};
}

/** Checks if a node is a directive. */
function isNodeDirective(node: Node): node is Directives {
	return (
		node.type === 'textDirective' ||
		node.type === 'leafDirective' ||
		node.type === 'containerDirective'
	);
}

/**
 * Transforms back directives not handled by Starlight to avoid breaking user content.
 * For example, a user might write `x:y` in the middle of a sentence, where `:y` would be
 * identified as a text directive, which are not used by Starlight, and we definitely want that
 * text to be rendered verbatim in the output.
 */
function transformUnhandledDirective(
	node: TextDirective | LeafDirective,
	index: number,
	parent: Parent
) {
	let markdown = toMarkdown(node, { extensions: [directiveToMarkdown()] });
	/**
	 * `mdast-util-to-markdown` assumes that the tree represents a complete document (as it's an AST
	 * and not a CST) and to follow the POSIX definition of a line (a sequence of zero or more
	 * non- <newline> characters plus a terminating <newline> character), a newline is automatically
	 * added at the end of the output so that the output is a valid file.
	 * In this specific case, we can safely remove the newline character at the end of the output
	 * before replacing the directive with its value.
	 *
	 * @see https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap03.html#tag_03_206
	 * @see https://github.com/syntax-tree/mdast-util-to-markdown/blob/fd6a508cc619b862f75b762dcf876c6b8315d330/lib/index.js#L79-L85
	 */
	if (markdown.at(-1) === '\n') markdown = markdown.slice(0, -1);
	const textNode = { type: 'text', value: markdown } as const;
	if (node.type === 'textDirective') {
		parent.children[index] = textNode;
	} else {
		parent.children[index] = {
			type: 'paragraph',
			children: [textNode],
		};
	}
}

/** Hacky function that generates the children of an mdast SVG tree. */
function makeSvgChildNodes(children: Result['children']): P[] {
	const nodes: P[] = [];
	for (const child of children) {
		if (child.type !== 'element') continue;
		nodes.push({
			type: 'paragraph',
			data: { hName: child.tagName, hProperties: child.properties },
			// We are explicitly casting to the expected type here due to the hacky nature of this
			// function which only works with SVG elements.
			children: makeSvgChildNodes(child.children) as unknown as P['children'],
		});
	}
	return nodes;
}

/**
 * remark plugin that converts blocks delimited with `:::` into styled
 * asides (a.k.a. “callouts”, “admonitions”, etc.). Depends on the
 * `remark-directive` module for the core parsing logic.
 *
 * For example, this Markdown
 *
 * ```md
 * :::tip[Did you know?]
 * Astro helps you build faster websites with “Islands Architecture”.
 * :::
 * ```
 *
 * will produce this output
 *
 * ```astro
 * <aside class="starlight-aside starlight-aside--tip" aria-label="Did you know?">
 *   <p class="starlight-aside__title" aria-hidden="true">Did you know?</p>
 *   <div class="starlight-aside__content">
 *     <p>Astro helps you build faster websites with “Islands Architecture”.</p>
 *   </div>
 * </aside>
 * ```
 */
export function remarkAsides(options: MarkdownProcessorPluginOptions): Plugin<[], Root> {
	const iconPaths: Record<AsideVariant, ReturnType<typeof s>[]> = {
		note: asideIconPathAttrs.note.map((attrs) => s('path', attrs)),
		tip: asideIconPathAttrs.tip.map((attrs) => s('path', attrs)),
		caution: asideIconPathAttrs.caution.map((attrs) => s('path', attrs)),
		danger: asideIconPathAttrs.danger.map((attrs) => s('path', attrs)),
	};

	const transformer: Transformer<Root> = (tree, file) => {
		const lang = options.absolutePathToLang(file.path);
		const t = options.useTranslations(lang);
		visit(tree, (node, index, parent) => {
			if (!parent || index === undefined || !isNodeDirective(node)) {
				return;
			}
			if (node.type === 'textDirective' || node.type === 'leafDirective') {
				return;
			}
			const variant = node.name;
			const attributes = node.attributes;
			if (!isAsideVariant(variant)) return;

			// remark-directive converts a container’s “label” to a paragraph added as the head of its
			// children with the `directiveLabel` property set to true. We want to pass it as the title
			// prop to <Aside>, so when we find a directive label, we store it for the title prop and
			// remove the paragraph from the container’s children.
			let title: string = t(`aside.${variant}`);
			let titleNode: PhrasingContent[] = [{ type: 'text', value: title }];
			const firstChild = node.children[0];
			if (
				firstChild?.type === 'paragraph' &&
				firstChild.data &&
				'directiveLabel' in firstChild.data &&
				firstChild.children.length > 0
			) {
				titleNode = firstChild.children;
				title = toString(firstChild.children);
				// The first paragraph contains a directive label, we can safely remove it.
				node.children.splice(0, 1);
			}

			let iconPath = iconPaths[variant];

			if (attributes?.['icon']) {
				const iconName = attributes['icon'] as StarlightIcon;
				const icon = Icons[iconName];
				if (!icon) throwInvalidAsideIconError(iconName);
				// Omit the root node and return only the first child which is the SVG element.
				const iconHastTree = fromHtml(`<svg>${icon}</svg>`, { fragment: true, space: 'svg' })
					.children[0] as Element;
				// Render all SVG child nodes.
				iconPath = makeSvgChildNodes(iconHastTree.children);
			}

			const aside = h(
				'aside',
				{
					'aria-label': title,
					class: `starlight-aside starlight-aside--${variant}`,
				},
				[
					h('p', { class: 'starlight-aside__title', 'aria-hidden': 'true' }, [
						s(
							'svg',
							{
								viewBox: '0 0 24 24',
								width: 16,
								height: 16,
								fill: 'currentColor',
								class: 'starlight-aside__icon',
							},
							iconPath
						),
						...titleNode,
					]),
					h('div', { class: 'starlight-aside__content' }, node.children),
				]
			);

			parent.children[index] = aside;
		});
	};

	return function attacher() {
		return transformer;
	};
}

export function remarkDirectivesRestoration() {
	return function transformer(tree: Root) {
		visit(tree, (node, index, parent) => {
			if (
				index !== undefined &&
				parent &&
				(node.type === 'textDirective' || node.type === 'leafDirective') &&
				node.data === undefined
			) {
				transformUnhandledDirective(node, index, parent);
				return;
			}
		});
	};
}
