import { describe, expect, test } from 'vitest';
import { formatPathFromConfig } from '../../utils/navigation';

describe('formatPathFromConfig', () => {

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
			expect(formatPathFromConfig(path)).toBe(expected);
		});
	});
});

