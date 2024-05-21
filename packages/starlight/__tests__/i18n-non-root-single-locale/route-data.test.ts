import { expect, test, vi } from 'vitest';
import { generateRouteData } from '../../utils/route-data';
import { routes } from '../../utils/routing';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [['fr/index.mdx', { title: 'Accueil' }]],
	})
);

test('does no longer include localized labels', () => {
	const route = routes[0]!;
	const data = generateRouteData({
		props: { ...route, headings: [{ depth: 1, slug: 'heading-1', text: 'Heading 1' }] },
		url: new URL('https://example.com'),
	});
	expect(data.labels).not.toBeDefined();
});
