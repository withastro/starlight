import { expect, test, vi } from 'vitest';
import { generateVirtualRouteData, type VirtualPageProps } from '../../utils/virtual-page';

vi.mock('virtual:starlight/collection-config', async () =>
	(await import('../test-utils')).mockedCollectionConfig()
);

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Home Page' }],
			['getting-started.mdx', { title: 'Getting Started' }],
		],
	})
);

const virtualPageProps: VirtualPageProps = {
	slug: 'test-slug',
	frontmatter: { title: 'This is a test title' },
};

test('adds data to route shape', async () => {
	const data = await generateVirtualRouteData({
		props: virtualPageProps,
		url: new URL('https://example.com'),
	});
	// Virtual pages respect the slug passed in props.
	expect(data.slug).toBe(virtualPageProps.slug);
	// Virtual pages generate an ID based on their slug.
	expect(data.id).toBeDefined();
	// Virtual pages cannot be fallbacks.
	expect(data.isFallback).toBeUndefined();
	// Virtual pages are not editable if no edit URL is passed.
	expect(data.editUrl).toBeUndefined();
	expect(data.entry.data.editUrl).toBe(false);
	// Virtual pages are part of the docs collection.
	expect(data.entry.collection).toBe('docs');
	// Virtual pages get virtual frontmatter defaults.
	expect(data.entry.data.head).toEqual([]);
	expect(data.entry.data.pagefind).toBe(true);
	expect(data.entry.data.template).toBe('doc');
	// Virtual pages respect the passed data.
	expect(data.entry.data.title).toBe(virtualPageProps.frontmatter.title);
	// Virtual pages get expected defaults.
	expect(data.hasSidebar).toBe(true);
	expect(data.headings).toEqual([]);
	expect(data.entryMeta.dir).toBe('ltr');
	expect(data.entryMeta.lang).toBe('en');
});

test('adds custom data to route shape', async () => {
	const props: VirtualPageProps = {
		...virtualPageProps,
		hasSidebar: false,
		dir: 'rtl',
		lang: 'ks',
	};
	const data = await generateVirtualRouteData({ props, url: new URL('https://example.com') });
	expect(data.hasSidebar).toBe(props.hasSidebar);
	expect(data.entryMeta.dir).toBe(props.dir);
	expect(data.entryMeta.lang).toBe(props.lang);
});

test('adds custom virtual frontmatter data to route shape', async () => {
	const props: VirtualPageProps = {
		...virtualPageProps,
		frontmatter: {
			...virtualPageProps.frontmatter,
			head: [{ tag: 'meta', attrs: { name: 'og:test', content: 'test' } }],
			lastUpdated: new Date(),
			pagefind: false,
			template: 'splash',
		},
	};
	const data = await generateVirtualRouteData({ props, url: new URL('https://example.com') });
	expect(data.entry.data.head).toMatchInlineSnapshot(`
		[
		  {
		    "attrs": {
		      "content": "test",
		      "name": "og:test",
		    },
		    "content": "",
		    "tag": "meta",
		  },
		]
	`);
	expect(data.entry.data.lastUpdated).toEqual(props.frontmatter.lastUpdated);
	expect(data.entry.data.pagefind).toBe(props.frontmatter.pagefind);
	expect(data.entry.data.template).toBe(props.frontmatter.template);
});

test('uses generated sidebar when no sidebar is provided', async () => {
	const data = await generateVirtualRouteData({
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

test('uses provided sidebar if any', async () => {
	const data = await generateVirtualRouteData({
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

test('uses provided pagination if any', async () => {
	const data = await generateVirtualRouteData({
		props: {
			...virtualPageProps,
			frontmatter: {
				...virtualPageProps.frontmatter,
				prev: {
					label: 'Previous link',
					link: '/test/prev',
				},
				next: {
					label: 'Next link',
					link: '/test/next',
				},
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

test('uses provided headings if any', async () => {
	const headings = [
		{ depth: 2, slug: 'heading-1', text: 'Heading 1' },
		{ depth: 3, slug: 'heading-2', text: 'Heading 2' },
	];
	const data = await generateVirtualRouteData({
		props: { ...virtualPageProps, headings },
		url: new URL('https://example.com'),
	});
	expect(data.headings).toEqual(headings);
});

test('generates the table of contents for provided headings', async () => {
	const data = await generateVirtualRouteData({
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

test('respects the `tableOfContents` level configuration', async () => {
	const data = await generateVirtualRouteData({
		props: {
			...virtualPageProps,
			headings: [
				// Should be ignored as it's not deep enough.
				{ depth: 2, slug: 'heading-1', text: 'Heading 1' },
				{ depth: 3, slug: 'heading-2', text: 'Heading 2' },
				{ depth: 4, slug: 'heading-3', text: 'Heading 3' },
			],
			frontmatter: {
				...virtualPageProps.frontmatter,
				tableOfContents: {
					minHeadingLevel: 3,
					maxHeadingLevel: 4,
				},
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

test('disables table of contents if frontmatter includes `tableOfContents: false`', async () => {
	const data = await generateVirtualRouteData({
		props: {
			...virtualPageProps,
			headings: [
				{ depth: 2, slug: 'heading-1', text: 'Heading 1' },
				{ depth: 3, slug: 'heading-2', text: 'Heading 2' },
			],
			frontmatter: {
				...virtualPageProps.frontmatter,
				tableOfContents: false,
			},
		},
		url: new URL('https://example.com'),
	});
	expect(data.toc).toBeUndefined();
});

test('disables table of contents for splash template', async () => {
	const data = await generateVirtualRouteData({
		props: {
			...virtualPageProps,
			headings: [
				{ depth: 2, slug: 'heading-1', text: 'Heading 1' },
				{ depth: 3, slug: 'heading-2', text: 'Heading 2' },
			],
			frontmatter: {
				...virtualPageProps.frontmatter,
				template: 'splash',
			},
		},
		url: new URL('https://example.com'),
	});
	expect(data.toc).toBeUndefined();
});

test('hides the sidebar if the `hasSidebar` option is not specified and the splash template is used', async () => {
	const { hasSidebar, ...otherProps } = virtualPageProps;
	const data = await generateVirtualRouteData({
		props: {
			...otherProps,
			frontmatter: {
				...otherProps.frontmatter,
				template: 'splash',
			},
		},
		url: new URL('https://example.com'),
	});
	expect(data.hasSidebar).toBe(false);
});

test('includes localized labels', async () => {
	const data = await generateVirtualRouteData({
		props: virtualPageProps,
		url: new URL('https://example.com'),
	});
	expect(data.labels).toBeDefined();
	expect(data.labels['skipLink.label']).toBe('Skip to content');
});

test('uses provided edit URL if any', async () => {
	const editUrl = 'https://example.com/edit';
	const data = await generateVirtualRouteData({
		props: {
			...virtualPageProps,
			frontmatter: {
				...virtualPageProps.frontmatter,
				editUrl,
			},
		},
		url: new URL('https://example.com'),
	});
	expect(data.editUrl).toEqual(new URL(editUrl));
	expect(data.entry.data.editUrl).toEqual(editUrl);
});

test('strips unknown frontmatter properties', async () => {
	const data = await generateVirtualRouteData({
		props: {
			...virtualPageProps,
			frontmatter: {
				...virtualPageProps.frontmatter,
				// @ts-expect-error - This is an unknown property.
				unknown: 'test',
			},
		},
		url: new URL('https://example.com'),
	});
	expect('unknown' in data.entry.data).toBe(false);
});
