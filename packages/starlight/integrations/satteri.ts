import { fileURLToPath } from 'node:url';
import { satteriHeadingIdsPlugin } from '@astrojs/markdown-satteri';
import type { Element, Properties } from 'hast';
import type { Paragraph } from 'mdast';
import { directiveToMarkdown } from 'mdast-util-directive';
import { toMarkdown } from 'mdast-util-to-markdown';
import type {
	HastPluginDefinition,
	HastPluginInput,
	MdastPluginInput,
	MdastPluginDefinition,
} from 'satteri';
import { anchorLinkIconPath } from './anchor-icon';
import { asideIconPathAttrs, isAsideVariant } from './aside-icons';
import {
	getMarkdownProcessorPaths,
	shouldTransformPath,
	type MarkdownProcessorPluginOptions,
} from './markdown-processor';
import { Icons } from '../components-internals/Icons';
import { throwInvalidAsideIconError } from './asides-error';
import type { StarlightIcon } from '../types';

export function starlightSatteriPlugins(options: MarkdownProcessorPluginOptions): {
	mdastPlugins: MdastPluginInput[];
	hastPlugins: HastPluginInput[];
} {
	const allowedPaths = getMarkdownProcessorPaths(options);
	return {
		mdastPlugins: [satteriAsidesPlugin(options, allowedPaths)],
		hastPlugins: [
			satteriRtlCodeSupportPlugin(allowedPaths),
			...(options.starlightConfig.markdown.headingLinks
				? [() => satteriHeadingIdsPlugin(), satteriAutolinkHeadingsPlugin(options, allowedPaths)]
				: []),
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
function satteriAsidesPlugin(
	options: MarkdownProcessorPluginOptions,
	allowedPaths: string[]
): MdastPluginDefinition {
	return {
		name: 'starlight-asides',
		containerDirective(node, ctx) {
			if (!shouldTransformPath(ctx.fileURL, allowedPaths)) return;
			if (!isAsideVariant(node.name)) return;

			const variant = node.name;
			// `shouldTransformPath` above already returned for a missing `fileURL`.
			const filename = fileURLToPath(ctx.fileURL!);
			const t = options.useTranslations(options.absolutePathToLang(filename));

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

			const customIconName = node.attributes?.['icon'];
			let innerSvgHtml: string;
			if (customIconName) {
				const icon = Icons[customIconName as StarlightIcon];
				if (!icon) throwInvalidAsideIconError(customIconName);
				innerSvgHtml = icon;
			} else {
				innerSvgHtml = asideIconPathAttrs[variant]
					.map((attrs) => `<path${attrsToHtml(attrs)}/>`)
					.join('');
			}
			const iconSvg = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" class="starlight-aside__icon">${innerSvgHtml}</svg>`;

			return paragraphElement(
				'aside',
				{
					'aria-label': title,
					class: `starlight-aside starlight-aside--${variant}`,
				},
				[
					paragraphElement('p', { class: 'starlight-aside__title', 'aria-hidden': 'true' }, [
						{ type: 'html', value: iconSvg },
						...titleNode,
					]),
					paragraphElement('div', { class: 'starlight-aside__content' }, children),
				]
			);
		},
	};
}

function attrsToHtml(attrs: Record<string, string>): string {
	let out = '';
	for (const [key, value] of Object.entries(attrs)) {
		out += ` ${key}="${value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`;
	}
	return out;
}

function serializeDirective(node: Parameters<typeof toMarkdown>[0]): string {
	const md = toMarkdown(node, { extensions: [directiveToMarkdown()] });
	return md.at(-1) === '\n' ? md.slice(0, -1) : md;
}

function satteriRtlCodeSupportPlugin(allowedPaths: string[]): () => HastPluginDefinition {
	return () => {
		// HACK: Sätteri currently does not expose a way to either know the parent of a node, or
		// skipping a subtree visit. To work around this, we manually track the source spans of `<pre>`
		// elements and skip applying `dir="auto"` to `<code>` elements inside those spans. This is:
		// bad, because it means that it won't work for nodes without positions (e.g. generated nodes),
		// but it's as good as it gets right now.
		const preSpans: Array<[number, number]> = [];
		return {
			name: 'starlight-rtl-code-support',
			element: [
				{
					filter: ['pre'],
					visit(node, ctx) {
						if (!shouldTransformPath(ctx.fileURL, allowedPaths)) return;
						const span = nodeSpan(node);
						if (span) preSpans.push(span);
						if (node.properties && 'dir' in node.properties) return;
						ctx.setProperty(node, 'dir', 'ltr');
					},
				},
				{
					filter: ['code'],
					visit(node, ctx) {
						if (!shouldTransformPath(ctx.fileURL, allowedPaths)) return;
						if (isInsideSpan(nodeSpan(node), preSpans)) return;
						if (node.properties && 'dir' in node.properties) return;
						ctx.setProperty(node, 'dir', 'auto');
					},
				},
			],
			// Shiki runs ahead of us and replaces the highlighted `<pre>` element with a raw HTML
			// node, so the `pre` element visitor above never sees it. Patch the raw markup instead.
			raw(node, ctx) {
				if (!shouldTransformPath(ctx.fileURL, allowedPaths)) return undefined;
				const value = ltrRawPre(node.value);
				if (value === null) return undefined;
				return { type: 'raw', value };
			},
		};
	};
}

/** The source byte span of a node, or `null` when it carries no position (e.g. a generated node). */
function nodeSpan(node: { position?: Element['position'] }): [number, number] | null {
	const start = node.position?.start.offset;
	const end = node.position?.end.offset;
	return typeof start === 'number' && typeof end === 'number' ? [start, end] : null;
}

function isInsideSpan(span: [number, number] | null, spans: Array<[number, number]>): boolean {
	if (!span) return false;
	return spans.some(([start, end]) => span[0] >= start && span[1] <= end);
}

const rawPreOpenTag = /<pre(?=[\s>])[^>]*>/;

/**
 * Add `dir="ltr"` to the opening tag of a raw `<pre>` HTML string, unless it already declares a
 * `dir`. Returns `null` when the value isn’t a `<pre>`, leaving unrelated raw HTML untouched.
 */
function ltrRawPre(value: string): string | null {
	const openTag = value.match(rawPreOpenTag)?.[0];
	if (!openTag || /\sdir\s*=/.test(openTag)) return null;
	return value.replace(openTag, () => `<pre dir="ltr"${openTag.slice(4)}`);
}

function satteriAutolinkHeadingsPlugin(
	options: MarkdownProcessorPluginOptions,
	allowedPaths: string[]
): HastPluginDefinition {
	return {
		name: 'starlight-autolink-headings',
		element: {
			filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
			visit(node, ctx) {
				if (!shouldTransformPath(ctx.fileURL, allowedPaths)) return;

				const id = node.properties?.['id'];
				if (typeof id !== 'string' || !id) return;

				const title = ctx.textContent(node);
				// `shouldTransformPath` above already returned for a missing `fileURL`.
				const filename = fileURLToPath(ctx.fileURL!);
				const t = options.useTranslations(options.absolutePathToLang(filename));
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
														d: anchorLinkIconPath,
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
