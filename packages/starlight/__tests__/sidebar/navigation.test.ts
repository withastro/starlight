import { describe, expect, test, vi } from 'vitest';
import { getSidebar } from '../../utils/navigation';
import type { SidebarEntry } from '../../utils/routing/types';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Home Page' }],
			['environmental-impact.md', { title: 'Eco-friendly docs' }],
			['resources/plugins.mdx', { title: 'Plugins' }],
			['resources/themes.mdx', { title: 'Themes' }],
			['reference/configuration.mdx', { title: 'Config Reference' }],
			['reference/frontmatter.md', { title: 'Frontmatter Reference' }],
			['reference/frontmatter/foo.mdx', { title: 'Foo' }],
			['api/v1/users.md', { title: 'Users API' }],
			['guides/project-structure.mdx', { title: 'Project Structure' }],
			['Deprecated API/users.md', { title: 'Deprecated Users API' }],
		],
	})
);

describe('getSidebar', () => {
	test('returns an array of sidebar entries', () => {
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
			        "badge": undefined,
			        "href": "/reference/configuration/",
			        "isCurrent": false,
			        "label": "Config Reference",
			        "type": "link",
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
			          {
			            "attrs": {},
			            "badge": undefined,
			            "href": "/reference/frontmatter/foo/",
			            "isCurrent": false,
			            "label": "Foo",
			            "type": "link",
			          },
			        ],
			        "label": "frontmatter",
			        "type": "group",
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
			        "attrs": {},
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

	test("ensures trailing slash consistency between internal and auto-generated sidebar links when using `trailingSlash: 'ignore'`", () => {
		const sidebar = getSidebar('/', undefined);
		const internalLinksGroup = sidebar.at(2);
		const autoGeneratedLinksGroup = sidebar.at(3);

		function includesOnlyLinksWithTrailingSlash(entry: SidebarEntry | undefined): boolean {
			return (
				entry !== undefined &&
				((entry.type === 'link' && entry.href.endsWith('/')) ||
					(entry.type === 'group' && entry.entries.every(includesOnlyLinksWithTrailingSlash)))
			);
		}

		expect(includesOnlyLinksWithTrailingSlash(internalLinksGroup)).toBe(true);
		expect(includesOnlyLinksWithTrailingSlash(autoGeneratedLinksGroup)).toBe(true);
	});
});
