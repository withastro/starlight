import type { AstroConfig } from 'astro';
import type { Root } from 'hast';
import { CONTINUE, SKIP, visit } from 'unist-util-visit';
import type { VFile } from 'vfile';
import { getRemarkRehypeDocsCollectionPath, shouldTransformFile } from './remark-rehype-utils';

interface RtlCodeSupportOptions {
	astroConfig: Pick<AstroConfig, 'srcDir'>;
}

/**
 * rehype plugin that adds `dir` attributes to `<code>` and `<pre>`
 * elements that don’t already have them.
 *
 * `<code>` will become `<code dir="auto">`
 * `<pre>` will become `<pre dir="ltr">`
 *
 * `<code>` _inside_ `<pre>` is skipped, so respects the `ltr` on its parent.
 *
 * Reasoning:
 * - `<pre>` is usually a code block and code should be LTR even in an RTL document
 * - `<code>` is often LTR, but could also be RTL. `dir="auto"` ensures the bidirectional
 *   algorithm treats the contents of `<code>` in isolation and gives its best guess.
 */
export function rehypeRtlCodeSupport({ astroConfig }: RtlCodeSupportOptions) {
	const docsCollectionPath = getRemarkRehypeDocsCollectionPath(astroConfig.srcDir);

	return () => (root: Root, file: VFile) => {
		if (!shouldTransformFile(file, docsCollectionPath)) return;

		visit(root, 'element', (el) => {
			if (el.tagName === 'pre' || el.tagName === 'code') {
				el.properties ||= {};
				if (!('dir' in el.properties)) {
					el.properties.dir = { pre: 'ltr', code: 'auto' }[el.tagName];
				}
				return SKIP;
			}
			return CONTINUE;
		});
	};
}
