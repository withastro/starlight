import { isUnifiedProcessor, rehypeHeadingIds } from '@astrojs/markdown-remark';
import type { Root as RehypeRoot } from 'hast';
import type { Root as RemarkRoot } from 'mdast';
import remarkDirective from 'remark-directive';
import type { Plugin } from 'unified';
import type { VFile } from 'vfile';
import { remarkAsides, remarkDirectivesRestoration } from './remark-asides';
import { rehypeRtlCodeSupport } from './rehype-code-rtl-support';
import rehypeAutolinkHeadings from './rehype-heading-links';
import {
	getMarkdownProcessorPaths,
	shouldTransformPath,
	type MarkdownProcessorPluginOptions,
} from './markdown-processor';

// Re-exported so callers can narrow `markdown.processor` to the Unified processor and use the
// remark directive-restoration plugin through the same lazy import that loads the optional
// `@astrojs/markdown-remark` peer dependency.
export { isUnifiedProcessor, remarkDirectivesRestoration };

/** List of remark plugins to apply. */
export function starlightRemarkPlugins(options: MarkdownProcessorPluginOptions): RemarkPlugin[] {
	return [remarkDirective, remarkPlugins(options)];
}

/** List of rehype plugins to apply. */
export function starlightRehypePlugins(options: MarkdownProcessorPluginOptions): RehypePlugin[] {
	return [
		...(options.starlightConfig.markdown.headingLinks ? [[rehypeHeadingIds]] : []),
		rehypePlugins(options),
	] as RehypePlugin[];
}

/** Remark plugin applying other Starlight remark plugins if necessary. */
function remarkPlugins(options: MarkdownProcessorPluginOptions): RemarkPlugin {
	const allowedPaths = getMarkdownProcessorPaths(options);

	return function attacher(this) {
		const remarkAsidesTransformer = remarkAsides(options).call(this)!;

		return async function transformer(...args) {
			const [, file] = args;

			if (!shouldTransformFile(file, allowedPaths)) return;

			await remarkAsidesTransformer(...args);
		};
	};
}

/** Rehype plugin applying other Starlight rehype plugins if necessary. */
function rehypePlugins(options: MarkdownProcessorPluginOptions): RehypePlugin {
	const allowedPaths = getMarkdownProcessorPaths(options);

	return function attacher(this) {
		const rehypeRtlCodeSupportTransformer = rehypeRtlCodeSupport(options).call(this);
		const rehypeAutolinkHeadingsTransformer = rehypeAutolinkHeadings(options).call(this);

		return async function transformer(...args) {
			const [, file] = args;

			if (!shouldTransformFile(file, allowedPaths)) return;

			await rehypeRtlCodeSupportTransformer(...args);

			if (options.starlightConfig.markdown.headingLinks) {
				await rehypeAutolinkHeadingsTransformer(...args);
			}
		};
	};
}

/**
 * Determines if a file should be transformed by a remark/rehype plugin, e.g. files without a known
 * path or files that are not part of the allowed paths are skipped.
 */
function shouldTransformFile(file: VFile, allowedPaths: string[]) {
	// If the content is rendered using the content loader `renderMarkdown()` API, a file path
	// is not provided.
	// In that case, we skip the file.
	if (!file?.path) return false;

	return shouldTransformPath(file.path, allowedPaths);
}

type RemarkPlugin = Plugin<[], RemarkRoot>;
type RehypePlugin = Plugin<[], RehypeRoot>;
