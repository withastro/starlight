import { describe, expect, test, vi } from 'vitest';
import { getSidebar } from '../../utils/navigation';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [['getting-started.mdx', { title: 'Getting Started' }]],
	})
);

describe('getSidebar', () => {
	test('throws an error if slug doesn’t match a content collection entry', () => {
		expect(() => getSidebar('/', undefined)).toThrowErrorMatchingInlineSnapshot(`
			"[AstroUserError]:
				The slug \`"/getting-started/"\` specified in the Starlight sidebar config must not start or end with a slash.
			Hint:
				Please try updating \`"/getting-started/"\` to \`"getting-started"\`."
		`);
	});
});
