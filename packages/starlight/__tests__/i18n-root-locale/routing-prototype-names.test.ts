import { expect, test, vi } from 'vitest';
import { routes } from '../../src/utils/routing';
import { generateRouteData } from '../../src/utils/routing/data';
import { getRouteDataTestContext } from '../test-utils';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [['constructor/overview.md', { title: 'Constructor API' }]],
	})
);

test('preserves prototype-named directories when localizing root pages', () => {
	expect(routes.map(({ id }) => id)).toEqual([
		'constructor/overview',
		'en/constructor/overview',
		'ar/constructor/overview',
	]);
	const route = routes[0]!;
	expect(route.locale).toBeUndefined();
	const { head } = generateRouteData({
		props: { ...route, headings: [] },
		context: getRouteDataTestContext({ pathname: '/constructor/overview/' }),
	});
	expect(head).toContainEqual({
		tag: 'link',
		attrs: {
			rel: 'alternate',
			href: 'https://example.com/en/constructor/overview/',
			hreflang: 'en-US',
		},
	});
});
