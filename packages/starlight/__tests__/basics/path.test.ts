import { describe, expect, test } from 'vitest';
import { stripExtension } from '../../src/utils/path';

describe('stripExtension', () => {
	test.each([
		['guide/intro.md', 'guide/intro'],
		['v1.0/guide/intro.md', 'v1.0/guide/intro'],
		['index.mdx', 'index'],
		['archive.tar.gz', 'archive.tar'],
		['v1.0/guide', 'v1.0/guide'],
		['v1.0\\guide', 'v1.0\\guide'],
		['dir/.env', 'dir/.env'],
		['.env', '.env'],
		['guide/intro', 'guide/intro'],
	])('stripExtension(%j) => %j', (input, expected) => {
		expect(stripExtension(input)).toBe(expected);
	});
});
