import Slugger from 'github-slugger';
import type { Paragraph } from 'mdast';
import { directiveToMarkdown } from 'mdast-util-directive';
import { toMarkdown } from 'mdast-util-to-markdown';
import type { HastPluginDefinition, MdastPluginDefinition } from 'satteri';
import { asideIconPathAttrs, type AsideVariant } from './aside-icons';
import {
	getRemarkRehypePaths,
	shouldTransformPath,
	type RemarkRehypePluginOptions,
} from './remark-rehype';
import { Icons } from '../components-internals/Icons';
import { throwInvalidAsideIconError } from './asides-error';
import type { StarlightIcon } from '../types';

/** Sätteri mdast/hast plugins applied to Starlight content. */
export function starlightSatteriPlugins(options: RemarkRehypePluginOptions): {
	mdastPlugins: MdastPluginDefinition[];
	hastPlugins: HastPluginDefinition[];
} {
	const allowedPaths = getRemarkRehypePaths(options);
	return {
		mdastPlugins: [satteriAsidesPlugin(options, allowedPaths)],
		hastPlugins: [
			satteriRtlCodeSupportPlugin(allowedPaths),
			...(options.starlightConfig.markdown.headingLinks
				? [satteriAutolinkHeadingsPlugin(options, allowedPaths)]
				: []),
		],
	};
}

/** Restore unhandled text/leaf directives to their source Markdown form. */
export function satteriDirectivesRestoration(): MdastPluginDefinition {
	return {
		name: 'starlight-directives-restoration',
		textDirective(node) {
			return { type: 'text', value: serializeDirective(node) };
		},
		leafDirective(node) {
			return {
				type: 'paragraph',
				children: [{ type: 'text', value: serializeDirective(node) }],
			};
		},
	};
}

const ASIDE_VARIANTS = new Set<string>(['note', 'tip', 'caution', 'danger']);
const isAsideVariant = (s: string): s is AsideVariant => ASIDE_VARIANTS.has(s);

/** mdast paragraph carrying `data.hName`/`data.hProperties` for mdast→hast emission. */
function paragraphElement(
	tagName: string,
	properties: Record<string, unknown>,
	children: unknown[] = []
): Paragraph {
	return {
		type: 'paragraph',
		data: { hName: tagName, hProperties: properties as unknown as Record<string, never> },
		children: children as Paragraph['children'],
	};
}

/** Convert `:::variant` directive blocks into styled asides. */
function satteriAsidesPlugin(
	options: RemarkRehypePluginOptions,
	allowedPaths: string[]
): MdastPluginDefinition {
	return {
		name: 'starlight-asides',
		containerDirective(node, ctx) {
			if (!shouldTransformPath(ctx.filename, allowedPaths)) return;
			if (!isAsideVariant(node.name)) return;

			const variant = node.name;
			const t = options.useTranslations(options.absolutePathToLang(ctx.filename));

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

			let svgChildren: ReturnType<typeof paragraphElement>[] = asideIconPathAttrs[variant].map((attrs) =>
				paragraphElement('path', attrs)
			);

			const customIconName = node.attributes?.['icon'];
			if (customIconName) {
				const icon = Icons[customIconName as StarlightIcon];
				if (!icon) throwInvalidAsideIconError(customIconName);
				svgChildren = parseInlineSvg(icon);
			}

			return paragraphElement(
				'aside',
				{
					'aria-label': title,
					class: `starlight-aside starlight-aside--${variant}`,
				},
				[
					paragraphElement(
						'p',
						{ class: 'starlight-aside__title', 'aria-hidden': 'true' },
						[
							paragraphElement(
								'svg',
								{
									viewBox: '0 0 24 24',
									width: 16,
									height: 16,
									fill: 'currentColor',
									class: 'starlight-aside__icon',
								},
								svgChildren
							),
							...titleNode,
						]
					),
					paragraphElement('div', { class: 'starlight-aside__content' }, children),
				]
			);
		},
	};
}

/** Parse inline-SVG `Icons` markup into `paragraphElement` form without pulling in `parse5`. */
function parseInlineSvg(svg: string): ReturnType<typeof paragraphElement>[] {
	const result: ReturnType<typeof paragraphElement>[] = [];
	const tagRegex = /<([a-zA-Z][a-zA-Z0-9-]*)([^>]*?)\/?>/g;
	let match: RegExpExecArray | null;
	while ((match = tagRegex.exec(svg)) !== null) {
		const tagName = match[1]!;
		const attrs = parseSvgAttributes(match[2] ?? '');
		result.push(paragraphElement(tagName, attrs));
	}
	return result;
}

function parseSvgAttributes(input: string): Record<string, string> {
	const attrs: Record<string, string> = {};
	const attrRegex = /([a-zA-Z-]+)\s*=\s*"([^"]*)"/g;
	let match: RegExpExecArray | null;
	while ((match = attrRegex.exec(input)) !== null) {
		attrs[match[1]!] = match[2]!;
	}
	return attrs;
}

/** Strip the trailing POSIX newline `mdast-util-to-markdown` always appends. */
function serializeDirective(node: Parameters<typeof toMarkdown>[0]): string {
	const md = toMarkdown(node, { extensions: [directiveToMarkdown()] });
	return md.at(-1) === '\n' ? md.slice(0, -1) : md;
}

/** Adds `dir` to `<code>`/`<pre>` lacking one. */
function satteriRtlCodeSupportPlugin(allowedPaths: string[]): HastPluginDefinition {
	return {
		name: 'starlight-rtl-code-support',
		element: [
			{
				filter: ['pre'],
				visit(node, ctx) {
					if (!shouldTransformPath(ctx.filename, allowedPaths)) return;
					if (node.properties && 'dir' in node.properties) return;
					ctx.setProperty(node, 'dir', 'ltr');
				},
			},
			{
				filter: ['code'],
				visit(node, ctx) {
					if (!shouldTransformPath(ctx.filename, allowedPaths)) return;
					if (node.properties && 'dir' in node.properties) return;
					ctx.setProperty(node, 'dir', 'auto');
				},
			},
		],
	};
}

/**
 * Wrap headings in a flex container with a trailing anchor link. Assigns the
 * heading id ourselves so Sätteri's built-in heading-id pass (which runs after
 * user hast plugins) preserves it via its `existingId` check.
 */
function satteriAutolinkHeadingsPlugin(
	options: RemarkRehypePluginOptions,
	allowedPaths: string[]
): HastPluginDefinition {
	const sluggerByFile = new Map<string, Slugger>();
	return {
		name: 'starlight-autolink-headings',
		element: {
			filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
			visit(node, ctx) {
				if (!shouldTransformPath(ctx.filename, allowedPaths)) return;

				const title = ctx.textContent(node);
				const existingId = node.properties?.['id'];
				let id: string;
				if (typeof existingId === 'string' && existingId) {
					id = existingId;
				} else {
					let slugger = sluggerByFile.get(ctx.filename);
					if (!slugger) {
						slugger = new Slugger();
						sluggerByFile.set(ctx.filename, slugger);
					}
					id = slugger.slug(title);
					ctx.setProperty(node, 'id', id);
				}

				const t = options.useTranslations(options.absolutePathToLang(ctx.filename));
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
											properties: { width: '16', height: '16', viewBox: '0 0 24 24' },
											children: [
												{
													type: 'element',
													tagName: 'path',
													properties: {
														fill: 'currentcolor',
														d: 'm12.11 15.39-3.88 3.88a2.52 2.52 0 0 1-3.5 0 2.47 2.47 0 0 1 0-3.5l3.88-3.88a1 1 0 0 0-1.42-1.42l-3.88 3.89a4.48 4.48 0 0 0 6.33 6.33l3.89-3.88a1 1 0 1 0-1.42-1.42Zm8.58-12.08a4.49 4.49 0 0 0-6.33 0l-3.89 3.88a1 1 0 0 0 1.42 1.42l3.88-3.88a2.52 2.52 0 0 1 3.5 0 2.47 2.47 0 0 1 0 3.5l-3.88 3.88a1 1 0 1 0 1.42 1.42l3.88-3.89a4.49 4.49 0 0 0 0-6.33ZM8.83 15.17a1 1 0 0 0 1.1.22 1 1 0 0 0 .32-.22l4.92-4.92a1 1 0 0 0-1.42-1.42l-4.92 4.92a1 1 0 0 0 0 1.42Z',
													},
													children: [],
												},
											],
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
