import { describe, expect, test } from 'vitest';
import { formatCanonical, type FormatCanonicalOptions } from '../../utils/canonical';

describe.each<{
	options: FormatCanonicalOptions;
	tests: Array<{ href: string; expected: string }>;
}>([
	{
		options: { format: 'file', trailingSlash: 'ignore' },
		tests: [
			{ href: 'https://example.com/index.html', expected: 'https://example.com/index.html' },
			{
				href: 'https://example.com/reference/configuration.html',
				expected: 'https://example.com/reference/configuration.html',
			},
		],
	},
	{
		options: { format: 'file', trailingSlash: 'always' },
		tests: [
			{ href: 'https://example.com/index.html', expected: 'https://example.com/index.html' },
			{
				href: 'https://example.com/reference/configuration.html',
				expected: 'https://example.com/reference/configuration.html',
			},
		],
	},
	{
		options: { format: 'file', trailingSlash: 'never' },
		tests: [
			{ href: 'https://example.com/index.html', expected: 'https://example.com/index.html' },
			{
				href: 'https://example.com/reference/configuration.html',
				expected: 'https://example.com/reference/configuration.html',
			},
		],
	},
	{
		options: { format: 'directory', trailingSlash: 'always' },
		tests: [
			{ href: 'https://example.com/', expected: 'https://example.com/' },
			{
				href: 'https://example.com/reference/configuration/',
				expected: 'https://example.com/reference/configuration/',
			},
		],
	},
	{
		options: { format: 'directory', trailingSlash: 'never' },
		tests: [
			{ href: 'https://example.com/', expected: 'https://example.com' },
			{
				href: 'https://example.com/reference/configuration/',
				expected: 'https://example.com/reference/configuration',
			},
		],
	},
	{
		options: { format: 'directory', trailingSlash: 'ignore' },
		tests: [
			{ href: 'https://example.com/', expected: 'https://example.com/' },
			{
				href: 'https://example.com/reference/configuration/',
				expected: 'https://example.com/reference/configuration/',
			},
		],
	},
])(
	'formatCanonical() with { format: $options.format, trailingSlash: $options.trailingSlash }',
	({ options, tests }) => {
		test.each(tests)('returns $expected for $href', async ({ href, expected }) => {
			expect(formatCanonical(href, options)).toBe(expected);
		});
	}
);
