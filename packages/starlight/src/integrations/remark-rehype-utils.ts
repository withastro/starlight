import type { AstroConfig } from 'astro';
import type { VFile } from 'vfile';
import { resolveCollectionPath } from '../utils/collection-fs';

/**
 * Returns the path to the Starlight docs collection ready to be used in remark/rehype plugins,
 * e.g. with the `shouldTransformFile()` utility to determine if a file should be transformed
 * by a plugin or not.
 */
export function getRemarkRehypeDocsCollectionPath(srcDir: AstroConfig['srcDir']) {
	return normalizePath(resolveCollectionPath('docs', srcDir));
}

/**
 * Determines if a file should be transformed by a remark/rehype plugin, e.g. files without a known
 * path or files that are not part of the Starlight docs collection should be skipped.
 */
export function shouldTransformFile(file: VFile, docsCollectionPath: string) {
	// If the content is rendered using the content loader `renderMarkdown()` API, a file path
	// is not provided.
	// In that case, we skip the file.
	if (!file?.path) return false;

	// If the document is not part of the Starlight docs collection, skip it.
	if (!normalizePath(file.path).startsWith(docsCollectionPath)) return false;

	return true;
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
