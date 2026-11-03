import { expect, test, vi } from 'vitest';
import { routes } from '../../src/utils/routing';
import { generateRouteData } from '../../src/utils/routing/data';
import { getRouteDataTestContext } from '../test-utils';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [['index.mdx', { title: 'Home Page' }]],
	})
);

test('strips a trailing slash from the social link when generating `twitter:site`', () => {
	const { head } = generateRouteData({
		props: { ...routes[0]!, headings: [] },
		context: getRouteDataTestContext(),
	});
	const twitterSite = head.find((tag) => tag.tag === 'meta' && tag.attrs?.name === 'twitter:site');

	expect(twitterSite?.attrs?.content).toBe('@astrodotbuild');
});
