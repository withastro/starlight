import config from 'virtual:starlight/user-config';
import { expect, test } from 'vitest';

test('test suite is using correct env', () => {
	expect(config.title).toMatchObject({ en: 'Paths with Spaces' });
});
