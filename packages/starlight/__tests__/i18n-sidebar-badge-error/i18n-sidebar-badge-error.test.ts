import { describe, expect, test, vi } from 'vitest';
import { getSidebar } from '../../utils/navigation';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [['getting-started.mdx', { title: 'Getting Started' }]],
	})
);

describe('getSidebar', () => {
	test('throws an error if an i18n badge doesn’t have a key for the default language', () => {
		expect(() => getSidebar('/', undefined)).toThrowErrorMatchingInlineSnapshot(`
			"[AstroUserError]:
				The badge text for "Getting Started" must have a key for the default language "en-US".
			Hint:
				Update the Starlight config to include a badge text for the default language.
				Learn more about sidebar badges internationalization at https://starlight.astro.build/guides/sidebar/#internationalization-with-badges"
		`);
	});
});
