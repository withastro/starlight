import { describe, expect, test } from 'vitest';
import { localizedUrl } from '../../src/utils/localizedUrl';

describe('with `build.output: "directory"`', () => {
	test('it has no effect if locale matches', () => {
		const url = new URL('https://example.com/en/guide/');
		expect(localizedUrl(url, 'en', 'ignore').href).toBe(url.href);
	});

	test('it has no effect if locale matches for index', () => {
		const url = new URL('https://example.com/en/');
		expect(localizedUrl(url, 'en', 'ignore').href).toBe(url.href);
	});

	test('it changes locale to requested locale', () => {
		const url = new URL('https://example.com/en/guide/');
		expect(localizedUrl(url, 'ar', 'ignore').href).toBe('https://example.com/ar/guide/');
	});

	test('it changes locale to requested locale for index', () => {
		const url = new URL('https://example.com/en/');
		expect(localizedUrl(url, 'ar', 'ignore').href).toBe('https://example.com/ar/');
	});

	test('it can change to root locale', () => {
		const url = new URL('https://example.com/en/guide/');
		expect(localizedUrl(url, undefined, 'ignore').href).toBe('https://example.com/guide/');
	});

	test('it can change from root locale', () => {
		const url = new URL('https://example.com/guide/');
		expect(localizedUrl(url, 'en', 'ignore').href).toBe('https://example.com/en/guide/');
	});

	test('it preserves a constructor directory when changing from root locale', () => {
		const url = new URL('https://example.com/constructor/overview/');
		expect(localizedUrl(url, 'en', 'ignore').href).toBe(
			'https://example.com/en/constructor/overview/'
		);
	});

	test('it preserves a toString directory when changing from root locale', () => {
		const url = new URL('https://example.com/toString/overview/');
		expect(localizedUrl(url, 'ar', 'ignore').href).toBe(
			'https://example.com/ar/toString/overview/'
		);
	});

	test('it preserves a constructor directory when changing to root locale', () => {
		const url = new URL('https://example.com/en/constructor/overview/');
		expect(localizedUrl(url, undefined, 'ignore').href).toBe(
			'https://example.com/constructor/overview/'
		);
	});

	test('it preserves a toString directory when changing to root locale', () => {
		const url = new URL('https://example.com/ar/toString/overview/');
		expect(localizedUrl(url, 'root', 'ignore').href).toBe('https://example.com/toString/overview/');
	});

	test('it preserves prototype-named directories when staying in root locale', () => {
		const constructorUrl = new URL('https://example.com/constructor/overview/');
		const toStringUrl = new URL('https://example.com/toString/overview/');
		expect(localizedUrl(constructorUrl, undefined, 'ignore').href).toBe(constructorUrl.href);
		expect(localizedUrl(toStringUrl, 'root', 'ignore').href).toBe(toStringUrl.href);
	});
});

describe('with `trailingSlash: "never"`', () => {
	test('it has no effect if locale matches', () => {
		const url = new URL('https://example.com/en/guide');
		expect(localizedUrl(url, 'en', 'never').href).toBe(url.href);
	});

	test('it has no effect if locale matches for index', () => {
		const url = new URL('https://example.com/en');
		expect(localizedUrl(url, 'en', 'never').href).toBe(url.href);
	});

	test('it changes locale to requested locale', () => {
		const url = new URL('https://example.com/en/guide');
		expect(localizedUrl(url, 'ar', 'never').href).toBe('https://example.com/ar/guide');
	});

	test('it changes locale to requested locale for index', () => {
		const url = new URL('https://example.com/en');
		expect(localizedUrl(url, 'ar', 'never').href).toBe('https://example.com/ar');
	});

	test('it can change to root locale', () => {
		const url = new URL('https://example.com/en/guide');
		expect(localizedUrl(url, undefined, 'ignore').href).toBe('https://example.com/guide');
	});

	test('it can change from root locale', () => {
		const url = new URL('https://example.com/guide');
		expect(localizedUrl(url, 'en', 'ignore').href).toBe('https://example.com/en/guide');
	});

	test('it can change from root index', () => {
		const url = new URL('https://example.com');
		expect(localizedUrl(url, 'en', 'never').href).toBe('https://example.com/en');
	});
});

describe('with `build.output: "file"`', () => {
	test('it has no effect if locale matches', () => {
		const url = new URL('https://example.com/en/guide.html');
		expect(localizedUrl(url, 'en', 'ignore').href).toBe(url.href);
	});

	test('it has no effect if locale matches for index', () => {
		const url = new URL('https://example.com/en.html');
		expect(localizedUrl(url, 'en', 'ignore').href).toBe(url.href);
	});

	test('it changes locale to requested locale', () => {
		const url = new URL('https://example.com/en/guide.html');
		expect(localizedUrl(url, 'ar', 'ignore').href).toBe('https://example.com/ar/guide.html');
	});

	test('it changes locale to requested locale for index', () => {
		const url = new URL('https://example.com/en.html');
		expect(localizedUrl(url, 'ar', 'ignore').href).toBe('https://example.com/ar.html');
	});

	test('it can change to root locale', () => {
		const url = new URL('https://example.com/en/guide.html');
		expect(localizedUrl(url, undefined, 'ignore').href).toBe('https://example.com/guide.html');
	});

	test('it can change to root locale from index', () => {
		const url = new URL('https://example.com/en.html');
		expect(localizedUrl(url, undefined, 'ignore').href).toBe('https://example.com/index.html');
	});

	test('it can change from root locale', () => {
		const url = new URL('https://example.com/guide.html');
		expect(localizedUrl(url, 'en', 'ignore').href).toBe('https://example.com/en/guide.html');
	});

	test('it can change from root locale from index', () => {
		const url = new URL('https://example.com/index.html');
		expect(localizedUrl(url, 'en', 'ignore').href).toBe('https://example.com/en.html');
	});
});
