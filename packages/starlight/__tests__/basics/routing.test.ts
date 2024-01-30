import { type GetStaticPathItems } from 'astro';
import { getCollection } from 'astro:content';
import config from 'virtual:starlight/user-config';
import { expect, test, vi } from 'vitest';
import { routes, paths, getRouteBySlugParam } from '../../utils/routing';
import { slugToParam } from '../../utils/slugs';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['404.md', { title: 'Not found' }],
			['index.mdx', { title: 'Home page' }],
			['guides/authoring-content.md', { title: 'Authoring content' }],
		],
	})
);

test('test suite is using correct env', () => {
	expect(config.title).toBe('Basics');
});

test('route slugs are normalized', () => {
	const indexRoute = routes.find((route) => route.id.startsWith('index.md'));
	expect(indexRoute?.slug).toBe('');
});

test('routes contain copy of original doc as entry', async () => {
	const docs = await getCollection('docs');
	for (const route of routes) {
		const doc = docs.find((doc) => doc.id === route.id);
		if (!doc) throw new Error('Expected to find doc for route ' + route.id);
		// Compare without slug as slugs can be normalized.
		const { slug: _, ...entry } = route.entry;
		const { slug: __, ...input } = doc;
		expect(entry).toEqual(input);
	}
});

test('routes have locale data added', () => {
	for (const route of routes) {
		expect(route.lang).toBe('en');
		expect(route.dir).toBe('ltr');
		expect(route.locale).toBeUndefined();
	}
});

test('paths contain normalized slugs for path parameters', () => {
	const expectedPaths: GetStaticPathItems = [
		{
			params: { slug: '404' },
			props: routes[0],
		},
		{
			params: { slug: undefined },
			props: routes[1],
		},
		{
			params: { slug: 'guides/authoring-content' },
			props: routes[2],
		},
	];

	expect(paths).toEqual(expectedPaths);
});

test('routes can be retrieved from their path parameters', () => {
	for (const route of routes) {
		const params = slugToParam(route.slug);
		const routeFromParams = getRouteBySlugParam(params);

		expect(routeFromParams).toBe(route);
	}
});
