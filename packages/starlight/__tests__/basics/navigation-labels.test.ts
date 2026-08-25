import { describe, expect, test, vi } from 'vitest';
import { getSidebar } from '../../utils/navigation';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Home Page' }],
			[
				'environmental-impact.md',
				{ title: 'Eco-friendly docs', sidebar: { label: 'Environmental impact' } },
			],
			['guides/authoring-content.mdx', { title: 'Authoring Markdown' }],
			[
				'guides/project-structure.mdx',
				{ title: 'Project Structure', sidebar: { label: 'Structure' } },
			],
		],
	})
);

describe('getSidebar', () => {
	test('returns sidebar entries sorted by frontmatter order', () => {
		expect(getSidebar('/', undefined)).toMatchInlineSnapshot(`
			[
			  {
			    "attrs": {},
			    "autogenerate": {
			      "directory": "",
			    },
			    "badge": undefined,
			    "href": "/",
			    "isCurrent": true,
			    "label": "Home Page",
			    "type": "link",
			  },
			  {
			    "attrs": {},
			    "autogenerate": {
			      "directory": "",
			    },
			    "badge": undefined,
			    "href": "/environmental-impact/",
			    "isCurrent": false,
			    "label": "Environmental impact",
			    "type": "link",
			  },
			  {
			    "autogenerate": {
			      "directory": "",
			    },
			    "badge": undefined,
			    "collapsed": false,
			    "entries": [
			      {
			        "attrs": {},
			        "autogenerate": {
			          "directory": "",
			        },
			        "badge": undefined,
			        "href": "/guides/authoring-content/",
			        "isCurrent": false,
			        "label": "Authoring Markdown",
			        "type": "link",
			      },
			      {
			        "attrs": {},
			        "autogenerate": {
			          "directory": "",
			        },
			        "badge": undefined,
			        "href": "/guides/project-structure/",
			        "isCurrent": false,
			        "label": "Structure",
			        "type": "link",
			      },
			    ],
			    "label": "guides",
			    "type": "group",
			  },
			]
		`);
	});
});
