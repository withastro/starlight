import { expect, test, vi } from 'vitest';
import { routes } from '../../utils/routing';
import { generateRouteData } from '../../utils/routing/data';
import { getRouteDataTestContext } from '../test-utils';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [['index.mdx', { title: 'Home Page' }]],
	})
);

test('places the default favicon below any user provided icons', () => {
	const { head } = generateRouteData({
		props: { ...routes[0]!, headings: [] },
		context: getRouteDataTestContext(),
	});
	const faviconEntry = head.find((tag) => tag.tag === 'link' && tag.attrs?.rel === 'shortcut icon');

	expect(faviconEntry?.attrs?.href).toBe('https://example.com/favicon.ico');
});
