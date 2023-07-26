import { describe, expect, test, vi } from 'vitest';
import { getSidebar } from '../../utils/navigation';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Home Page' }],
			['environmental-impact.md', { title: 'Eco-friendly docs' }],
			['reference/configuration.md', { title: 'Config Reference' }],
			['reference/frontmatter.md', { title: 'Frontmatter Reference' }],
			['guides/components.mdx', { title: 'Components' }],
		],
	})
);

describe('getSidebar with basePath', () => {
	test('returns an array of sidebar entries', () => {
		expect(getSidebar('/', undefined)).toMatchInlineSnapshot(`
      [
        {
          "href": "/test/",
          "isCurrent": true,
          "label": "Home",
          "type": "link",
        },
        {
          "collapsed": false,
          "entries": [
            {
              "href": "/test/intro/",
              "isCurrent": false,
              "label": "Introduction",
              "type": "link",
            },
            {
              "href": "/test/next-steps/",
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
              "href": "/test/reference/configuration/",
              "isCurrent": false,
              "label": "Config Reference",
              "type": "link",
            },
            {
              "href": "/test/reference/frontmatter/",
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
