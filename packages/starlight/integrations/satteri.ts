import { fileURLToPath } from 'node:url';
import { satteriHeadingIdsPlugin } from '@astrojs/markdown-satteri';
import type { Parents, Properties } from 'hast';
import type { Paragraph } from 'mdast';
import { directiveToMarkdown } from 'mdast-util-directive';
import { toMarkdown } from 'mdast-util-to-markdown';
import type {
	HastPluginDefinition,
	HastVisitorContext,
	MdastPluginDefinition,
	MdastPluginEntry,
	HastPluginEntry,
	SourceFormat,
} from 'satteri';
import { headingLinkIconChildren } from './markdown-icon';
import { getAsideIcon, isAsideVariant } from './aside-utils';
import {
	getMarkdownProcessorPaths,
	shouldTransformPath,
	type MarkdownProcessorPluginOptions,
} from './markdown-processor';

export function starlightSatteriPlugins(options: MarkdownProcessorPluginOptions): {
	mdastPlugins: MdastPluginEntry[];
	hastPlugins: HastPluginEntry[];
} {
	const allowedPaths = getMarkdownProcessorPaths(options);

	return {
		mdastPlugins: [
			({ fileURL, sourceFormat }) => {
				if (!shouldTransformPath(fileURL, allowedPaths)) return;

				// `shouldTransformPath` above already returned for a missing `fileURL`.
				const lang = options.absolutePathToLang(fileURLToPath(fileURL!));
				const t = options.useTranslations(lang);

				return satteriAsidesPlugin(t, sourceFormat);
			},
		],
		hastPlugins: [
			({ fileURL }) => {
				if (!shouldTransformPath(fileURL, allowedPaths)) return;

				const plugins = [satteriRtlCodeSupportPlugin()];

				if (options.starlightConfig.markdown.headingLinks) {
					// `shouldTransformPath` above already returned for a missing `fileURL`.
					const lang = options.absolutePathToLang(fileURLToPath(fileURL!));
					const t = options.useTranslations(lang);

					plugins.push(satteriHeadingIdsPlugin(), satteriAutolinkHeadingsPlugin(t));
				}

				return plugins;
			},
		],
	};
}

/**
 * Recover directives Starlight didn't claim so user content isn't dropped
 */
export function satteriDirectivesRestoration(): MdastPluginDefinition {
	return {
		name: 'starlight-directives-restoration',
		textDirective(node) {
			// Leave directives another plugin already handled (i.e. set `data` on) untouched.
			if (node.data !== undefined) return;
			return { type: 'text', value: serializeDirective(node) };
		},
		leafDirective(node) {
			if (node.data !== undefined) return;
			return {
				type: 'paragraph',
				children: [{ type: 'text', value: serializeDirective(node) }],
			};
		},
		containerDirective(node) {
			if (node.data !== undefined) return;
			return paragraphElement('div', {}, [...node.children]);
		},
	};
}

function paragraphElement(
	tagName: string,
	properties: Properties,
	children: unknown[] = []
): Paragraph {
	return {
		type: 'paragraph',
		data: { hName: tagName, hProperties: properties },
		children: children as Paragraph['children'],
	};
}

/** Convert `:::variant` directive blocks into styled asides. */
function satteriAsidesPlugin(t: I18nT, sourceFormat: SourceFormat): MdastPluginDefinition {
	return {
		name: 'starlight-asides',
		containerDirective(node, ctx) {
			if (!isAsideVariant(node.name)) return;

			const variant = node.name;

			let title = t(`aside.${variant}`);
			let titleNode: unknown[] = [{ type: 'text', value: title }];
			const children = [...node.children];
			const firstChild = children[0];
			if (
				firstChild?.type === 'paragraph' &&
				firstChild.data?.directiveLabel &&
				firstChild.children.length > 0
			) {
				titleNode = firstChild.children;
				title = ctx.textContent(firstChild);
				children.shift();
			}

			const icon = getAsideIcon(variant, node.attributes?.['icon']);
			const iconSvg = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" class="starlight-aside__icon">${icon}</svg>`;
			// Markdown and MDX require different AST shapes for raw HTML content.
			const iconNode =
				sourceFormat === 'mdx'
					? {
							type: 'mdxJsxTextElement',
							name: 'Fragment',
							attributes: [{ type: 'mdxJsxAttribute', name: 'set:html', value: iconSvg }],
						}
					: { type: 'html', value: iconSvg };

			return paragraphElement(
				'aside',
				{
					'aria-label': title,
					class: `starlight-aside starlight-aside--${variant}`,
				},
				[
					paragraphElement('p', { class: 'starlight-aside__title', 'aria-hidden': 'true' }, [
						iconNode,
						...titleNode,
					]),
					paragraphElement('div', { class: 'starlight-aside__content' }, children),
				]
			);
		},
	};
}

function serializeDirective(node: Parameters<typeof toMarkdown>[0]): string {
	const md = toMarkdown(node, { extensions: [directiveToMarkdown()] });
	return md.at(-1) === '\n' ? md.slice(0, -1) : md;
}

function satteriRtlCodeSupportPlugin(): HastPluginDefinition {
	return {
		name: 'starlight-rtl-code-support',
		element: [
			{
				filter: ['pre'],
				visit(node, ctx) {
					if (node.properties && 'dir' in node.properties) return;
					ctx.setProperty(node, 'dir', 'ltr');
				},
			},
			{
				filter: ['code'],
				visit(node, ctx) {
					if (!(node.properties && 'dir' in node.properties) && !hasPreParent(node, ctx)) {
						ctx.setProperty(node, 'dir', 'auto');
					}
				},
			},
		],
	};
}

/**
 * Check if any parent of `child` is a `<pre>` element by walking up the tree.
 */
function hasPreParent(child: Readonly<Parents> | undefined, ctx: HastVisitorContext): boolean {
	while (child) {
		const parent: Readonly<Parents> | undefined = ctx.parent(child);
		if (parent?.type === 'element' && parent.tagName === 'pre') return true;
		child = parent;
	}
	return false;
}

function satteriAutolinkHeadingsPlugin(t: I18nT): HastPluginDefinition {
	return {
		name: 'starlight-autolink-headings',
		element: {
			filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
			visit(node, ctx) {
				const id = node.properties?.['id'];
				if (typeof id !== 'string' || !id) return;

				const title = ctx.textContent(node);
				const accessibleLabel = t('heading.anchorLabel', {
					title,
					interpolation: { escapeValue: false },
				});

				return {
					type: 'element',
					tagName: 'div',
					properties: { class: `sl-heading-wrapper level-${node.tagName}` },
					children: [
						node,
						{
							type: 'element',
							tagName: 'a',
							properties: { class: 'sl-anchor-link', href: '#' + id },
							children: [
								{
									type: 'element',
									tagName: 'span',
									properties: { 'aria-hidden': 'true', class: 'sl-anchor-icon' },
									children: [
										{
											type: 'element',
											tagName: 'svg',
											properties: {
												width: '16',
												height: '16',
												viewBox: '0 0 24 24',
												fill: 'currentColor',
											},
											children: headingLinkIconChildren,
										},
									],
								},
								{
									type: 'element',
									tagName: 'span',
									properties: { class: 'sr-only', 'data-pagefind-ignore': true },
									children: [{ type: 'text', value: accessibleLabel }],
								},
							],
						},
					],
				};
			},
		},
	};
}

type I18nT = ReturnType<MarkdownProcessorPluginOptions['useTranslations']>;
