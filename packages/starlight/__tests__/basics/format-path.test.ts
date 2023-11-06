import { describe, expect, test } from 'vitest';
import { formatPath } from '../../utils/format-path';

describe('formatPath() - { format: "file" - trailingSlash: "ignore" }', () => {
	const opts = {
		format: 'file',
		trailingSlash: 'ignore',
	} as const;

	const testCases = [
		{
			// index page
			path: '/',
			expected: '/index.html',
		},
		{
			// with trailing slash
			path: '/reference/configuration/',
			expected: '/reference/configuration.html',
		},
		{
			// without trailing slash
			path: '/api/v1/users',
			expected: '/api/v1/users.html',
		},
		{
			// with file extension
			path: '/guides/components.html',
			expected: '/guides/components.html',
		},
		{
			// with file extension and trailing slash
			path: '/guides/components.html/',
			expected: '/guides/components.html',
		},
	];

	testCases.forEach(({ path, expected }) => {
		test(`returns ${expected} for ${path}`, () => {
			expect(formatPath(path, opts)).toBe(expected);
		});
	});
});

describe('formatPath() - { format: "file" , trailingSlash: "always" }', () => {
	const opts = {
		format: 'file',
		trailingSlash: 'always',
	} as const;

	const testCases = [
		{
			// index page
			path: '/',
			expected: '/index.html/',
		},
		{
			// with trailing slash
			path: '/reference/configuration/',
			expected: '/reference/configuration.html/',
		},
		{
			// without trailing slash
			path: '/api/v1/users',
			expected: '/api/v1/users.html/',
		},
		{
			// with file extension
			path: '/guides/components.html',
			expected: '/guides/components.html/',
		},
		{
			// with file extension and trailing slash
			path: '/guides/components.html/',
			expected: '/guides/components.html/',
		},
	];

	testCases.forEach(({ path, expected }) => {
		test(`returns ${expected} for ${path}`, () => {
			expect(formatPath(path, opts)).toBe(expected);
		});
	});
});

describe('formatPath() - { format: "file" , trailingSlash: "never" }', () => {
	const opts = {
		format: 'file',
		trailingSlash: 'never',
	} as const;

	const testCases = [
		{
			// index page
			path: '/',
			expected: '/index.html',
		},
		{
			// with trailing slash
			path: '/reference/configuration/',
			expected: '/reference/configuration.html',
		},
		{
			// without trailing slash
			path: '/api/v1/users',
			expected: '/api/v1/users.html',
		},
		{
			// with file extension
			path: '/guides/components.html',
			expected: '/guides/components.html',
		},
		{
			// with file extension and trailing slash
			path: '/guides/components.html/',
			expected: '/guides/components.html',
		},
	];

	testCases.forEach(({ path, expected }) => {
		test(`returns ${expected} for ${path}`, () => {
			expect(formatPath(path, opts)).toBe(expected);
		});
	});
});

describe('formatPath() - { format: "directory" , trailingSlash: "always" }', () => {
	const opts = {
		format: 'directory',
		trailingSlash: 'always',
	} as const;

	const testCases = [
		{
			// index page
			path: '/',
			expected: '/',
		},
		{
			// with trailing slash
			path: '/reference/configuration/',
			expected: '/reference/configuration/',
		},
		{
			// without trailing slash
			path: '/api/v1/users',
			expected: '/api/v1/users/',
		},
		{
			// with file extension
			path: '/guides/components.html',
			expected: '/guides/components/',
		},
		{
			// with file extension and trailing slash
			path: '/guides/components.html/',
			expected: '/guides/components/',
		},
	];

	testCases.forEach(({ path, expected }) => {
		test(`returns ${expected} for ${path}`, () => {
			expect(formatPath(path, opts)).toBe(expected);
		});
	});
});

describe('formatPath() - { format: "directory" , trailingSlash: "never" }', () => {
	const opts = {
		format: 'directory',
		trailingSlash: 'never',
	} as const;

	const testCases = [
		{
			// index page
			path: '/',
			expected: '/',
		},
		{
			// with trailing slash
			path: '/reference/configuration/',
			expected: '/reference/configuration',
		},
		{
			// without trailing slash
			path: '/api/v1/users',
			expected: '/api/v1/users',
		},
		{
			// with file extension
			path: '/guides/components.html',
			expected: '/guides/components',
		},
		{
			// with file extension and trailing slash
			path: '/guides/components.html/',
			expected: '/guides/components',
		},
	];

	testCases.forEach(({ path, expected }) => {
		test(`returns ${expected} for ${path}`, () => {
			expect(formatPath(path, opts)).toBe(expected);
		});
	});
});

describe('formatPath() - { format: "directory" , trailingSlash: "ignore" }', () => {
	const opts = {
		format: 'directory',
		trailingSlash: 'ignore',
	} as const;

	const testCases = [
		{
			// index page
			path: '/',
			expected: '/',
		},
		{
			// with trailing slash
			path: '/reference/configuration/',
			expected: '/reference/configuration/',
		},
		{
			// without trailing slash
			path: '/api/v1/users',
			expected: '/api/v1/users/',
		},
		{
			// with file extension
			path: '/guides/components.html',
			expected: '/guides/components/',
		},
		{
			// with file extension and trailing slash
			path: '/guides/components.html/',
			expected: '/guides/components/',
		},
	];

	testCases.forEach(({ path, expected }) => {
		test(`returns ${expected} for ${path}`, () => {
			expect(formatPath(path, opts)).toBe(expected);
		});
	});
});
