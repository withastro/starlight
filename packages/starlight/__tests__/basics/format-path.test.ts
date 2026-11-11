import { describe, expect, test, vi } from 'vitest';
import { createPathFormatter } from '../../src/utils/createPathFormatter';

type FormatPathOptions = Parameters<typeof createPathFormatter>[0];
const formatPath = (href: string, opts: FormatPathOptions) => createPathFormatter(opts)(href);

/**
 * Tests for formatters using `format: file`. These should always produce the same expected output
 * regardless of the value of the `trailingSlash` option.
 */
const fileFormatTests = [
	// index page
	{ path: '/', expected: '/index.html' },
	// index page with base
	{ path: '/', base: '/base/', expected: '/base/index.html' },
	// with trailing slash
	{ path: '/reference/configuration/', expected: '/reference/configuration.html' },
	// without trailing slash
	{ path: '/api/v1/users', expected: '/api/v1/users.html' },
	// with file extension
	{ path: '/guides/project-structure.html', expected: '/guides/project-structure.html' },
	// with file extension and trailing slash
	{ path: '/guides/project-structure.html/', expected: '/guides/project-structure.html' },
	// with hash
	{ path: '/reference/configuration/#tabs', expected: '/reference/configuration.html#tabs' },
	// index page with hash
	{ path: '/#_top', expected: '/index.html#_top' },
	// index page with hash and base
	{ path: '/#_top', base: '/base/', expected: '/base/index.html#_top' },
	// with query string
	{ path: '/search?q=astro', expected: '/search.html?q=astro' },
	// with file extension and hash
	{ path: '/guides/faq.html#tabs', expected: '/guides/faq.html#tabs' },
];

describe.each<{
	options: FormatPathOptions;
	tests: Array<{ path: string; base?: string; expected: string }>;
}>([
	{ options: { format: 'file', trailingSlash: 'ignore' }, tests: fileFormatTests },
	{ options: { format: 'file', trailingSlash: 'always' }, tests: fileFormatTests },
	{ options: { format: 'file', trailingSlash: 'never' }, tests: fileFormatTests },
	{
		options: { format: 'directory', trailingSlash: 'always' },
		tests: [
			// index page
			{ path: '/', expected: '/' },
			// index page with base
			{ path: '/', base: '/base/', expected: '/base/' },
			// with trailing slash
			{ path: '/reference/configuration/', expected: '/reference/configuration/' },
			// without trailing slash
			{ path: '/api/v1/users', expected: '/api/v1/users/' },
			// with file extension
			{ path: '/guides/project-structure.html', expected: '/guides/project-structure/' },
			// with file extension and trailing slash
			{ path: '/guides/project-structure.html/', expected: '/guides/project-structure/' },
			// with hash
			{ path: '/reference/configuration/#tabs', expected: '/reference/configuration/#tabs' },
			// index page with hash
			{ path: '/#_top', expected: '/#_top' },
			// index page with hash and base
			{ path: '/#_top', base: '/base/', expected: '/base/#_top' },
			// with query string
			{ path: '/search?q=astro', expected: '/search/?q=astro' },
			// with file extension and hash
			{ path: '/guides/faq.html#tabs', expected: '/guides/faq/#tabs' },
		],
	},
	{
		options: { format: 'directory', trailingSlash: 'never' },
		tests: [
			// index page
			{ path: '/', expected: '/' },
			// index page with base
			{ path: '/', base: '/base/', expected: '/base' },
			// with trailing slash
			{ path: '/reference/configuration/', expected: '/reference/configuration' },
			// without trailing slash
			{ path: '/api/v1/users', expected: '/api/v1/users' },
			// with file extension
			{ path: '/guides/project-structure.html', expected: '/guides/project-structure' },
			// with file extension and trailing slash
			{ path: '/guides/project-structure.html/', expected: '/guides/project-structure' },
			// with hash
			{ path: '/reference/configuration/#tabs', expected: '/reference/configuration#tabs' },
			// index page with hash
			{ path: '/#_top', expected: '/#_top' },
			// index page with hash and base
			{ path: '/#_top', base: '/base/', expected: '/base#_top' },
			// with query string
			{ path: '/search?q=astro', expected: '/search?q=astro' },
			// with file extension and hash
			{ path: '/guides/faq.html#tabs', expected: '/guides/faq#tabs' },
		],
	},
	{
		options: { format: 'directory', trailingSlash: 'ignore' },
		tests: [
			// index page
			{ path: '/', expected: '/' },
			// index page with base
			{ path: '/', base: '/base/', expected: '/base/' },
			// with trailing slash
			{ path: '/reference/configuration/', expected: '/reference/configuration/' },
			// without trailing slash
			{ path: '/api/v1/users', expected: '/api/v1/users' },
			// with file extension
			{ path: '/guides/project-structure.html', expected: '/guides/project-structure' },
			// with file extension and trailing slash
			{ path: '/guides/project-structure.html/', expected: '/guides/project-structure' },
			// with hash
			{ path: '/reference/configuration/#tabs', expected: '/reference/configuration/#tabs' },
			// index page with hash
			{ path: '/#_top', expected: '/#_top' },
			// index page with hash and base
			{ path: '/#_top', base: '/base/', expected: '/base/#_top' },
			// with query string
			{ path: '/search?q=astro', expected: '/search?q=astro' },
			// with file extension and hash
			{ path: '/guides/faq.html#tabs', expected: '/guides/faq#tabs' },
		],
	},
])(
	'formatPath() with { format: $options.format, trailingSlash: $options.trailingSlash }',
	({ options, tests }) => {
		test.each(tests)('returns $expected for $path', async ({ path, base, expected }) => {
			// If the base is not set, test the path formatter and end the test.
			if (!base) {
				expect(formatPath(path, options)).toBe(expected);
				return;
			}

			// Otherwise, reset the modules registry so that re-importing `../../utils/createPathFormatter`
			// re-evaluates the module and re-computes the base. Re-importing the module is necessary
			// because top-level imports cannot be re-evaluated.
			vi.resetModules();
			// Set the base URL.
			vi.stubEnv('BASE_URL', base);
			// Re-import the module to re-create the path formatter.
			const { createPathFormatter } = await import('../../src/utils/createPathFormatter');
			const formatPathWithBase: typeof formatPath = (href, opts) => createPathFormatter(opts)(href);

			expect(formatPathWithBase(path, options)).toBe(expected);

			vi.unstubAllEnvs();
			vi.resetModules();
		});
	}
);
