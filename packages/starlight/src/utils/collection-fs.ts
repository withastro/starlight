import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getCollectionUrl, type StarlightCollection } from './collection';

/**
 * @see {@link file://./collection.ts} for more context about this file.
 *
 * Below are various functions to easily get paths to collections used in Starlight that rely on
 * Node.js builtins. They exist in a separate file from {@link file://./collection.ts} to avoid
 * potentially importing Node.js builtins in the final bundle.
 */

export function resolveCollectionPath(collection: StarlightCollection, srcDir: URL) {
	return resolve(fileURLToPath(srcDir), `content/${collection}`);
}

export function getCollectionPosixPath(collection: StarlightCollection, srcDir: URL) {
	// Return POSIX path with leading slash even on Windows, e.g. `/C:/project/src/content/docs/`.
	return fileURLToPath(getCollectionUrl(collection, srcDir), { windows: false });
}
