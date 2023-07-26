import { expect, test } from 'vitest';
import { localizedUrl } from '../../utils/localizedUrl';

test('it has no effect if locale matches', () => {
	const url = new URL('https://example.com/en/guide/');
	expect(localizedUrl(url, 'en').href).toBe(url.href);
});

test('it changes locale to requested locale', () => {
	const url = new URL('https://example.com/en/guide/');
	expect(localizedUrl(url, 'ar').href).toBe('https://example.com/ar/guide/');
});

test('it can change to root locale', () => {
	const url = new URL('https://example.com/en/guide/');
	expect(localizedUrl(url, undefined).href).toBe('https://example.com/guide/');
});

test('it can change from root locale', () => {
	const url = new URL('https://example.com/guide/');
	expect(localizedUrl(url, 'en').href).toBe('https://example.com/en/guide/');
});
