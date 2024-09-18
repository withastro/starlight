import { expect, test, vi } from 'vitest';
import { generateRouteData } from '../../utils/route-data';
import { routes } from '../../utils/routing';
import {
	generateStarlightPageRouteData,
	type StarlightPageProps,
} from '../../utils/starlight-page';

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

const starlightPageUrl = new URL('https://example.com/test-slug');

test('adds data to route shape', async () => {
	const data = await generateStarlightPageRouteData({
		props: starlightPageProps,
		url: starlightPageUrl,
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
	};
	const data = await generateStarlightPageRouteData({ props, url: starlightPageUrl });
	expect(data.hasSidebar).toBe(props.hasSidebar);
	expect(data.entryMeta.dir).toBe(props.dir);
	expect(data.entryMeta.lang).toBe(props.lang);
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
	const data = await generateStarlightPageRouteData({ props, url: starlightPageUrl });
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
	const data = await generateStarlightPageRouteData({
		props: starlightPageProps,
		url: starlightPageUrl,
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
		    "isCurrent": false,
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
		url: starlightPageUrl,
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
		    "isCurrent": false,
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
		    "href": "/reference/frontmatter",
		    "isCurrent": false,
		    "label": "Frontmatter Reference",
		    "type": "link",
		  },
		]
	`);
});

test('throws error if sidebar is malformated', async () => {
	expect(() =>
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
			url: starlightPageUrl,
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
		url: starlightPageUrl,
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
		url: starlightPageUrl,
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
		url: starlightPageUrl,
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
		url: starlightPageUrl,
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
		url: starlightPageUrl,
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
		url: starlightPageUrl,
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
		url: starlightPageUrl,
	});
	expect(data.hasSidebar).toBe(false);
});

test('throws when accessing a label using the deprecated `labels` prop', async () => {
	const data = await generateStarlightPageRouteData({
		props: starlightPageProps,
		url: starlightPageUrl,
	});
	expect(() => data.labels['any']).toThrowErrorMatchingInlineSnapshot(`
		"[AstroUserError]:
			The \`labels\` prop in component overrides has been removed.
		Hint:
			Replace \`Astro.props.labels["any"]\` with \`Astro.locals.t("any")\` instead.
			For more information see https://starlight.astro.build/guides/i18n/#using-ui-translations"
	`);
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
		url: starlightPageUrl,
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
		url: starlightPageUrl,
	});
	expect('unknown' in data.entry.data).toBe(false);
});

test('generates data with a similar root shape to regular route data', async () => {
	const route = routes[0]!;
	const data = generateRouteData({
		props: { ...route, headings: [{ depth: 1, slug: 'heading-1', text: 'Heading 1' }] },
		url: new URL('https://example.com'),
	});

	const starlightPageData = await generateStarlightPageRouteData({
		props: starlightPageProps,
		url: starlightPageUrl,
	});

	expect(Object.keys(data).sort()).toEqual(Object.keys(starlightPageData).sort());
});
