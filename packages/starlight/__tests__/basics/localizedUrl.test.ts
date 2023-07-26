import { expect, test } from 'vitest';
import { localizedUrl } from '../../utils/localizedUrl';

test('it has no effect in a monolingual project', () => {
	const url = new URL('https://example.com/en/guide/');
	expect(localizedUrl(url, undefined).href).toBe(url.href);
});
