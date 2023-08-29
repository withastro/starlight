import { describe, expect, test, vi } from 'vitest';
import { getSidebar } from '../../utils/navigation';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Home Page' }],
			['environmental-impact.md', { title: 'Eco-friendly docs' }],
			[
				'reference/configuration.md',
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
			['guides/components.mdx', { title: 'Components' }],
		],
	})
);

describe('getSidebar', () => {
	test('adds a badge object to the sidebar when using a "string" or "object"', () => {
		expect(getSidebar('/', undefined)).toMatchInlineSnapshot(`
			[
			  {
			    "badge": undefined,
			    "href": "/",
			    "isCurrent": true,
			    "label": "Home",
			    "type": "link",
			  },
			  {
			    "collapsed": false,
			    "entries": [
			      {
			        "badge": {
			          "text": "New",
			          "variant": "success",
			        },
			        "href": "/intro/",
			        "isCurrent": false,
			        "label": "Introduction",
			        "type": "link",
			      },
			      {
			        "badge": {
			          "text": "Deprecated",
			          "variant": "default",
			        },
			        "href": "/next-steps/",
			        "isCurrent": false,
			        "label": "Next Steps",
			        "type": "link",
			      },
			    ],
			    "label": "Start Here",
			    "type": "group",
			  },
			  {
			    "collapsed": false,
			    "entries": [
			      {
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
			]
		`);
	});
});
