import type { AstroUserConfig } from 'astro';
import type { Root } from 'hast';
import { toString } from 'hast-util-to-string';
import { h } from 'hastscript';
import rehypeAutolinkHeadings, { type Options as AutolinkOptions } from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import type { Transformer } from 'unified';
import { visit } from 'unist-util-visit';
import type { HookParameters, StarlightConfig } from '../types';

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

/** Placeholder string to be replaced with a localized string when translations are available. */
const ANCHOR_LABEL_PLACEHOLDER = '__ANCHOR_LABEL_PLACEHOLDER__';

/**
 * Configuration for the `rehype-autolink-headings` plugin.
 * This set-up was informed by https://amberwilson.co.uk/blog/are-your-anchor-links-accessible/
 */
const autolinkConfig: AutolinkOptions = {
	properties: { class: 'sl-anchor-link' },
	behavior: 'after',
	group: ({ tagName }) => h('div', { tabIndex: -1, class: `sl-heading-wrapper level-${tagName}` }),
	content: (heading) => [
		AnchorLinkIcon,
		h('span', { class: 'sr-only' }, `${ANCHOR_LABEL_PLACEHOLDER} ${toString(heading)}`),
	],
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
			if (node.tagName === 'a' && node.properties?.class === 'sl-anchor-link') {
				// Find a11y text labels
				visit(node, 'text', (text) => {
					const title = text.value.replace(ANCHOR_LABEL_PLACEHOLDER, '').trim();
					const t = useTranslationsForLang(pageLang);
					text.value = t('heading.anchorLabel', { title, interpolation: { escapeValue: false } });
				});
			}
		});
	};

	return function attacher() {
		return transformer;
	};
}

interface AutolinkHeadingsOptions {
	starlightConfig: Pick<StarlightConfig, 'markdown'>;
	useTranslations: HookParameters<'config:setup'>['useTranslations'];
	absolutePathToLang: HookParameters<'config:setup'>['absolutePathToLang'];
}
type RehypePlugins = NonNullable<NonNullable<AstroUserConfig['markdown']>['rehypePlugins']>;

export const starlightAutolinkHeadings = ({
	starlightConfig,
	useTranslations,
	absolutePathToLang,
}: AutolinkHeadingsOptions): RehypePlugins =>
	starlightConfig.markdown.headingLinks
		? [
				rehypeSlug,
				[rehypeAutolinkHeadings, autolinkConfig],
				rehypePostProcessAutolinkHeadings(useTranslations, absolutePathToLang),
			]
		: [];
