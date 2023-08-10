import { describe, expect, test, vi } from 'vitest';
import { getSidebar } from '../../utils/navigation';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Home Page' }],
			['environmental-impact.md', { title: 'Eco-friendly docs' }],
			['reference/configuration.md', { title: 'Config Reference' }],
			['reference/frontmatter.md', { title: 'Frontmatter Reference', sidebar: { hidden: true } }],
			['guides/components.mdx', { title: 'Components' }],
		],
	})
);

describe('getSidebar', () => {
	test('excludes sidebar entries with hidden: true in frontmatter', () => {
		expect(getSidebar('/', undefined)).toMatchInlineSnapshot(`
    [
      {
        "href": "/",
        "isCurrent": true,
        "label": "Home",
        "type": "link",
      },
      {
        "collapsed": false,
        "entries": [
          {
            "href": "/intro/",
            "isCurrent": false,
            "label": "Introduction",
            "type": "link",
          },
          {
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
            "href": "/reference/configuration/",
            "isCurrent": false,
            "label": "Config Reference",
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
