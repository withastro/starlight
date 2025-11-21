import { describe, expect, test, vi } from 'vitest';
import { getSidebar } from '../../src/utils/navigation';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Home Page' }],
			['environmental-impact.md', { title: 'Eco-friendly docs' }],
			['resources/plugins.mdx', { title: 'Plugins' }],
			['resources/themes.mdx', { title: 'Themes' }],
			[
				'reference/frontmatter.md',
				{
					title: 'Frontmatter Reference',
					sidebar: { attrs: { class: 'advanced', ping: 'https://example.com' } },
				},
			],
			// Links to pages in the `api/v1/` directory have custom attributes, even nested ones.
			['api/v1/users.md', { title: 'Users API' }],
			['api/v1/products/add.md', { title: 'Add Product' }],
			[
				'api/v1/products/remove.md',
				// A page in the `api/v1/` directory can specify custom attributes to be merged with the
				// default ones.
				{
					title: 'Remove Product',
					sidebar: { attrs: { 'data-experimental': true } },
				},
			],
			['Deprecated API/users.md', { title: 'Deprecated Users API' }],
		],
	})
);

describe('getSidebar', () => {
	test('passes down custom HTML link attributes', () => {
		expect(getSidebar('/', undefined)).toMatchInlineSnapshot(`
			[
			  {
			    "attrs": {},
			    "badge": undefined,
			    "href": "/",
			    "isCurrent": true,
			    "label": "Home",
			    "type": "link",
			  },
			  {
			    "badge": undefined,
			    "collapsed": false,
			    "entries": [
			      {
			        "attrs": {},
			        "badge": {
			          "text": "New",
			          "variant": "success",
			        },
			        "href": "/intro",
			        "isCurrent": false,
			        "label": "Introduction",
			        "type": "link",
			      },
			      {
			        "attrs": {},
			        "badge": {
			          "text": "Deprecated",
			          "variant": "default",
			        },
			        "href": "/next-steps",
			        "isCurrent": false,
			        "label": "Next Steps",
			        "type": "link",
			      },
			      {
			        "attrs": {
			          "class": "showcase-link",
			          "target": "_blank",
			        },
			        "badge": undefined,
			        "href": "/showcase",
			        "isCurrent": false,
			        "label": "Showcase",
			        "type": "link",
			      },
			    ],
			    "label": "Start Here",
			    "type": "group",
			  },
			  {
			    "badge": undefined,
			    "collapsed": false,
			    "entries": [
			      {
			        "attrs": {},
			        "badge": undefined,
			        "href": "/resources/plugins/",
			        "isCurrent": false,
			        "label": "Plugins",
			        "type": "link",
			      },
			      {
			        "attrs": {},
			        "badge": undefined,
			        "href": "/resources/themes/",
			        "isCurrent": false,
			        "label": "Themes",
			        "type": "link",
			      },
			    ],
			    "label": "Resources",
			    "type": "group",
			  },
			  {
			    "badge": {
			      "text": "Experimental",
			      "variant": "default",
			    },
			    "collapsed": false,
			    "entries": [
			      {
			        "attrs": {
			          "class": "advanced",
			          "ping": "https://example.com",
			        },
			        "badge": undefined,
			        "href": "/reference/frontmatter/",
			        "isCurrent": false,
			        "label": "Frontmatter Reference",
			        "type": "link",
			      },
			    ],
			    "label": "Reference",
			    "type": "group",
			  },
			  {
			    "badge": undefined,
			    "collapsed": false,
			    "entries": [
			      {
			        "badge": undefined,
			        "collapsed": false,
			        "entries": [
			          {
			            "attrs": {
			              "class": "current",
			              "data-version": "1",
			            },
			            "badge": undefined,
			            "href": "/api/v1/products/add/",
			            "isCurrent": false,
			            "label": "Add Product",
			            "type": "link",
			          },
			          {
			            "attrs": {
			              "class": "current",
			              "data-experimental": true,
			              "data-version": "1",
			            },
			            "badge": undefined,
			            "href": "/api/v1/products/remove/",
			            "isCurrent": false,
			            "label": "Remove Product",
			            "type": "link",
			          },
			        ],
			        "label": "products",
			        "type": "group",
			      },
			      {
			        "attrs": {
			          "class": "current",
			          "data-version": "1",
			        },
			        "badge": undefined,
			        "href": "/api/v1/users/",
			        "isCurrent": false,
			        "label": "Users API",
			        "type": "link",
			      },
			    ],
			    "label": "API v1",
			    "type": "group",
			  },
			  {
			    "badge": undefined,
			    "collapsed": false,
			    "entries": [
			      {
			        "attrs": {},
			        "badge": undefined,
			        "href": "/deprecated-api/users/",
			        "isCurrent": false,
			        "label": "Deprecated Users API",
			        "type": "link",
			      },
			    ],
			    "label": "API (deprecated)",
			    "type": "group",
			  },
			]
		`);
	});
});
