import { expect, test, vi } from 'vitest';
import { generateRouteData } from '../../utils/route-data';
import { routes } from '../../utils/routing';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [['index.mdx', { title: 'Home Page' }]],
	})
);

test('adds data to route shape', () => {
	const route = routes[0]!;
	const data = generateRouteData({
		props: { ...route, headings: [{ depth: 1, slug: 'heading-1', text: 'Heading 1' }] },
		url: new URL('https://example.com'),
	});
	expect(data.hasSidebar).toBe(true);
	expect(data).toHaveProperty('lastUpdated');
	expect(data.toc).toMatchInlineSnapshot(`
		{
		  "items": [
		    {
		      "children": [],
		      "depth": 2,
		      "slug": "_top",
		      "text": "Overview",
		    },
		  ],
		  "maxHeadingLevel": 3,
		  "minHeadingLevel": 2,
		}
	`);
	expect(data.pagination).toMatchInlineSnapshot(`
    {
      "next": undefined,
      "prev": undefined,
    }
  `);
	expect(data.sidebar).toMatchInlineSnapshot(`
		[
		  {
		    "badge": undefined,
		    "href": "/",
		    "isCurrent": true,
		    "label": "Home Page",
		    "type": "link",
		  },
		]
	`);
});
