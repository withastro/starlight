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
				'reference/configuration.mdx',
				{
					title: 'Config Reference',
					sidebar: {
						badge: {
							text: 'Experimental',
							variant: 'tip',
						},
					},
				},
			],
			['reference/frontmatter.md', { title: 'Frontmatter Reference', sidebar: { badge: 'New' } }],
			['api/v1/users.md', { title: 'Users API' }],
			['guides/project-structure.mdx', { title: 'Project Structure' }],
			['Deprecated API/users.md', { title: 'Deprecated Users API' }],
		],
	})
);

describe('getSidebar', () => {
	test('adds a badge object to the sidebar when using a "string" or "object"', () => {
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
			        "attrs": {},
			        "badge": {
			          "text": "Experimental",
			          "variant": "tip",
			        },
			        "href": "/reference/configuration/",
			        "isCurrent": false,
			        "label": "Config Reference",
			        "type": "link",
			      },
			      {
			        "attrs": {},
			        "badge": {
			          "text": "New",
			          "variant": "default",
			        },
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
