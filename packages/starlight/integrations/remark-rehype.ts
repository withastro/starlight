import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroConfig } from 'astro';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import type { Root as RehypeRoot } from 'hast';
import type { Root as RemarkRoot } from 'mdast';
import remarkDirective from 'remark-directive';
import type { Plugin } from 'unified';
import type { VFile } from 'vfile';
import { resolveCollectionPath } from '../utils/collection-fs';
import type { HookParameters, StarlightConfig } from '../types';
import { remarkAsides } from './asides';
import { rehypeRtlCodeSupport } from './code-rtl-support';
import rehypeAutolinkHeadings from './heading-links';

/** List of remark plugins to apply. */
export function starlightRemarkPlugins(options: RemarkRehypePluginOptions): RemarkPlugin[] {
	return [remarkDirective, remarkPlugins(options)];
}

/** List of rehype plugins to apply. */
export function starlightRehypePlugins(options: RemarkRehypePluginOptions): RehypePlugin[] {
	return [
		...(options.starlightConfig.markdown.headingLinks
			? [
					[
						rehypeHeadingIds,
						{ experimentalHeadingIdCompat: options.astroConfig.experimental?.headingIdCompat },
					],
				]
			: []),
		rehypePlugins(options),
	] as RehypePlugin[];
}

/** Remark plugin applying other Starlight remark plugins if necessary. */
function remarkPlugins(options: RemarkRehypePluginOptions): RemarkPlugin {
	const remarkRehypePaths = getRemarkRehypePaths(options);

	return function attacher(this) {
		const remarkAsidesTransformer = remarkAsides(options).call(this)!;

		return async function transformer(...args) {
			const [, file] = args;

			if (!shouldTransformFile(file, remarkRehypePaths)) return;

			await remarkAsidesTransformer(...args);
		};
	};
}

/** Rehype plugin applying other Starlight rehype plugins if necessary. */
function rehypePlugins(options: RemarkRehypePluginOptions): RehypePlugin {
	const remarkRehypePaths = getRemarkRehypePaths(options);

	return function attacher(this) {
		const rehypeRtlCodeSupportTransformer = rehypeRtlCodeSupport(options).call(this);
		const rehypeAutolinkHeadingsTransformer = rehypeAutolinkHeadings(options).call(this);

		return async function transformer(...args) {
			const [, file] = args;

			if (!shouldTransformFile(file, remarkRehypePaths)) return;

			await rehypeRtlCodeSupportTransformer(...args);

			if (options.starlightConfig.markdown.headingLinks) {
				await rehypeAutolinkHeadingsTransformer(...args);
			}
		};
	};
}

/**
 * Returns the paths to the Starlight docs collection and any additional paths defined in the
 * `starlightConfig.markdown.processedDirs` option that can be used with the
 * `shouldTransformFile()` utility to determine if a file should be transformed by a plugin or not.
 */
function getRemarkRehypePaths(options: RemarkRehypePluginOptions): string[] {
	const paths = [normalizePath(resolveCollectionPath('docs', options.astroConfig.srcDir))];

	for (const processedDir of options.starlightConfig.markdown.processedDirs) {
		paths.push(normalizePath(resolve(fileURLToPath(options.astroConfig.root), processedDir)));
	}

	return paths;
}

/**
 * Determines if a file should be transformed by a remark/rehype plugin, e.g. files without a known
 * path or files that are not part of the allowed remark/rehype paths are skipped.
 */
function shouldTransformFile(file: VFile, remarkRehypePaths: string[]) {
	// If the content is rendered using the content loader `renderMarkdown()` API, a file path
	// is not provided.
	// In that case, we skip the file.
	if (!file?.path) return false;

	const normalizedPath = normalizePath(file.path);

	// If the document is not part of the allowed remark/rehype paths, skip it.
	return remarkRehypePaths.some((path) => normalizedPath.startsWith(path));
}

/**
 * File path separators seems to be inconsistent on Windows between remark/rehype plugins used on
 * Markdown vs MDX files.
 * For the time being, we normalize all paths to unix style paths.
 */
const backSlashRegex = /\\/g;
function normalizePath(path: string) {
	return path.replace(backSlashRegex, '/');
}

export interface RemarkRehypePluginOptions {
	starlightConfig: Pick<StarlightConfig, 'defaultLocale' | 'locales' | 'markdown'>;
	astroConfig: Pick<AstroConfig, 'root' | 'srcDir'> & {
		experimental: Pick<AstroConfig['experimental'], 'headingIdCompat'>;
	};
	useTranslations: HookParameters<'config:setup'>['useTranslations'];
	absolutePathToLang: HookParameters<'config:setup'>['absolutePathToLang'];
}

type RemarkPlugin = Plugin<[], RemarkRoot>;
type RehypePlugin = Plugin<[], RehypeRoot>;
