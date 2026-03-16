import { expect, test, vi } from 'vitest';
import { getRouteDataTestContext } from '../test-utils';
import { generateRouteData } from '../../utils/routing/data';
import { routes } from '../../utils/routing';
import { flattenSidebar } from '../../utils/navigation';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Home Page' }],
			['getting-started.mdx', { title: 'Splash', template: 'splash' }],
			['showcase.mdx', { title: 'ToC Disabled', tableOfContents: false }],
			['environmental-impact.md', { title: 'Explicit update date', lastUpdated: new Date() }],
		],
	})
);

test('adds data to route shape', () => {
	const route = routes[0]!;
	const data = generateRouteData({
		props: { ...route, headings: [{ depth: 1, slug: 'heading-1', text: 'Heading 1' }] },
		context: getRouteDataTestContext(),
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
		  "next": {
		    "attrs": {},
		    "badge": undefined,
		    "href": "/environmental-impact/",
		    "isCurrent": false,
		    "label": "Explicit update date",
		    "type": "link",
		  },
		  "prev": undefined,
		}
	`);
	expect(data.sidebar.map((entry) => entry.label)).toMatchInlineSnapshot(`
		[
		  "Home Page",
		  "Explicit update date",
		  "Splash",
		  "ToC Disabled",
		]
	`);
});

test('disables table of contents for splash template', () => {
	const route = routes[1]!;
	const data = generateRouteData({
		props: { ...route, headings: [{ depth: 1, slug: 'heading-1', text: 'Heading 1' }] },
		context: getRouteDataTestContext({ pathname: '/getting-started/' }),
	});
	expect(data.toc).toBeUndefined();
});

test('disables table of contents if frontmatter includes `tableOfContents: false`', () => {
	const route = routes[2]!;
	const data = generateRouteData({
		props: { ...route, headings: [{ depth: 1, slug: 'heading-1', text: 'Heading 1' }] },
		context: getRouteDataTestContext({ pathname: '/showcase/' }),
	});
	expect(data.toc).toBeUndefined();
});

test('uses explicit last updated date from frontmatter', () => {
	const route = routes[3]!;
	const data = generateRouteData({
		props: { ...route, headings: [{ depth: 1, slug: 'heading-1', text: 'Heading 1' }] },
		context: getRouteDataTestContext({ pathname: '/showcase/' }),
	});
	expect(data.lastUpdated).toBeInstanceOf(Date);
	expect(data.lastUpdated).toEqual(route.entry.data.lastUpdated);
});

test('uses getSidebarForRender when prerender is enabled', async () => {
	const [{ default: config }, navigation] = await Promise.all([
		import('virtual:starlight/user-config'),
		import('../../utils/navigation'),
	]);
	const originalPrerender = config.prerender;
	const getSidebarForRenderSpy = vi.spyOn(navigation, 'getSidebarForRender');
	const getSidebarSpy = vi.spyOn(navigation, 'getSidebar');

	try {
		config.prerender = true;
		const route = routes[0]!;
		generateRouteData({
			props: { ...route, headings: [] },
			context: getRouteDataTestContext({ pathname: '/' }),
		});

		expect(getSidebarForRenderSpy).toHaveBeenCalledTimes(1);
		expect(getSidebarSpy).not.toHaveBeenCalled();
	} finally {
		config.prerender = originalPrerender;
		getSidebarForRenderSpy.mockRestore();
		getSidebarSpy.mockRestore();
	}
});

test('keeps prerender sidebar snapshots isolated between route data calls', async () => {
	const { default: config } = await import('virtual:starlight/user-config');
	const originalPrerender = config.prerender;

	try {
		config.prerender = true;
		const homeRoute = routes[0]!;
		const impactRoute = routes[3]!;
		const firstData = generateRouteData({
			props: { ...homeRoute, headings: [] },
			context: getRouteDataTestContext({ pathname: '/' }),
		});
		const secondData = generateRouteData({
			props: { ...impactRoute, headings: [] },
			context: getRouteDataTestContext({ pathname: '/environmental-impact/' }),
		});

		// firstData.sidebar must not have been mutated by the second generateRouteData call
		const firstCurrent = flattenSidebar(firstData.sidebar).filter((entry) => entry.isCurrent);
		const secondCurrent = flattenSidebar(secondData.sidebar).filter((entry) => entry.isCurrent);

		expect(firstCurrent).toHaveLength(1);
		expect(firstCurrent[0]?.href).toBe('/');
		expect(secondCurrent).toHaveLength(1);
		expect(secondCurrent[0]?.href).toBe('/environmental-impact/');
	} finally {
		config.prerender = originalPrerender;
	}
});

test('uses getSidebar when prerender is disabled', async () => {
	const [{ default: config }, navigation] = await Promise.all([
		import('virtual:starlight/user-config'),
		import('../../utils/navigation'),
	]);
	const originalPrerender = config.prerender;
	const getSidebarForRenderSpy = vi.spyOn(navigation, 'getSidebarForRender');
	const getSidebarSpy = vi.spyOn(navigation, 'getSidebar');

	try {
		config.prerender = false;
		const route = routes[0]!;
		generateRouteData({
			props: { ...route, headings: [] },
			context: getRouteDataTestContext({ pathname: '/' }),
		});

		expect(getSidebarSpy).toHaveBeenCalledTimes(1);
		expect(getSidebarForRenderSpy).not.toHaveBeenCalled();
	} finally {
		config.prerender = originalPrerender;
		getSidebarForRenderSpy.mockRestore();
		getSidebarSpy.mockRestore();
	}
});
