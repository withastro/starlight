/// <reference types="mdast-util-directive" />

import type { AstroConfig, AstroIntegration, AstroUserConfig } from 'astro';
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
import remarkDirective from 'remark-directive';
import type { Plugin, Transformer } from 'unified';
import { visit } from 'unist-util-visit';
import type { HookParameters, StarlightConfig, StarlightIcon } from '../types';
import {
	AsideDefaultIcons,
	getBuiltInIconHastTree,
	getCollectionIconHastTree,
	isBuiltInIcon,
} from '../utils/icons';

export const AsideVariants = ['note', 'tip', 'caution', 'danger'] as const;
export type AsideVariant = (typeof AsideVariants)[number];

export function isAsideVariant(value: string): value is AsideVariant {
	return AsideVariants.includes(value as AsideVariant);
}

interface AsidesOptions {
	starlightConfig: Pick<StarlightConfig, 'defaultLocale' | 'locales'>;
	astroConfig: { root: AstroConfig['root']; srcDir: AstroConfig['srcDir'] };
	useTranslations: HookParameters<'config:setup'>['useTranslations'];
	absolutePathToLang: HookParameters<'config:setup'>['absolutePathToLang'];
}

/** Hacky function that generates an mdast HTML tree ready for conversion to HTML by rehype. */
function h(el: string, attrs: Properties = {}, children: any[] = []): P {
	const { tagName, properties } = _h(el, attrs);
	return {
		type: 'paragraph',
		data: { hName: tagName, hProperties: properties },
		children,
	};
}

/** Hacky function that generates an mdast SVG tree ready for conversion to HTML by rehype. */
function s(el: string, attrs: Properties = {}, children: any[] = []): P {
	const { tagName, properties } = _s(el, attrs);
	return {
		type: 'paragraph',
		data: { hName: tagName, hProperties: properties },
		children,
	};
}

/** Hacky function that generates the children of an mdast SVG tree. */
function makeSvgChildNodes(children: Result['children']): any[] {
	const nodes: P[] = [];
	for (const child of children) {
		if (child.type !== 'element') continue;
		nodes.push({
			type: 'paragraph',
			data: { hName: child.tagName, hProperties: child.properties },
			children: makeSvgChildNodes(child.children),
		});
	}
	return nodes;
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

/** Make a node containing an SVG icon from the passed icon name. */
function makeSVGIcon(icon: StarlightIcon) {
	const iconHastTree = isBuiltInIcon(icon)
		? getBuiltInIconHastTree(icon)
		: getCollectionIconHastTree(icon);

	return s(
		'svg',
		{
			viewBox: '0 0 24 24',
			width: 16,
			height: 16,
			fill: 'currentColor',
			class: 'starlight-aside__icon',
		},
		makeSvgChildNodes(iconHastTree.children)
	);
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
function remarkAsides(options: AsidesOptions): Plugin<[], Root> {
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
			const iconAttribute = node.attributes?.['icon'];

			const aside = h(
				'aside',
				{
					'aria-label': title,
					class: `starlight-aside starlight-aside--${variant}`,
				},
				[
					h('p', { class: 'starlight-aside__title', 'aria-hidden': 'true' }, [
						makeSVGIcon(iconAttribute || AsideDefaultIcons[variant]),
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

type RemarkPlugins = NonNullable<NonNullable<AstroUserConfig['markdown']>['remarkPlugins']>;

export function starlightAsides(options: AsidesOptions): RemarkPlugins {
	return [remarkDirective, remarkAsides(options)];
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

/**
 * Directives not handled by Starlight are transformed back to their original form to avoid
 * breaking user content.
 * To allow remark plugins injected by Starlight plugins through Astro integrations to handle
 * such directives, we need to restore unhandled text and leaf directives back to their original
 * form only after all these other plugins have run.
 * To do so, we run a remark plugin restoring these directives back to their original form from
 * another Astro integration that runs after all the ones that may have been injected by Starlight
 * plugins.
 */
export function starlightDirectivesRestorationIntegration(): AstroIntegration {
	return {
		name: 'starlight-directives-restoration',
		hooks: {
			'astro:config:setup': ({ updateConfig }) => {
				updateConfig({
					markdown: {
						remarkPlugins: [remarkDirectivesRestoration],
					},
				});
			},
		},
	};
}
