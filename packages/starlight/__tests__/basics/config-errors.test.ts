import { expect, test } from 'vitest';
import { parseWithFriendlyErrors } from '../../utils/error-map';
import { StarlightConfigSchema, type StarlightUserConfig } from '../../utils/user-config';

function parseStarlightConfigWithFriendlyErrors(config: StarlightUserConfig) {
	return parseWithFriendlyErrors(
		StarlightConfigSchema,
		config,
		'Invalid config passed to starlight integration'
	);
}

test('parses bare minimum valid config successfully', () => {
	const data = parseStarlightConfigWithFriendlyErrors({ title: '' });
	expect(data).toMatchInlineSnapshot(`
		{
		  "components": {
		    "Banner": "@astrojs/starlight/components/Banner.astro",
		    "ContentPanel": "@astrojs/starlight/components/ContentPanel.astro",
		    "DraftContentNotice": "@astrojs/starlight/components/DraftContentNotice.astro",
		    "EditLink": "@astrojs/starlight/components/EditLink.astro",
		    "FallbackContentNotice": "@astrojs/starlight/components/FallbackContentNotice.astro",
		    "Footer": "@astrojs/starlight/components/Footer.astro",
		    "Head": "@astrojs/starlight/components/Head.astro",
		    "Header": "@astrojs/starlight/components/Header.astro",
		    "Hero": "@astrojs/starlight/components/Hero.astro",
		    "LanguageSelect": "@astrojs/starlight/components/LanguageSelect.astro",
		    "LastUpdated": "@astrojs/starlight/components/LastUpdated.astro",
		    "MarkdownContent": "@astrojs/starlight/components/MarkdownContent.astro",
		    "MobileMenuFooter": "@astrojs/starlight/components/MobileMenuFooter.astro",
		    "MobileMenuToggle": "@astrojs/starlight/components/MobileMenuToggle.astro",
		    "MobileTableOfContents": "@astrojs/starlight/components/MobileTableOfContents.astro",
		    "PageFrame": "@astrojs/starlight/components/PageFrame.astro",
		    "PageSidebar": "@astrojs/starlight/components/PageSidebar.astro",
		    "PageTitle": "@astrojs/starlight/components/PageTitle.astro",
		    "Pagination": "@astrojs/starlight/components/Pagination.astro",
		    "Search": "@astrojs/starlight/components/Search.astro",
		    "Sidebar": "@astrojs/starlight/components/Sidebar.astro",
		    "SiteTitle": "@astrojs/starlight/components/SiteTitle.astro",
		    "SkipLink": "@astrojs/starlight/components/SkipLink.astro",
		    "SocialIcons": "@astrojs/starlight/components/SocialIcons.astro",
		    "TableOfContents": "@astrojs/starlight/components/TableOfContents.astro",
		    "ThemeProvider": "@astrojs/starlight/components/ThemeProvider.astro",
		    "ThemeSelect": "@astrojs/starlight/components/ThemeSelect.astro",
		    "TwoColumnContent": "@astrojs/starlight/components/TwoColumnContent.astro",
		  },
		  "credits": false,
		  "customCss": [],
		  "defaultLocale": {
		    "dir": "ltr",
		    "label": "English",
		    "lang": "en",
		    "locale": undefined,
		  },
		  "disable404Route": false,
		  "editLink": {},
		  "favicon": {
		    "href": "/favicon.svg",
		    "type": "image/svg+xml",
		  },
		  "head": [],
		  "isMultilingual": false,
		  "isUsingBuiltInDefaultLocale": true,
		  "lastUpdated": false,
		  "locales": undefined,
		  "pagefind": {
		    "ranking": {
		      "pageLength": 0.1,
		      "termFrequency": 0.1,
		      "termSaturation": 2,
		      "termSimilarity": 9,
		    },
		  },
		  "pagination": true,
		  "prerender": true,
		  "routeMiddleware": [],
		  "tableOfContents": {
		    "maxHeadingLevel": 3,
		    "minHeadingLevel": 2,
		  },
		  "title": {
		    "en": "",
		  },
		  "titleDelimiter": "|",
		}
	`);
});

test('errors if title is missing', () => {
	expect(() =>
		parseStarlightConfigWithFriendlyErrors({} as any)
	).toThrowErrorMatchingInlineSnapshot(
		`
		"[AstroUserError]:
			Invalid config passed to starlight integration
		Hint:
			**title**: Did not match union.
			> Required"
		`
	);
});

test('errors if title value is not a string or an Object', () => {
	expect(() =>
		parseStarlightConfigWithFriendlyErrors({ title: 5 } as any)
	).toThrowErrorMatchingInlineSnapshot(
		`
		"[AstroUserError]:
			Invalid config passed to starlight integration
		Hint:
			**title**: Did not match union.
			> Expected type \`"string" | "object"\`, received \`"number"\`"
	`
	);
});

test('errors with bad social icon config', () => {
	expect(() =>
		parseStarlightConfigWithFriendlyErrors({ title: 'Test', social: { unknown: '' } as any })
	).toThrowErrorMatchingInlineSnapshot(
		`
		"[AstroUserError]:
			Invalid config passed to starlight integration
		Hint:
			Starlight v0.33.0 changed the \`social\` configuration syntax. Please specify an array of link items instead of an object.
			See the Starlight changelog for details: https://github.com/withastro/starlight/blob/main/packages/starlight/CHANGELOG.md#0330
			
			**social**: Expected type \`"array"\`, received \`"object"\`"
	`
	);
});

test('errors with bad logo config', () => {
	expect(() =>
		parseStarlightConfigWithFriendlyErrors({ title: 'Test', logo: { html: '' } as any })
	).toThrowErrorMatchingInlineSnapshot(
		`
		"[AstroUserError]:
			Invalid config passed to starlight integration
		Hint:
			**logo**: Did not match union.
			> Expected type \`{ src: string } | { dark: string; light: string }\`
			> Received \`{ "html": "" }\`"
	`
	);
});

test('errors with bad head config', () => {
	expect(() =>
		parseStarlightConfigWithFriendlyErrors({
			title: 'Test',
			head: [{ tag: 'unknown', attrs: { prop: null }, content: 20 } as any],
		})
	).toThrowErrorMatchingInlineSnapshot(
		`
		"[AstroUserError]:
			Invalid config passed to starlight integration
		Hint:
			**head.0.tag**: Invalid enum value. Expected 'title' | 'base' | 'link' | 'style' | 'meta' | 'script' | 'noscript' | 'template', received 'unknown'
			**head.0.attrs.prop**: Did not match union.
			> Expected type \`"string" | "boolean" | "undefined"\`, received \`"null"\`
			**head.0.content**: Expected type \`"string"\`, received \`"number"\`"
	`
	);
});

test('errors with bad sidebar config', () => {
	expect(() =>
		parseStarlightConfigWithFriendlyErrors({
			title: 'Test',
			sidebar: [{ label: 'Example', href: '/' } as any],
		})
	).toThrowErrorMatchingInlineSnapshot(
		`
		"[AstroUserError]:
			Invalid config passed to starlight integration
		Hint:
			**sidebar.0**: Did not match union.
			> Expected type \`{ link: string;  } | { items: array;  } | { autogenerate: object;  } | { slug: string } | string\`
			> Received \`{ "label": "Example", "href": "/" }\`"
	`
	);
});

test('errors with bad nested sidebar config', () => {
	expect(() =>
		parseStarlightConfigWithFriendlyErrors({
			title: 'Test',
			sidebar: [
				{
					label: 'Example',
					items: [
						{ label: 'Nested Example 1', link: '/' },
						{ label: 'Nested Example 2', link: true },
					],
				} as any,
			],
		})
	).toThrowErrorMatchingInlineSnapshot(`
		"[AstroUserError]:
			Invalid config passed to starlight integration
		Hint:
			**sidebar.0.items.1**: Did not match union.
			> Expected type \`{ link: string } | { items: array;  } | { autogenerate: object;  } | { slug: string } | string\`
			> Received \`{ "label": "Example", "items": [ { "label": "Nested Example 1", "link": "/" }, { "label": "Nested Example 2", "link": true } ] }\`"
	`);
});

test('errors with sidebar entry that includes `link` and `items`', () => {
	expect(() =>
		parseStarlightConfigWithFriendlyErrors({
			title: 'Test',
			sidebar: [
				{ label: 'Parent', link: '/parent', items: [{ label: 'Child', link: '/parent/child' }] },
			],
		})
	).toThrowErrorMatchingInlineSnapshot(`
		"[AstroUserError]:
			Invalid config passed to starlight integration
		Hint:
			**sidebar.0**: Unrecognized key(s) in object: 'items'"
	`);
});

test('errors with sidebar entry that includes `link` and `autogenerate`', () => {
	expect(() =>
		parseStarlightConfigWithFriendlyErrors({
			title: 'Test',
			sidebar: [{ label: 'Parent', link: '/parent', autogenerate: { directory: 'test' } }],
		})
	).toThrowErrorMatchingInlineSnapshot(`
		"[AstroUserError]:
			Invalid config passed to starlight integration
		Hint:
			**sidebar.0**: Unrecognized key(s) in object: 'autogenerate'"
	`);
});

test('errors with sidebar entry that includes `items` and `autogenerate`', () => {
	expect(() =>
		parseStarlightConfigWithFriendlyErrors({
			title: 'Test',
			sidebar: [
				{
					label: 'Parent',
					items: [{ label: 'Child', link: '/parent/child' }],
					autogenerate: { directory: 'test' },
				},
			],
		})
	).toThrowErrorMatchingInlineSnapshot(`
		"[AstroUserError]:
			Invalid config passed to starlight integration
		Hint:
			**sidebar.0**: Unrecognized key(s) in object: 'autogenerate'"
	`);
});

test('parses route middleware config successfully', () => {
	const data = parseStarlightConfigWithFriendlyErrors({
		title: '',
		routeMiddleware: './src/routeData.ts',
	});
	expect(data.routeMiddleware).toEqual(['./src/routeData.ts']);
});

test('errors if a route middleware path will conflict with Astro middleware', () => {
	expect(() =>
		parseStarlightConfigWithFriendlyErrors({
			title: 'Test',
			routeMiddleware: ['./src/middleware.ts', './src/routeData.ts'],
		})
	).toThrowErrorMatchingInlineSnapshot(
		`
		"[AstroUserError]:
			Invalid config passed to starlight integration
		Hint:
			The \`"./src/middleware.ts"\` path in your Starlight \`routeMiddleware\` config conflicts with Astro’s middleware locations.
			
			You should rename \`./src/middleware.ts\` to something else like \`./src/starlightRouteData.ts\` and update the \`routeMiddleware\` file path to match.
			
			- More about Starlight route middleware: https://starlight.astro.build/guides/route-data/#how-to-customize-route-data
			- More about Astro middleware: https://docs.astro.build/en/guides/middleware/"
		`
	);
});
