import { describe, expect, test } from 'vitest';
import { formatPath } from '../../utils/format-path';

describe.each([
	{
		options: { format: 'file' as const, trailingSlash: 'ignore' as const },
		tests: [
			// index page
			{ path: '/', expected: '/index.html' },
			// with trailing slash
			{ path: '/reference/configuration/', expected: '/reference/configuration.html' },
			// without trailing slash
			{ path: '/api/v1/users', expected: '/api/v1/users.html' },
			// with file extension
			{ path: '/guides/components.html', expected: '/guides/components.html' },
			// with file extension and trailing slash
			{ path: '/guides/components.html/', expected: '/guides/components.html' },
		],
	},
	{
		options: { format: 'file' as const, trailingSlash: 'always' as const },
		tests: [
			// index page
			{ path: '/', expected: '/index.html' },
			// with trailing slash
			{ path: '/reference/configuration/', expected: '/reference/configuration.html' },
			// without trailing slash
			{ path: '/api/v1/users', expected: '/api/v1/users.html' },
			// with file extension
			{ path: '/guides/components.html', expected: '/guides/components.html' },
			// with file extension and trailing slash
			{ path: '/guides/components.html/', expected: '/guides/components.html' },
		],
	},
	{
		options: { format: 'file' as const, trailingSlash: 'never' as const },
		tests: [
			// index page
			{ path: '/', expected: '/index.html' },
			// with trailing slash
			{ path: '/reference/configuration/', expected: '/reference/configuration.html' },
			// without trailing slash
			{ path: '/api/v1/users', expected: '/api/v1/users.html' },
			// with file extension
			{ path: '/guides/components.html', expected: '/guides/components.html' },
			// with file extension and trailing slash
			{ path: '/guides/components.html/', expected: '/guides/components.html' },
		],
	},
	{
		options: { format: 'directory' as const, trailingSlash: 'always' as const },
		tests: [
			// index page
			{ path: '/', expected: '/' },
			// with trailing slash
			{ path: '/reference/configuration/', expected: '/reference/configuration/' },
			// without trailing slash
			{ path: '/api/v1/users', expected: '/api/v1/users/' },
			// with file extension
			{ path: '/guides/components.html', expected: '/guides/components/' },
			// with file extension and trailing slash
			{ path: '/guides/components.html/', expected: '/guides/components/' },
		],
	},
	{
		options: { format: 'directory' as const, trailingSlash: 'never' as const },
		tests: [
			// index page
			{ path: '/', expected: '/' },
			// with trailing slash
			{ path: '/reference/configuration/', expected: '/reference/configuration' },
			// without trailing slash
			{ path: '/api/v1/users', expected: '/api/v1/users' },
			// with file extension
			{ path: '/guides/components.html', expected: '/guides/components' },
			// with file extension and trailing slash
			{ path: '/guides/components.html/', expected: '/guides/components' },
		],
	},
	{
		options: { format: 'directory' as const, trailingSlash: 'ignore' as const },
		tests: [
			// index page
			{ path: '/', expected: '/' },
			// with trailing slash
			{ path: '/reference/configuration/', expected: '/reference/configuration/' },
			// without trailing slash
			{ path: '/api/v1/users', expected: '/api/v1/users' },
			// with file extension
			{ path: '/guides/components.html', expected: '/guides/components' },
			// with file extension and trailing slash
			{ path: '/guides/components.html/', expected: '/guides/components' },
		],
	},
])(
	'formatPath() with { format: $options.format, trailingSlash: $options.trailingSlash }',
	({ options, tests }) => {
		test.each(tests)('returns $expected for $path', ({ path, expected }) => {
			expect(formatPath(path, options)).toBe(expected);
		});
	}
);
