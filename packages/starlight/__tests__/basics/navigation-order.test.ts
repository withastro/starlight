import { describe, expect, test, vi } from 'vitest';
import { getSidebar } from '../../utils/navigation';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Home Page' }],
			['environmental-impact.md', { title: 'Eco-friendly docs', sidebar: { order: 1 } }],
			['guides/authoring-content.mdx', { title: 'Authoring Markdown' }],
			['guides/project-structure.mdx', { title: 'Project Structure', sidebar: { order: 0 } }],
		],
	})
);

describe('getSidebar', () => {
	test('returns sidebar entries sorted by frontmatter order', () => {
		expect(getSidebar('/', undefined)).toMatchInlineSnapshot(`
			[
			  {
			    "badge": undefined,
			    "collapsed": false,
			    "entries": [
			      {
			        "attrs": {},
			        "badge": undefined,
			        "href": "/guides/project-structure/",
			        "isCurrent": false,
			        "label": "Project Structure",
			        "type": "link",
			      },
			      {
			        "attrs": {},
			        "badge": undefined,
			        "href": "/guides/authoring-content/",
			        "isCurrent": false,
			        "label": "Authoring Markdown",
			        "type": "link",
			      },
			    ],
			    "label": "guides",
			    "type": "group",
			  },
			  {
			    "attrs": {},
			    "badge": undefined,
			    "href": "/environmental-impact/",
			    "isCurrent": false,
			    "label": "Eco-friendly docs",
			    "type": "link",
			  },
			  {
			    "attrs": {},
			    "badge": undefined,
			    "href": "/",
			    "isCurrent": true,
			    "label": "Home Page",
			    "type": "link",
			  },
			]
		`);
	});
});
