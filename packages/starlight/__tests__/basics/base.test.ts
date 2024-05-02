import { describe, expect, test, vi } from 'vitest';
import { addBase } from '../../utils/base';

describe('addBase()', () => {
	describe('with no base', () => {
		test('does not prepend anything', () => {
			expect(addBase('/img.svg')).toBe('/img.svg');
		});
		test('adds leading slash if needed', () => {
			expect(addBase('img.svg')).toBe('/img.svg');
		});
	});

	// TODO: Stubbing BASE_URL is not currently possible.
	// Astro controls BASE_URL via its `vite-plugin-env`, which prevents Vitest’s stubbing from
	// working and there’s also no way to pass in Astro config in Astro’s `getViteConfig` helper.
	describe.todo('with base', () => {
		test('prepends base', () => {
			vi.stubEnv('BASE_URL', '/base/');
			expect(addBase('/img.svg')).toBe('/base/img.svg');
			vi.unstubAllEnvs();
		});
	});

	describe('with no base', () => {
		test('does not prepend anything', () => {
			expect(addBase('/path/')).toBe('/path/');
		});
		test('adds leading slash if needed', () => {
			expect(addBase('path')).toBe('/path');
		});
	});

	describe.todo('with base');
});
