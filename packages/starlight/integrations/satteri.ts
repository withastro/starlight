import { fileURLToPath } from 'node:url';
import { isSatteriProcessor, satteriHeadingIdsPlugin } from '@astrojs/markdown-satteri';
import type { Properties } from 'hast';
import type { Paragraph } from 'mdast';
import { directiveToMarkdown } from 'mdast-util-directive';
import { toMarkdown } from 'mdast-util-to-markdown';
import type {
	HastPluginDefinition,
	HastPluginInput,
	MdastPluginInput,
	MdastPluginDefinition,
} from 'satteri';
import { asideIconPathAttrs, isAsideVariant } from './aside-icons';
import {
	getMarkdownProcessorPaths,
	shouldTransformPath,
	type MarkdownProcessorPluginOptions,
} from './markdown-process';
import { Icons } from '../components-internals/Icons';
import { throwInvalidAsideIconError } from './asides-error';
import type { StarlightIcon } from '../types';

// Re-exported so callers can narrow `markdown.processor` to a Sätteri processor through the same
// lazy import that loads the optional `@astrojs/markdown-satteri` peer dependency.
export { isSatteriProcessor };

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
			const filename = ctx.fileURL ? fileURLToPath(ctx.fileURL) : 'unknown';
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

function satteriRtlCodeSupportPlugin(allowedPaths: string[]): HastPluginDefinition {
	return {
		name: 'starlight-rtl-code-support',
		element: [
			{
				filter: ['pre'],
				visit(node, ctx) {
					if (!shouldTransformPath(ctx.fileURL, allowedPaths)) return;
					if (node.properties && 'dir' in node.properties) return;
					ctx.setProperty(node, 'dir', 'ltr');
				},
			},
			{
				filter: ['code'],
				visit(node, ctx) {
					if (!shouldTransformPath(ctx.fileURL, allowedPaths)) return;
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
				const filename = ctx.fileURL ? fileURLToPath(ctx.fileURL) : 'unknown';
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
