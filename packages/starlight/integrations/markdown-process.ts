import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroConfig } from 'astro';
import { resolveCollectionPath } from '../utils/collection-fs';
import type { HookParameters, StarlightConfig } from '../types';

/**
 * Options shared by the plugin factories of both Markdown processors Starlight supports (the unified
 * `remark`/`rehype` pipeline and Sätteri).
 */
export interface MarkdownProcessorPluginOptions {
	starlightConfig: Pick<StarlightConfig, 'defaultLocale' | 'locales' | 'markdown'>;
	astroConfig: Pick<AstroConfig, 'root' | 'srcDir'>;
	useTranslations: HookParameters<'config:setup'>['useTranslations'];
	absolutePathToLang: HookParameters<'config:setup'>['absolutePathToLang'];
}

/**
 * Returns the paths to the Starlight docs collection and any additional paths defined in the
 * `starlightConfig.markdown.processedDirs` option that can be used with the {@link shouldTransformPath}
 * utility to determine if a file should be transformed by a plugin or not.
 */
export function getMarkdownProcessorPaths(options: MarkdownProcessorPluginOptions): string[] {
	const paths = [normalizePath(resolveCollectionPath('docs', options.astroConfig.srcDir))];

	for (const processedDir of options.starlightConfig.markdown.processedDirs) {
		paths.push(normalizePath(resolve(fileURLToPath(options.astroConfig.root), processedDir)));
	}

	return paths;
}

/**
 * Determines if a file should be transformed by a Markdown plugin, e.g. files without a known path
 * or files that are not part of the allowed paths are skipped.
 */
export function shouldTransformPath(path: string | undefined, allowedPaths: string[]) {
	if (!path) return false;
	const normalizedPath = normalizePath(path);
	return allowedPaths.some((p) => normalizedPath.startsWith(p));
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
