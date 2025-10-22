import { describe, expect, test, vi } from 'vitest';
import { getRouteDataTestContext } from '../test-utils';
import { generateRouteData } from '../../utils/routing/data';
import { routes } from '../../utils/routing';
import type { HeadConfig } from '../../schemas/head';

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

test('includes custom tags defined in the Starlight configuration', () => {
	const head = getTestHead();
	expect(head).toContainEqual({
		attrs: {
			'data-site': 'TEST-ANALYTICS-ID',
			defer: true,
			src: 'https://example.com/analytics',
		},
		tag: 'script',
	});
});

test('includes description based on Starlight `description` configuration', () => {
	const head = getTestHead();
	expect(head).toContainEqual({
		tag: 'meta',
		attrs: {
			name: 'description',
			content: 'Docs with a custom head',
		},
	});
});

test('includes description based on page `description` frontmatter field if provided', () => {
	const head = getTestHead([], routes[1]);
	expect(head).toContainEqual({
		tag: 'meta',
		attrs: {
			name: 'description',
			content:
				'Learn how Starlight can help you build greener documentation sites and reduce your carbon footprint.',
		},
	});
});

test('includes `twitter:site` based on Starlight `social` configuration', () => {
	const head = getTestHead();
	expect(head).toContainEqual({
		tag: 'meta',
		attrs: {
			name: 'twitter:site',
			content: '@astrodotbuild',
		},
	});
});

test('merges two <title> tags', () => {
	const head = getTestHead([{ tag: 'title', content: 'Override' }]);
	expect(head.filter((tag) => tag.tag === 'title')).toEqual([
		{ tag: 'title', content: 'Override' },
	]);
});

test('merges two <link rel="canonical" href="" /> tags', () => {
	const customLink = {
		tag: 'link',
		attrs: { rel: 'canonical', href: 'https://astro.build' },
	} as const;
	const head = getTestHead([customLink]);
	expect(head.filter((tag) => tag.tag === 'link' && tag.attrs?.rel === 'canonical')).toEqual([
		customLink,
	]);
});

test('does not merge same link tags', () => {
	const customLink = {
		tag: 'link',
		attrs: { rel: 'stylesheet', href: 'secondary.css' },
	} as const;
	const head = getTestHead([customLink]);
	expect(head.filter((tag) => tag.tag === 'link' && tag.attrs?.rel === 'stylesheet')).toEqual([
		{ tag: 'link', attrs: { rel: 'stylesheet', href: 'primary.css' } },
		customLink,
	]);
});

describe.each([['name'], ['property'], ['http-equiv']])(
	"<meta> tags with '%s' attributes",
	(prop) => {
		test(`merges two <meta> tags with same ${prop} values`, () => {
			const customMeta = {
				tag: 'meta',
				attrs: { [prop]: 'x', content: 'Test' },
			} as const;
			const head = getTestHead([customMeta]);
			expect(head.filter((tag) => tag.tag === 'meta' && tag.attrs?.[prop] === 'x')).toEqual([
				customMeta,
			]);
		});

		test(`does not merge two <meta> tags with different ${prop} values`, () => {
			const customMeta = {
				tag: 'meta',
				attrs: { [prop]: 'y', content: 'Test' },
			} as const;
			const head = getTestHead([customMeta]);
			expect(
				head.filter(
					(tag) => tag.tag === 'meta' && (tag.attrs?.[prop] === 'x' || tag.attrs?.[prop] === 'y')
				)
			).toEqual([{ tag: 'meta', attrs: { [prop]: 'x', content: 'Default' } }, customMeta]);
		});
	}
);

test('sorts head by tag importance', () => {
	const head = getTestHead();

	// `expect.objectContaining` returns `any`.
	/* eslint-disable @typescript-eslint/no-unsafe-assignment */
	const expectedHeadStart = [
		// Important meta tags
		{ tag: 'meta', attrs: { charset: 'utf-8' } },
		{ tag: 'meta', attrs: expect.objectContaining({ name: 'viewport' }) },
		{ tag: 'meta', attrs: expect.objectContaining({ 'http-equiv': 'x' }) },
		// <title>
		{ tag: 'title', content: 'Home Page | Docs With Custom Head' },
		// Sitemap
		{ tag: 'link', attrs: { rel: 'sitemap', href: '/sitemap-index.xml' } },
		// Canonical link
		{ tag: 'link', attrs: { rel: 'canonical', href: 'https://example.com/test' } },
		// Others
		{ tag: 'link', attrs: expect.objectContaining({ rel: 'stylesheet' }) },
	];

	expect(head.slice(0, expectedHeadStart.length)).toEqual(expectedHeadStart);

	const expectedHeadEnd = [
		// SEO meta tags
		{ tag: 'meta', attrs: expect.objectContaining({ name: 'x' }) },
		{ tag: 'meta', attrs: expect.objectContaining({ property: 'x' }) },
	];
	/* eslint-enable @typescript-eslint/no-unsafe-assignment */

	expect(head.slice(-expectedHeadEnd.length)).toEqual(expectedHeadEnd);
});

test('places the default favicon below any user provided icons', () => {
	const head = getTestHead([
		{
			tag: 'link',
			attrs: {
				rel: 'icon',
				href: '/favicon.ico',
				sizes: '32x32',
			},
		},
	]);

	const defaultFaviconIndex = head.findIndex(
		(tag) => tag.tag === 'link' && tag.attrs?.rel === 'shortcut icon'
	);
	const userFaviconIndex = head.findIndex((tag) => tag.tag === 'link' && tag.attrs?.rel === 'icon');

	expect(defaultFaviconIndex).toBeGreaterThan(userFaviconIndex);
});

test.only('omits meta og:url tag when site is not set', () => {
	const head = getTestHead(undefined, undefined, false);

	const ogUrlExists = head.some((tag) => tag.tag === 'meta' && tag.attrs?.property === 'og:url');

	expect(ogUrlExists).toBe(false);
});

function getTestHead(heads: HeadConfig = [], route = routes[0]!, setSite?: boolean): HeadConfig {
	return generateRouteData({
		props: {
			...route,
			headings: [],
			entry: {
				...route.entry,
				data: {
					...route.entry.data,
					head: [...route.entry.data.head, ...heads],
				},
			},
		},
		context:
			setSite === undefined
				? getRouteDataTestContext()
				: getRouteDataTestContext(undefined, setSite),
	}).head;
}
