import { describe, expect, test } from 'vitest';
import {
	getMarkdownProcessorPaths,
	shouldTransformPath,
} from '../../integrations/markdown-processor';
import { createPluginTestOptions } from '../test-utils';

const root = new URL('file:///path/to/project/');
const srcDir = new URL('./src/', root);

describe('getMarkdownProcessorPaths', () => {
	test('returns allowed directory paths with trailing slashes', async () => {
		const allowedPaths = await getAllowedPaths(['./src/content/comments']);

		expect(allowedPaths).toEqual([
			'/path/to/project/src/content/docs/',
			'/path/to/project/src/content/comments/',
		]);
	});
});

describe('shouldTransformPath', () => {
	const allowedPaths = [
		'/path/to/project/src/content/docs/',
		'/path/to/project/src/content/comments/',
	];

	test('transforms files in allowed paths', () => {
		expect(shouldTransformPath('/path/to/project/src/content/docs/index.md', allowedPaths)).toBe(
			true
		);
		expect(
			shouldTransformPath('/path/to/project/src/content/comments/index.md', allowedPaths)
		).toBe(true);
	});

	test('does not transform sibling paths sharing the same prefix of allowed paths', () => {
		expect(
			shouldTransformPath('/path/to/project/src/content/docs-test/index.md', allowedPaths)
		).toBe(false);
		expect(
			shouldTransformPath('/path/to/project/src/content/comments-test/index.md', allowedPaths)
		).toBe(false);
	});
});

async function getAllowedPaths(processedDirs: string[] = []) {
	const options = await createPluginTestOptions({ title: 'Test', markdown: { processedDirs } });

	return getMarkdownProcessorPaths({ ...options, astroConfig: { root, srcDir } });
}
