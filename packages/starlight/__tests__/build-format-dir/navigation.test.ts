import { describe, expect, test, vi } from 'vitest';
import { getSidebar } from '../../utils/navigation';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Home Page' }],
			['environmental-impact.md', { title: 'Eco-friendly docs' }],
			['reference/configuration.mdx', { title: 'Config Reference' }],
			['reference/frontmatter.md', { title: 'Frontmatter Reference' }],
			// @ts-expect-error — Using a slug not present in Starlight docs site
			['api/v1/users.md', { title: 'Users API' }],
			['guides/components.mdx', { title: 'Components' }],
		],
	})
);

describe('getSidebar with build.format = "directory"', () => {
	test('returns an array of sidebar entries with its file extension', () => {
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
			      {
			        "attrs": {},
			        "badge": undefined,
			        "href": "https://astro.build/",
			        "isCurrent": false,
			        "label": "Astro",
			        "type": "link",
			      },
			    ],
			    "label": "Start Here",
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
			]
		`);
	});
});
