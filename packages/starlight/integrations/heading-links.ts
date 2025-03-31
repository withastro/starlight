import type { Root } from 'hast';
import { toString } from 'hast-util-to-string';
import { h } from 'hastscript';
import rehypeAutolinkHeadings, { type Options as AutolinkOptions } from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import type { Transformer } from 'unified';
import { visit } from 'unist-util-visit';
import type { HookParameters, StarlightPlugin } from '../types';

const AnchorLinkIcon = h(
	'span',
	{ ariaHidden: 'true', class: 'anchor-icon' },
	h(
		'svg',
		{ width: 16, height: 16, viewBox: '0 0 24 24' },
		h('path', {
			fill: 'currentcolor',
			d: 'm12.11 15.39-3.88 3.88a2.52 2.52 0 0 1-3.5 0 2.47 2.47 0 0 1 0-3.5l3.88-3.88a1 1 0 0 0-1.42-1.42l-3.88 3.89a4.48 4.48 0 0 0 6.33 6.33l3.89-3.88a1 1 0 1 0-1.42-1.42Zm8.58-12.08a4.49 4.49 0 0 0-6.33 0l-3.89 3.88a1 1 0 0 0 1.42 1.42l3.88-3.88a2.52 2.52 0 0 1 3.5 0 2.47 2.47 0 0 1 0 3.5l-3.88 3.88a1 1 0 1 0 1.42 1.42l3.88-3.89a4.49 4.49 0 0 0 0-6.33ZM8.83 15.17a1 1 0 0 0 1.1.22 1 1 0 0 0 .32-.22l4.92-4.92a1 1 0 0 0-1.42-1.42l-4.92 4.92a1 1 0 0 0 0 1.42Z',
		})
	)
);

const ANCHOR_LABEL_PLACEHOLDER = '__ANCHOR_LABEL_PLACEHOLDER__';
/**
 * Configuration for the `rehype-autolink-headings` plugin.
 * This set-up was informed by https://amberwilson.co.uk/blog/are-your-anchor-links-accessible/
 */
const makeAutolinkConfig = (): AutolinkOptions => {
	return {
		properties: { class: 'anchor-link' },
		behavior: 'after',
		group: ({ tagName }) => h('div', { tabIndex: -1, class: `heading-wrapper level-${tagName}` }),
		content: (heading) => [
			AnchorLinkIcon,
			h(
				'span',
				{ 'is:raw': true, class: 'sr-only' },
				`${ANCHOR_LABEL_PLACEHOLDER} ${toString(heading)}`
			),
		],
	};
};

/**
 * Rehype plugin to translate the headings' anchors according to the currently selected language.
 */
function rehypePostProcessAutolinkHeadings(
	useTranslationsForLang: HookParameters<'config:setup'>['useTranslations'],
	absolutePathToLang: HookParameters<'config:setup'>['absolutePathToLang']
) {
	const transformer: Transformer<Root> = (tree, file) => {
		const pageLang = absolutePathToLang(file.path);

		// Find anchor links
		visit(tree, 'element', (node) => {
			// console.log('Transforming', { lang: pageLang, path: file.path });
			if (node.tagName === 'a' && node.properties?.class === 'anchor-link') {
				// Find a11y text labels
				visit(node, 'text', (text) => {
					const title = text.value.replace(ANCHOR_LABEL_PLACEHOLDER, '').trim();
					const t = useTranslationsForLang(pageLang);
					text.value = t('heading.anchorLabel', { title });
				});
			}
		});
	};

	return function attacher() {
		return transformer;
	};
}

// <div tabindex="-1" class="heading-wrapper level-h2">
// 	<h2 id="prerequisites">Prerequisites</h2>
// 	<a class="anchor-link" href="#prerequisites">
// 		<span aria-hidden="true" class="anchor-icon">
// 			<svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentcolor" d="m12.11 15.39-3.88 3.88a2.52 2.52 0 0 1-3.5 0 2.47 2.47 0 0 1 0-3.5l3.88-3.88a1 1 0 0 0-1.42-1.42l-3.88 3.89a4.48 4.48 0 0 0 6.33 6.33l3.89-3.88a1 1 0 1 0-1.42-1.42Zm8.58-12.08a4.49 4.49 0 0 0-6.33 0l-3.89 3.88a1 1 0 0 0 1.42 1.42l3.88-3.88a2.52 2.52 0 0 1 3.5 0 2.47 2.47 0 0 1 0 3.5l-3.88 3.88a1 1 0 1 0 1.42 1.42l3.88-3.89a4.49 4.49 0 0 0 0-6.33ZM8.83 15.17a1 1 0 0 0 1.1.22 1 1 0 0 0 .32-.22l4.92-4.92a1 1 0 0 0-1.42-1.42l-4.92 4.92a1 1 0 0 0 0 1.42Z"></path></svg>
// 		</span>
// 		<span is:raw="" class="sr-only">Section titled Prerequisites</span>
// 	</a>
// </div>

export const starlightPluginAutolinkHeadings = () =>
	({
		name: 'starlight-plugin-autolink-headings',
		hooks: {
			setup({ addIntegration, useTranslations, absolutePathToLang }) {
				/** Integration to add the required rehype plugins. */
				addIntegration({
					name: 'astro-integration-autolink-headings',
					hooks: {
						'astro:config:setup'({ updateConfig }) {
							updateConfig({
								markdown: {
									rehypePlugins: [
										rehypeSlug,
										[rehypeAutolinkHeadings, makeAutolinkConfig()],
										rehypePostProcessAutolinkHeadings(useTranslations, absolutePathToLang),
									],
								},
							});
						},
					},
				});
			},
		},
	}) satisfies StarlightPlugin;
