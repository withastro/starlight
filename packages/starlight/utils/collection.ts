import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const collectionNames = ['docs', 'i18n'] as const;
export type StarlightCollection = (typeof collectionNames)[number];

/**
 * We still rely on the content collection folder structure to be fixed for now:
 *
 * - At build time, if the feature is enabled, we get all the last commit dates for each file in
 *   the docs folder ahead of time. In the current approach, we cannot know at this time the
 *   user-defined content folder path in the integration context as this would only be available
 *   from the loader. A potential solution could be to do that from a custom loader re-implementing
 *   the glob loader or built on top of it. Although, we don't have access to the Starlight
 *   configuration from the loader to even know we should do that.
 * - Remark plugins get passed down an absolute path to a content file and we need to figure out
 *   the language from that path. Without knowing the content folder path, we cannot reliably do
 *   so.
 *
 * Below are various functions to easily get paths to these collections and avoid having to
 * hardcode them throughout the codebase. When user-defined content folder locations are supported,
 * these helper functions should be updated to reflect that in one place.
 */

export function getCollectionPath(collection: StarlightCollection, srcDir: URL) {
	return new URL(`content/${collection}/`, srcDir).pathname;
}

export function resolveCollectionPath(collection: StarlightCollection, srcDir: URL) {
	return resolve(fileURLToPath(srcDir), `content/${collection}`);
}

export function getCollectionPathFromRoot(
	collection: StarlightCollection,
	{ root, srcDir }: { root: URL | string; srcDir: URL | string }
) {
	return (
		(typeof srcDir === 'string' ? srcDir : srcDir.pathname).replace(
			typeof root === 'string' ? root : root.pathname,
			''
		) +
		'content/' +
		collection
	);
}
