import { describe, expect, test, vi } from 'vitest';
import { getSidebar } from '../../utils/navigation';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Home Page' }],
			['environmental-impact.md', { title: 'Eco-friendly docs' }],
			['resources/plugins.mdx', { title: 'Plugins' }],
			['resources/themes.mdx', { title: 'Themes' }],
			['reference/configuration.mdx', { title: 'Config Reference' }],
			['reference/frontmatter.md', { title: 'Frontmatter Reference' }],
			['api/v1/用户.md', { title: 'Path with non-ASCII characters' }],
			['guides/project-structure.mdx', { title: 'Project Structure' }],
			['Deprecated API/用户.md', { title: 'Another path with non-ASCII characters' }],
		],
	})
);

describe('getSidebar', () => {
	test('matches current page when path contains non-ascii characters', () => {
		expect(getSidebar('/api/v1/%E7%94%A8%E6%88%B7', undefined)).toMatchInlineSnapshot(`
			[
			  {
			    "attrs": {},
			    "badge": undefined,
			    "href": "/",
			    "isCurrent": false,
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
			        "attrs": {},
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
			        "attrs": {
			          "class": "current",
			          "data-version": "1",
			        },
			        "badge": undefined,
			        "href": "/api/v1/用户/",
			        "isCurrent": true,
			        "label": "Path with non-ASCII characters",
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
			        "href": "/deprecated-api/用户/",
			        "isCurrent": false,
			        "label": "Another path with non-ASCII characters",
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
