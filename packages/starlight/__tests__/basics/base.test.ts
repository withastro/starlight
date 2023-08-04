import { describe, expect, test, vi } from 'vitest';
import { fileWithBase, pathWithBase } from '../../utils/base';

describe('fileWithBase()', () => {
	describe('with no base', () => {
		test('does not prepend anything', () => {
			expect(fileWithBase('/img.svg')).toBe('/img.svg');
		});
		test('adds leading slash if needed', () => {
			expect(fileWithBase('img.svg')).toBe('/img.svg');
		});
	});

	// TODO: Stubbing BASE_URL is not currently possible.
	// Astro controls BASE_URL via its `vite-plugin-env`, which prevents Vitest’s stubbing from
	// working and there’s also no way to pass in Astro config in Astro’s `getViteConfig` helper.
	describe.todo('with base', () => {
		test('prepends base', () => {
			vi.stubEnv('BASE_URL', '/base/');
			expect(fileWithBase('/img.svg')).toBe('/base/img.svg');
			vi.unstubAllEnvs();
		});
	});
});

describe('pathWithBase()', () => {
	describe('with no base', () => {
		test('does not prepend anything', () => {
			expect(pathWithBase('/path/')).toBe('/path/');
		});
		test('adds leading and trailing slashes if needed', () => {
			expect(pathWithBase('path')).toBe('/path/');
		});
	});

	describe.todo('with base');
});
