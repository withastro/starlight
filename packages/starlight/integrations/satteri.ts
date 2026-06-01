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
	getRemarkRehypePaths,
	shouldTransformPath,
	type RemarkRehypePluginOptions,
} from './remark-rehype';
import { Icons } from '../components-internals/Icons';
import { throwInvalidAsideIconError } from './asides-error';
import type { StarlightIcon } from '../types';

// Re-exported so callers can narrow `markdown.processor` to a Sätteri processor through the same
// lazy import that loads the optional `@astrojs/markdown-satteri` peer dependency.
export { isSatteriProcessor };

/** Sätteri mdast/hast plugins applied to Starlight content. */
export function starlightSatteriPlugins(options: RemarkRehypePluginOptions): {
	mdastPlugins: MdastPluginInput[];
	hastPlugins: HastPluginInput[];
} {
	const allowedPaths = getRemarkRehypePaths(options);
	return {
		mdastPlugins: [satteriAsidesPlugin(options, allowedPaths)],
		hastPlugins: [
			satteriRtlCodeSupportPlugin(allowedPaths),
			// Run Astro's heading-id pass ahead of our autolink so ids exist by the
			// time we read them. Astro pushes its own copy after user plugins; that
			// later pass is idempotent thanks to its `existingId` check. The factory
			// wrapper gives each document a fresh slugger.
			...(options.starlightConfig.markdown.headingLinks
				? [() => satteriHeadingIdsPlugin(), satteriAutolinkHeadingsPlugin(options, allowedPaths)]
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

/** mdast paragraph carrying `data.hName`/`data.hProperties` for mdast→hast emission. */
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

/** Wrap headings in a flex container with a trailing anchor link. */
function satteriAutolinkHeadingsPlugin(
	options: RemarkRehypePluginOptions,
	allowedPaths: string[]
): HastPluginDefinition {
	return {
		name: 'starlight-autolink-headings',
		element: {
			filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
			visit(node, ctx) {
				if (!shouldTransformPath(ctx.filename, allowedPaths)) return;

				const id = node.properties?.['id'];
				if (typeof id !== 'string' || !id) return;

				const title = ctx.textContent(node);
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
