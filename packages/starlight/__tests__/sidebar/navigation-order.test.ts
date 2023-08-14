import { describe, expect, test, vi } from 'vitest';
import { getSidebar } from '../../utils/navigation';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Home Page' }],
			['environmental-impact.md', { title: 'Eco-friendly docs' }],
			['reference/configuration.md', { title: 'Config Reference' }],
			['reference/frontmatter.md', { title: 'Frontmatter Reference', sidebar: { order: 1 } }],
			['guides/components.mdx', { title: 'Components' }],
		],
	})
);

describe('getSidebar', () => {
	test('returns sidebar entries sorted by frontmatter order', () => {
		expect(getSidebar('/', undefined)).toMatchInlineSnapshot(`
			[
			  {
			    "href": "/",
			    "isCurrent": true,
			    "label": "Home",
			    "target": "_self",
			    "type": "link",
			  },
			  {
			    "collapsed": false,
			    "entries": [
			      {
			        "href": "/intro/",
			        "isCurrent": false,
			        "label": "Introduction",
			        "target": "_self",
			        "type": "link",
			      },
			      {
			        "href": "/next-steps/",
			        "isCurrent": false,
			        "label": "Next Steps",
			        "target": "_self",
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
			        "href": "/reference/frontmatter/",
			        "isCurrent": false,
			        "label": "Frontmatter Reference",
			        "target": "_self",
			        "type": "link",
			      },
			      {
			        "href": "/reference/configuration/",
			        "isCurrent": false,
			        "label": "Config Reference",
			        "target": "_self",
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
