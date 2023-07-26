import { expect, test } from 'vitest';
import { localizedUrl } from '../../utils/localizedUrl';

test('it has no effect if locale matches', () => {
	const url = new URL('https://example.com/en/guide/');
	expect(localizedUrl(url, 'en').href).toBe(url.href);
});

test('it changes locale to requested locale', () => {
	const url = new URL('https://example.com/en/guide/');
	expect(localizedUrl(url, 'fr').href).toBe('https://example.com/fr/guide/');
});
