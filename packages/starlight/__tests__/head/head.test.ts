import { describe, expect, test, vi } from 'vitest';
import { getRouteDataTestContext } from '../test-utils';
import { generateRouteData } from '../../utils/routing/data';
import { routes } from '../../utils/routing';
import type { HeadConfig } from '../../schemas/head';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [['index.mdx', { title: 'Home Page' }]],
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
		content: '',
		tag: 'script',
	});
});

test('merges two <title> tags', () => {
	const head = getTestHead([{ tag: 'title', content: 'Override', attrs: {} }]);
	expect(head.filter((tag) => tag.tag === 'title')).toEqual([
		{ tag: 'title', content: 'Override', attrs: {} },
	]);
});

test('merges two <link rel="canonical" href="" /> tags', () => {
	const customLink = {
		tag: 'link',
		attrs: { rel: 'canonical', href: 'https://astro.build' },
		content: '',
	} as const;
	const head = getTestHead([customLink]);
	expect(head.filter((tag) => tag.tag === 'link' && tag.attrs.rel === 'canonical')).toEqual([
		customLink,
	]);
});

test('does not merge same link tags', () => {
	const customLink = {
		tag: 'link',
		attrs: { rel: 'stylesheet', href: 'secondary.css' },
		content: '',
	} as const;
	const head = getTestHead([customLink]);
	expect(head.filter((tag) => tag.tag === 'link' && tag.attrs.rel === 'stylesheet')).toEqual([
		{ tag: 'link', attrs: { rel: 'stylesheet', href: 'primary.css' }, content: '' },
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
				content: '',
			} as const;
			const head = getTestHead([customMeta]);
			expect(head.filter((tag) => tag.tag === 'meta' && tag.attrs[prop] === 'x')).toEqual([
				customMeta,
			]);
		});

		test(`does not merge two <meta> tags with different ${prop} values`, () => {
			const customMeta = {
				tag: 'meta',
				attrs: { [prop]: 'y', content: 'Test' },
				content: '',
			} as const;
			const head = getTestHead([customMeta]);
			expect(
				head.filter(
					(tag) => tag.tag === 'meta' && (tag.attrs[prop] === 'x' || tag.attrs[prop] === 'y')
				)
			).toEqual([
				{ tag: 'meta', attrs: { [prop]: 'x', content: 'Default' }, content: '' },
				customMeta,
			]);
		});
	}
);

test('sorts head by tag importance', () => {
	const head = getTestHead();

	const expectedHeadStart = [
		// Important meta tags
		{ tag: 'meta', attrs: { charset: 'utf-8' }, content: '' },
		{ tag: 'meta', attrs: expect.objectContaining({ name: 'viewport' }), content: '' },
		{ tag: 'meta', attrs: expect.objectContaining({ 'http-equiv': 'x' }), content: '' },
		// <title>
		{ tag: 'title', attrs: {}, content: 'Home Page | Docs With Custom Head' },
		// Sitemap
		{ tag: 'link', attrs: { rel: 'sitemap', href: '/sitemap-index.xml' }, content: '' },
		// Canonical link
		{ tag: 'link', attrs: { rel: 'canonical', href: 'https://example.com/test' }, content: '' },
		// Others
		{ tag: 'link', attrs: expect.objectContaining({ rel: 'stylesheet' }), content: '' },
	];

	expect(head.slice(0, expectedHeadStart.length)).toEqual(expectedHeadStart);

	const expectedHeadEnd = [
		// SEO meta tags
		{ tag: 'meta', attrs: expect.objectContaining({ name: 'x' }), content: '' },
		{ tag: 'meta', attrs: expect.objectContaining({ property: 'x' }), content: '' },
	];

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
			content: '',
		},
	]);

	const defaultFaviconIndex = head.findIndex(
		(tag) => tag.tag === 'link' && tag.attrs.rel === 'shortcut icon'
	);
	const userFaviconIndex = head.findIndex((tag) => tag.tag === 'link' && tag.attrs.rel === 'icon');

	expect(defaultFaviconIndex).toBeGreaterThan(userFaviconIndex);
});

function getTestHead(heads: HeadConfig = []): HeadConfig {
	const route = routes[0]!;
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
		context: getRouteDataTestContext(),
	}).head;
}
