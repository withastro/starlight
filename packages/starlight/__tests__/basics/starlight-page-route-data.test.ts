import type { ImageMetadata } from 'astro';
import { expect, test, vi } from 'vitest';
import { routes } from '../../utils/routing';
import { generateRouteData } from '../../utils/routing/data';
import {
	generateStarlightPageRouteData,
	type StarlightPageProps,
} from '../../utils/starlight-page';
import { getRouteDataTestContext } from '../test-utils';

vi.mock('virtual:starlight/collection-config', async () =>
	(await import('../test-utils')).mockedCollectionConfig()
);

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Home Page' }],
			['getting-started.mdx', { title: 'Getting Started' }],
			['guides/authoring-content.mdx', { title: 'Authoring Markdown' }],
			['guides/project-structure.mdx', { title: 'Project Structure' }],
			['reference/frontmatter.md', { title: 'Frontmatter Reference' }],
		],
	})
);

const starlightPageProps: StarlightPageProps = {
	frontmatter: { title: 'This is a test title' },
};

const starlightPagePathname = '/test-slug';

test('adds data to route shape', async () => {
	const data = await generateStarlightPageRouteData({
		props: starlightPageProps,
		context: getRouteDataTestContext({ pathname: starlightPagePathname }),
	});
	// Starlight pages infer the slug from the URL.
	expect(data.slug).toBe('test-slug');
	// Starlight pages generate an ID based on their slug.
	expect(data.id).toBeDefined();
	// Starlight pages cannot be fallbacks.
	expect(data.isFallback).toBeUndefined();
	// Starlight pages are not editable if no edit URL is passed.
	expect(data.editUrl).toBeUndefined();
	expect(data.entry.data.editUrl).toBe(false);
	// Starlight pages are part of the docs collection.
	expect(data.entry.collection).toBe('docs');
	// Starlight pages get dedicated frontmatter defaults.
	expect(data.entry.data.head).toEqual([]);
	expect(data.entry.data.pagefind).toBe(true);
	expect(data.entry.data.template).toBe('doc');
	// Starlight pages respect the passed data.
	expect(data.entry.data.title).toBe(starlightPageProps.frontmatter.title);
	// Starlight pages get expected defaults.
	expect(data.siteTitle).toBe('Basics');
	expect(data.hasSidebar).toBe(true);
	expect(data.headings).toEqual([]);
	expect(data.entryMeta.dir).toBe('ltr');
	expect(data.entryMeta.lang).toBe('en');
});

test('adds custom data to route shape', async () => {
	const props: StarlightPageProps = {
		...starlightPageProps,
		hasSidebar: false,
		dir: 'rtl',
		lang: 'ks',
		isFallback: true,
	};
	const data = await generateStarlightPageRouteData({
		props,
		context: getRouteDataTestContext({ pathname: starlightPagePathname }),
	});
	expect(data.hasSidebar).toBe(props.hasSidebar);
	expect(data.entryMeta.dir).toBe(props.dir);
	expect(data.entryMeta.lang).toBe(props.lang);
	expect(data.isFallback).toBe(props.isFallback);
});

test('adds custom frontmatter data to route shape', async () => {
	const props: StarlightPageProps = {
		...starlightPageProps,
		frontmatter: {
			...starlightPageProps.frontmatter,
			head: [{ tag: 'meta', attrs: { name: 'og:test', content: 'test' } }],
			lastUpdated: new Date(),
			pagefind: false,
			template: 'splash',
		},
	};
	const data = await generateStarlightPageRouteData({
		props,
		context: getRouteDataTestContext({ pathname: starlightPagePathname }),
	});
	expect(data.entry.data.head).toMatchInlineSnapshot(`
		[
		  {
		    "attrs": {
		      "content": "test",
		      "name": "og:test",
		    },
		    "tag": "meta",
		  },
		]
	`);
	expect(data.entry.data.lastUpdated).toEqual(props.frontmatter.lastUpdated);
	expect(data.entry.data.pagefind).toBe(props.frontmatter.pagefind);
	expect(data.entry.data.template).toBe(props.frontmatter.template);
});

test('uses generated sidebar when no sidebar is provided', async () => {
	const data = await generateStarlightPageRouteData({
		props: starlightPageProps,
		context: getRouteDataTestContext({ pathname: '/getting-started/' }),
	});
	expect(data.sidebar).toMatchInlineSnapshot(`
		[
		  {
		    "attrs": {},
		    "badge": undefined,
		    "href": "/",
		    "isCurrent": false,
		    "label": "Home Page",
		    "type": "link",
		  },
		  {
		    "attrs": {},
		    "badge": undefined,
		    "href": "/getting-started/",
		    "isCurrent": true,
		    "label": "Getting Started",
		    "type": "link",
		  },
		  {
		    "badge": undefined,
		    "collapsed": false,
		    "entries": [
		      {
		        "attrs": {},
		        "badge": undefined,
		        "href": "/guides/authoring-content/",
		        "isCurrent": false,
		        "label": "Authoring Markdown",
		        "type": "link",
		      },
		      {
		        "attrs": {},
		        "badge": undefined,
		        "href": "/guides/project-structure/",
		        "isCurrent": false,
		        "label": "Project Structure",
		        "type": "link",
		      },
		    ],
		    "label": "guides",
		    "type": "group",
		  },
		  {
		    "badge": undefined,
		    "collapsed": false,
		    "entries": [
		      {
		        "attrs": {},
		        "badge": undefined,
		        "href": "/reference/frontmatter/",
		        "isCurrent": false,
		        "label": "Frontmatter Reference",
		        "type": "link",
		      },
		    ],
		    "label": "reference",
		    "type": "group",
		  },
		]
	`);
});

test('uses provided sidebar if any', async () => {
	const data = await generateStarlightPageRouteData({
		props: {
			...starlightPageProps,
			sidebar: [
				{
					label: 'Custom link 1',
					link: '/test/1',
					badge: 'New',
				},
				{
					label: 'Custom link 2',
					link: '/test/2',
				},
				{
					label: 'Guides',
					autogenerate: { directory: 'guides' },
				},
				'reference/frontmatter',
			],
		},
		context: getRouteDataTestContext({ pathname: '/test/2' }),
	});
	expect(data.sidebar).toMatchInlineSnapshot(`
		[
		  {
		    "attrs": {},
		    "badge": {
		      "text": "New",
		      "variant": "default",
		    },
		    "href": "/test/1",
		    "isCurrent": false,
		    "label": "Custom link 1",
		    "type": "link",
		  },
		  {
		    "attrs": {},
		    "badge": undefined,
		    "href": "/test/2",
		    "isCurrent": true,
		    "label": "Custom link 2",
		    "type": "link",
		  },
		  {
		    "badge": undefined,
		    "collapsed": false,
		    "entries": [
		      {
		        "attrs": {},
		        "badge": undefined,
		        "href": "/guides/authoring-content/",
		        "isCurrent": false,
		        "label": "Authoring Markdown",
		        "type": "link",
		      },
		      {
		        "attrs": {},
		        "badge": undefined,
		        "href": "/guides/project-structure/",
		        "isCurrent": false,
		        "label": "Project Structure",
		        "type": "link",
		      },
		    ],
		    "label": "Guides",
		    "type": "group",
		  },
		  {
		    "attrs": {},
		    "badge": undefined,
		    "href": "/reference/frontmatter/",
		    "isCurrent": false,
		    "label": "Frontmatter Reference",
		    "type": "link",
		  },
		]
	`);
	expect(data.pagination.prev?.href).toBe('/test/1');
	expect(data.pagination.next?.href).toBe('/guides/authoring-content/');
});

test('throws error if sidebar is malformated', async () => {
	await expect(() =>
		generateStarlightPageRouteData({
			props: {
				...starlightPageProps,
				sidebar: [
					{
						label: 'Custom link 1',
						//@ts-expect-error Intentionally bad type to cause error.
						href: '/test/1',
					},
				],
			},
			context: getRouteDataTestContext({ pathname: starlightPagePathname }),
		})
	).rejects.toThrowErrorMatchingInlineSnapshot(`
		"[AstroUserError]:
			Invalid sidebar prop passed to the \`<StarlightPage/>\` component.
		Hint:
			**0**: Did not match union.
			> Expected type \`{ link: string;  } | { items: array;  } | { autogenerate: object;  } | { slug: string } | string\`
			> Received \`{ "label": "Custom link 1", "href": "/test/1" }\`"
	`);
});

test('uses provided pagination if any', async () => {
	const data = await generateStarlightPageRouteData({
		props: {
			...starlightPageProps,
			frontmatter: {
				...starlightPageProps.frontmatter,
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
		context: getRouteDataTestContext({ pathname: starlightPagePathname }),
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
	const data = await generateStarlightPageRouteData({
		props: { ...starlightPageProps, headings },
		context: getRouteDataTestContext({ pathname: starlightPagePathname }),
	});
	expect(data.headings).toEqual(headings);
});

test('generates the table of contents for provided headings', async () => {
	const data = await generateStarlightPageRouteData({
		props: {
			...starlightPageProps,
			headings: [
				{ depth: 2, slug: 'heading-1', text: 'Heading 1' },
				{ depth: 3, slug: 'heading-2', text: 'Heading 2' },
				// Should be ignored as it's too deep with default config.
				{ depth: 4, slug: 'heading-3', text: 'Heading 3' },
			],
		},
		context: getRouteDataTestContext({ pathname: starlightPagePathname }),
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
	const data = await generateStarlightPageRouteData({
		props: {
			...starlightPageProps,
			headings: [
				// Should be ignored as it's not deep enough.
				{ depth: 2, slug: 'heading-1', text: 'Heading 1' },
				{ depth: 3, slug: 'heading-2', text: 'Heading 2' },
				{ depth: 4, slug: 'heading-3', text: 'Heading 3' },
			],
			frontmatter: {
				...starlightPageProps.frontmatter,
				tableOfContents: {
					minHeadingLevel: 3,
					maxHeadingLevel: 4,
				},
			},
		},
		context: getRouteDataTestContext({ pathname: starlightPagePathname }),
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
	const data = await generateStarlightPageRouteData({
		props: {
			...starlightPageProps,
			headings: [
				{ depth: 2, slug: 'heading-1', text: 'Heading 1' },
				{ depth: 3, slug: 'heading-2', text: 'Heading 2' },
			],
			frontmatter: {
				...starlightPageProps.frontmatter,
				tableOfContents: false,
			},
		},
		context: getRouteDataTestContext({ pathname: starlightPagePathname }),
	});
	expect(data.toc).toBeUndefined();
});

test('disables table of contents for splash template', async () => {
	const data = await generateStarlightPageRouteData({
		props: {
			...starlightPageProps,
			headings: [
				{ depth: 2, slug: 'heading-1', text: 'Heading 1' },
				{ depth: 3, slug: 'heading-2', text: 'Heading 2' },
			],
			frontmatter: {
				...starlightPageProps.frontmatter,
				template: 'splash',
			},
		},
		context: getRouteDataTestContext({ pathname: starlightPagePathname }),
	});
	expect(data.toc).toBeUndefined();
});

test('hides the sidebar if the `hasSidebar` option is not specified and the splash template is used', async () => {
	const { hasSidebar, ...otherProps } = starlightPageProps;
	const data = await generateStarlightPageRouteData({
		props: {
			...otherProps,
			frontmatter: {
				...otherProps.frontmatter,
				template: 'splash',
			},
		},
		context: getRouteDataTestContext({ pathname: starlightPagePathname }),
	});
	expect(data.hasSidebar).toBe(false);
});

test('uses provided edit URL if any', async () => {
	const editUrl = 'https://example.com/edit';
	const data = await generateStarlightPageRouteData({
		props: {
			...starlightPageProps,
			frontmatter: {
				...starlightPageProps.frontmatter,
				editUrl,
			},
		},
		context: getRouteDataTestContext({ pathname: starlightPagePathname }),
	});
	expect(data.editUrl).toEqual(new URL(editUrl));
	expect(data.entry.data.editUrl).toEqual(editUrl);
});

test('strips unknown frontmatter properties', async () => {
	const data = await generateStarlightPageRouteData({
		props: {
			...starlightPageProps,
			frontmatter: {
				...starlightPageProps.frontmatter,
				// @ts-expect-error - This is an unknown property.
				unknown: 'test',
			},
		},
		context: getRouteDataTestContext({ pathname: starlightPagePathname }),
	});
	expect('unknown' in data.entry.data).toBe(false);
});

test('generates data with a similar root shape to regular route data', async () => {
	const route = routes[0]!;
	const context = getRouteDataTestContext({ pathname: starlightPagePathname });
	const data = generateRouteData({
		props: { ...route, headings: [{ depth: 1, slug: 'heading-1', text: 'Heading 1' }] },
		context,
	});

	const starlightPageData = await generateStarlightPageRouteData({
		props: starlightPageProps,
		context,
	});

	expect(Object.keys(data).sort()).toEqual(Object.keys(starlightPageData).sort());
});

test('parses an ImageMetadata object successfully', async () => {
	const fakeImportedImage: ImageMetadata = {
		src: '/image-src.png',
		width: 100,
		height: 100,
		format: 'png',
	};
	const data = await generateStarlightPageRouteData({
		props: {
			...starlightPageProps,
			frontmatter: {
				...starlightPageProps.frontmatter,
				hero: {
					image: { file: fakeImportedImage },
				},
			},
		},
		context: getRouteDataTestContext({ pathname: starlightPagePathname }),
	});
	expect(data.entry.data.hero?.image).toBeDefined();
	// @ts-expect-error — image’s type can be different shapes but we know it’s this one here
	expect(data.entry.data.hero?.image!['file']).toMatchInlineSnapshot(`
		{
		  "format": "png",
		  "height": 100,
		  "src": "/image-src.png",
		  "width": 100,
		}
	`);
});

test('parses an image that is also a function successfully', async () => {
	const fakeImportedSvg = (() => {}) as unknown as ImageMetadata;
	Object.assign(fakeImportedSvg, { src: '/image-src.svg', width: 100, height: 100, format: 'svg' });
	const data = await generateStarlightPageRouteData({
		props: {
			...starlightPageProps,
			frontmatter: {
				...starlightPageProps.frontmatter,
				hero: {
					image: { file: fakeImportedSvg },
				},
			},
		},
		context: getRouteDataTestContext({ pathname: starlightPagePathname }),
	});
	expect(data.entry.data.hero?.image).toBeDefined();
	// @ts-expect-error — image’s type can be different shapes but we know it’s this one here
	expect(data.entry.data.hero?.image!['file']).toMatchInlineSnapshot(`[Function]`);
	// @ts-expect-error — see above
	expect(data.entry.data.hero?.image!['file']).toHaveProperty('src');
	// @ts-expect-error — see above
	expect(data.entry.data.hero?.image!['file']).toHaveProperty('width');
	// @ts-expect-error — see above
	expect(data.entry.data.hero?.image!['file']).toHaveProperty('height');
	// @ts-expect-error — see above
	expect(data.entry.data.hero?.image!['file']).toHaveProperty('format');
});

test('fails to parse an image without the expected metadata properties', async () => {
	await expect(() =>
		generateStarlightPageRouteData({
			props: {
				...starlightPageProps,
				frontmatter: {
					...starlightPageProps.frontmatter,
					hero: {
						image: {
							// @ts-expect-error intentionally incorrect input
							file: () => {},
						},
					},
				},
			},
			context: getRouteDataTestContext({ pathname: starlightPagePathname }),
		})
	).rejects.toThrowErrorMatchingInlineSnapshot(`
		"[AstroUserError]:
			Invalid frontmatter props passed to the \`<StarlightPage/>\` component.
		Hint:
			**hero.image**: Did not match union.
			> Expected type \`file | { dark; light } | { html: string }\`
			> Received \`{}\`"
	`);
});

test('adds data to route shape when the `docs` collection is not defined', async () => {
	// Mock the collection config in this test to simulate the absence of the `docs` collection.
	vi.doMock('virtual:starlight/collection-config', () => ({ collections: {} }));

	const data = await generateStarlightPageRouteData({
		props: starlightPageProps,
		context: getRouteDataTestContext({ pathname: starlightPagePathname }),
	});
	expect(data.entry.data.title).toBe(starlightPageProps.frontmatter.title);

	// Undo the mock to restore the original behavior.
	vi.doUnmock('virtual:starlight/collection-config');
});
