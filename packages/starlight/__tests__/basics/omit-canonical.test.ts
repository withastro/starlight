import { expect, test, vi } from 'vitest';
import { getRouteDataTestContext } from '../test-utils';
import { generateRouteData } from '../../utils/routing/data';
import { routes } from '../../utils/routing';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Home Page' }],
			[
				'environmental-impact.md',
				{
					title: 'Eco-friendly docs',
					description:
						'Learn how Starlight can help you build greener documentation sites and reduce your carbon footprint.',
				},
			],
		],
	})
);

test('omits link canonical tag when site is not set', () => {
	const route = routes[0]!;
	const { head } = generateRouteData({
		props: { ...route, headings: [] },
		context: getRouteDataTestContext({ setSite: false }),
	});

	const canonicalExists = head.some((tag) => tag.tag === 'link' && tag.attrs?.rel === 'canonical');

	expect(canonicalExists).toBe(false);
});
