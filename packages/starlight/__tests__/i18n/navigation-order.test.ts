import { describe, expect, test, vi } from 'vitest';
import { getSidebar } from '../../utils/navigation';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['fr/index.mdx', { title: 'Accueil' }],
			// @ts-expect-error — Using a slug not present in Starlight docs site
			['en/index.mdx', { title: 'Home page', sidebar: { order: 1 } }],
			// @ts-expect-error — Using a slug not present in Starlight docs site
			['ar/index.mdx', { title: 'الصفحة الرئيسية' }],
			// @ts-expect-error — Using a slug not present in Starlight docs site
			['en/guides/authoring-content.md', { title: 'Authoring Markdown' }],
			// @ts-expect-error — Using a slug not present in Starlight docs site
			['en/404.md', { title: 'Not found' }],
			// @ts-expect-error — Using a slug not present in Starlight docs site
			['fr/route/distribuer.mdx', { title: 'Distribuer' }],
			// @ts-expect-error — Using a slug not present in Starlight docs site
			['fr/route/décoder.mdx', { title: 'Décoder' }],
			// @ts-expect-error — Using a slug not present in Starlight docs site
			['fr/référence/bricolage.mdx', { title: 'Bricolage' }],
			// @ts-expect-error — Using a slug not present in Starlight docs site
			['fr/référence/bénéfice.mdx', { title: 'Bénéfice' }],
		],
	})
);

describe('getSidebar', () => {
	test('returns sidebar entries sorted by frontmatter order', () => {
		expect(getSidebar('/en/', 'en')).toMatchInlineSnapshot(`
			[
			  {
			    "badge": undefined,
			    "href": "/en/",
			    "isCurrent": true,
			    "label": "Home page",
			    "type": "link",
			  },
			  {
			    "badge": undefined,
			    "href": "/en/404/",
			    "isCurrent": false,
			    "label": "Not found",
			    "type": "link",
			  },
			  {
			    "collapsed": false,
			    "entries": [
			      {
			        "badge": undefined,
			        "href": "/en/guides/authoring-content/",
			        "isCurrent": false,
			        "label": "Authoring Markdown",
			        "type": "link",
			      },
			    ],
			    "label": "guides",
			    "type": "group",
			  },
			]
		`);
	});

	test('uses the locale when sorting autogenerated sidebar entries', () => {
		expect(getSidebar('/fr/', 'fr')).toMatchInlineSnapshot(`
			[
			  {
			    "href": "/fr/",
			    "isCurrent": true,
			    "label": "Accueil",
			    "type": "link",
			  },
			  {
			    "href": "/fr/404/",
			    "isCurrent": false,
			    "label": "Not found",
			    "type": "link",
			  },
			  {
			    "collapsed": false,
			    "entries": [
			      {
			        "href": "/fr/guides/authoring-content/",
			        "isCurrent": false,
			        "label": "Authoring Markdown",
			        "type": "link",
			      },
			    ],
			    "label": "guides",
			    "type": "group",
			  },
			  {
			    "collapsed": false,
			    "entries": [
			      {
			        "href": "/fr/référence/bénéfice/",
			        "isCurrent": false,
			        "label": "Bénéfice",
			        "type": "link",
			      },
			      {
			        "href": "/fr/référence/bricolage/",
			        "isCurrent": false,
			        "label": "Bricolage",
			        "type": "link",
			      },
			    ],
			    "label": "référence",
			    "type": "group",
			  },
			  {
			    "collapsed": false,
			    "entries": [
			      {
			        "href": "/fr/route/décoder/",
			        "isCurrent": false,
			        "label": "Décoder",
			        "type": "link",
			      },
			      {
			        "href": "/fr/route/distribuer/",
			        "isCurrent": false,
			        "label": "Distribuer",
			        "type": "link",
			      },
			    ],
			    "label": "route",
			    "type": "group",
			  },
			]
		`);
	});
});
