import { bench, describe, vi } from 'vitest';
import { getRouteDataTestContext } from '../__tests__/test-utils';
import { generateRouteData } from '../src/utils/routing/data';
import { getRouteBySlugParam } from '../src/utils/routing';
import { getSidebar } from '../src/utils/navigation';

const docs = vi.hoisted(() => {
	const docs: [string, { title: string }][] = [];
	for (let section = 0; section < 10; section++) {
		const nesting = Array.from({ length: 7 }, (_, index) => `level-${index + 1}`).join('/');
		for (let page = 0; page < 100; page++) {
			docs.push([
				`reference/section-${section}/${nesting}/page-${page}.md`,
				{ title: `Page ${section}-${page}` },
			]);
		}
	}
	return docs;
});

vi.mock('astro:content', async () =>
	(await import('../__tests__/test-utils')).mockedAstroContent({ docs })
);

const slug = 'reference/section-9/level-1/level-2/level-3/level-4/level-5/level-6/level-7/page-99';
const route = getRouteBySlugParam(slug);
if (!route) throw new Error('Expected deep benchmark route to exist.');

const context = getRouteDataTestContext({ pathname: `/${slug}/` });
const props = {
	...route,
	headings: Array.from({ length: 30 }, (_, index) => ({
		depth: 2,
		slug: `heading-${index}`,
		text: `Heading ${index}`,
	})),
};

// Build intermediate sidebar data once so this models subsequent page generation during a build.
getSidebar(context.url.pathname, route.locale);

describe('routing', () => {
	bench('route_data', () => {
		generateRouteData({ props, context });
	});

	bench('sidebar', () => {
		getSidebar(context.url.pathname, route.locale);
	});
});
