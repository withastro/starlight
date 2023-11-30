import { expect, test, vi } from 'vitest';
import { generateVirtualRouteData, type VirtualPageProps } from '../../utils/route-data';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Home Page' }],
			['getting-started.mdx', { title: 'Getting Started' }],
		],
	})
);

const virtualPageProps: VirtualPageProps = {
	dir: 'rtl',
	hasSidebar: true,
	head: [],
	headings: [],
	lang: 'ks',
	lastUpdated: new Date(),
	pagefind: true,
	slug: 'test-slug',
	template: 'doc',
	title: 'This is a test title',
};

test('adds data to route shape', () => {
	const data = generateVirtualRouteData({
		props: virtualPageProps,
		url: new URL('https://example.com'),
	});
	// Virtual pages respect the slug passed in props.
	expect(data.slug).toBe(virtualPageProps.slug);
	// Virtual pages generate an ID based on their slug.
	expect(data.id).toBeDefined();
	// Virtual pages cannot be fallbacks.
	expect(data.isFallback).toBeUndefined();
	// Virtual pages cannot be edited.
	expect(data.editUrl).toBeUndefined();
	expect(data.entry.data.editUrl).toBe(false);
	// Virtual pages are part of the docs collection.
	expect(data.entry.collection).toBe('docs');
	// Virtual pages respect the passed data.
	expect(data.hasSidebar).toBe(virtualPageProps.hasSidebar);
	expect(data.entry.data.lastUpdated).toBe(virtualPageProps.lastUpdated);
	expect(data.entry.data.pagefind).toBe(virtualPageProps.pagefind);
	expect(data.entry.data.template).toBe(virtualPageProps.template);
	expect(data.entry.data.title).toBe(virtualPageProps.title);
	// Virtual pages respect the entry meta.
	expect(data.entryMeta.dir).toBe(virtualPageProps.dir);
	expect(data.entryMeta.lang).toBe(virtualPageProps.lang);
});

test('uses generated sidebar when no sidebar is provided', () => {
	const data = generateVirtualRouteData({
		props: virtualPageProps,
		url: new URL('https://example.com'),
	});
	expect(data.sidebar.map((entry) => entry.label)).toMatchInlineSnapshot(`
		[
		  "Home Page",
		  "Getting Started",
		]
	`);
});

test('uses provided sidebar if any', () => {
	const data = generateVirtualRouteData({
		props: {
			...virtualPageProps,
			sidebar: [
				{
					type: 'link',
					label: 'Custom link 1',
					href: '/test/1',
					isCurrent: false,
					badge: undefined,
					attrs: {},
				},
				{
					type: 'link',
					label: 'Custom link 2',
					href: '/test/2',
					isCurrent: false,
					badge: undefined,
					attrs: {},
				},
			],
		},
		url: new URL('https://example.com'),
	});
	expect(data.sidebar.map((entry) => entry.label)).toMatchInlineSnapshot(`
		[
		  "Custom link 1",
		  "Custom link 2",
		]
	`);
});

test('uses provided pagination if any', () => {
	const data = generateVirtualRouteData({
		props: {
			...virtualPageProps,
			prev: {
				label: 'Previous link',
				link: '/test/prev',
			},
			next: {
				label: 'Next link',
				link: '/test/next',
			},
		},
		url: new URL('https://example.com'),
	});
	expect(data.pagination).toMatchInlineSnapshot(`
		{
		  "next": {
		    "attrs": {},
		    "badge": undefined,
		    "href": "/test/next",
		    "isCurrent": false,
		    "label": "Next link",
		    "type": "link",
		  },
		  "prev": {
		    "attrs": {},
		    "badge": undefined,
		    "href": "/test/prev",
		    "isCurrent": false,
		    "label": "Previous link",
		    "type": "link",
		  },
		}
	`);
});

test('generates the table of contents for provided headings', () => {
	const data = generateVirtualRouteData({
		props: {
			...virtualPageProps,
			headings: [
				{ depth: 2, slug: 'heading-1', text: 'Heading 1' },
				{ depth: 3, slug: 'heading-2', text: 'Heading 2' },
				// Should be ignored as it's too deep with default config.
				{ depth: 4, slug: 'heading-3', text: 'Heading 3' },
			],
		},
		url: new URL('https://example.com'),
	});
	expect(data.toc).toMatchInlineSnapshot(`
		{
		  "items": [
		    {
		      "children": [],
		      "depth": 2,
		      "slug": "_top",
		      "text": "Overview",
		    },
		    {
		      "children": [
		        {
		          "children": [],
		          "depth": 3,
		          "slug": "heading-2",
		          "text": "Heading 2",
		        },
		      ],
		      "depth": 2,
		      "slug": "heading-1",
		      "text": "Heading 1",
		    },
		  ],
		  "maxHeadingLevel": 3,
		  "minHeadingLevel": 2,
		}
	`);
});

test('respects the `tableOfContents` level configuration', () => {
	const data = generateVirtualRouteData({
		props: {
			...virtualPageProps,
			headings: [
				// Should be ignored as it's not deep enough.
				{ depth: 2, slug: 'heading-1', text: 'Heading 1' },
				{ depth: 3, slug: 'heading-2', text: 'Heading 2' },
				{ depth: 4, slug: 'heading-3', text: 'Heading 3' },
			],
			tableOfContents: {
				minHeadingLevel: 3,
				maxHeadingLevel: 4,
			},
		},
		url: new URL('https://example.com'),
	});
	expect(data.toc).toMatchInlineSnapshot(`
		{
		  "items": [
		    {
		      "children": [
		        {
		          "children": [
		            {
		              "children": [],
		              "depth": 4,
		              "slug": "heading-3",
		              "text": "Heading 3",
		            },
		          ],
		          "depth": 3,
		          "slug": "heading-2",
		          "text": "Heading 2",
		        },
		      ],
		      "depth": 2,
		      "slug": "_top",
		      "text": "Overview",
		    },
		  ],
		  "maxHeadingLevel": 4,
		  "minHeadingLevel": 3,
		}
	`);
});

test('disables table of contents if frontmatter includes `tableOfContents: false`', () => {
	const data = generateVirtualRouteData({
		props: {
			...virtualPageProps,
			headings: [
				{ depth: 2, slug: 'heading-1', text: 'Heading 1' },
				{ depth: 3, slug: 'heading-2', text: 'Heading 2' },
			],
			tableOfContents: false,
		},
		url: new URL('https://example.com'),
	});
	expect(data.toc).toBeUndefined();
});

test('disables table of contents for splash template', () => {
	const data = generateVirtualRouteData({
		props: {
			...virtualPageProps,
			headings: [
				{ depth: 2, slug: 'heading-1', text: 'Heading 1' },
				{ depth: 3, slug: 'heading-2', text: 'Heading 2' },
			],
			template: 'splash',
		},
		url: new URL('https://example.com'),
	});
	expect(data.toc).toBeUndefined();
});

test('includes localized labels', () => {
	const data = generateVirtualRouteData({
		props: virtualPageProps,
		url: new URL('https://example.com'),
	});
	expect(data.labels).toBeDefined();
	expect(data.labels['skipLink.label']).toBe('Skip to content');
});
