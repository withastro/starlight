import { expect, test } from 'vitest';
import { parseStarlightConfigWithFriendlyErrors } from '../../utils/user-config';

test('parses valid config successfully', () => {
	const data = parseStarlightConfigWithFriendlyErrors({ title: '' });
	expect(data).toMatchInlineSnapshot(`
		{
		  "components": {
		    "Banner": "@astrojs/starlight/components/Banner.astro",
		    "ContentPanel": "@astrojs/starlight/components/ContentPanel.astro",
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
		  "customCss": [],
		  "defaultLocale": {
		    "dir": "ltr",
		    "label": "English",
		    "lang": "en",
		    "locale": undefined,
		  },
		  "editLink": {},
		  "favicon": {
		    "href": "/favicon.svg",
		    "type": "image/svg+xml",
		  },
		  "head": [],
		  "isMultilingual": false,
		  "lastUpdated": false,
		  "locales": undefined,
		  "pagination": true,
		  "tableOfContents": {
		    "maxHeadingLevel": 3,
		    "minHeadingLevel": 2,
		  },
		  "title": "",
		  "titleDelimiter": "|",
		}
	`);
});

test('errors if title is missing', () => {
	expect(() => parseStarlightConfigWithFriendlyErrors({} as any))
		.toThrowErrorMatchingInlineSnapshot(`
"Invalid config passed to starlight integration
**title**: Required"
`);
});

test('errors if title value is not a string', () => {
	expect(() => parseStarlightConfigWithFriendlyErrors({ title: 5 } as any))
		.toThrowErrorMatchingInlineSnapshot(`
"Invalid config passed to starlight integration
**title**: Expected type \`\\"string\\"\`, received \\"number\\""
		`);
});

test('errors with bad social icon config', () => {
	expect(() =>
		parseStarlightConfigWithFriendlyErrors({ title: 'Test', social: { unknown: '' } as any })
	).toThrowErrorMatchingInlineSnapshot(`
"Invalid config passed to starlight integration
**social.unknown**: Invalid enum value. Expected 'twitter' | 'mastodon' | 'github' | 'gitlab' | 'bitbucket' | 'discord' | 'gitter' | 'codeberg' | 'codePen' | 'youtube' | 'threads' | 'linkedin' | 'twitch' | 'microsoftTeams' | 'instagram' | 'stackOverflow' | 'x.com' | 'telegram' | 'rss' | 'facebook' | 'email' | 'reddit' | 'patreon', received 'unknown'
**social.unknown**: Invalid url"
	`);
});

test('errors with bad logo config', () => {
	expect(() => parseStarlightConfigWithFriendlyErrors({ title: 'Test', logo: { html: '' } as any }))
		.toThrowErrorMatchingInlineSnapshot(`
"Invalid config passed to starlight integration
**logo**: Did not match union:
> Expected type \`{ src: string } | { dark: string; light: string }\`
> Received {\\"html\\":\\"\\"}"
		`);
});

test('errors with bad head config', () => {
	expect(() =>
		parseStarlightConfigWithFriendlyErrors({
			title: 'Test',
			head: [{ tag: 'unknown', attrs: { prop: null }, content: 20 } as any],
		})
	).toThrowErrorMatchingInlineSnapshot(`
"Invalid config passed to starlight integration
**head.0.tag**: Invalid enum value. Expected 'title' | 'base' | 'link' | 'style' | 'meta' | 'script' | 'noscript' | 'template', received 'unknown'
**head.0.attrs.prop**: Did not match union:
> Expected type \`\\"string\\" | \\"boolean\\" | \\"undefined\\"\`, received \\"null\\"
**head.0.content**: Expected type \`\\"string\\"\`, received \\"number\\""
	`);
});

test('errors with bad sidebar config', () => {
	expect(() =>
		parseStarlightConfigWithFriendlyErrors({
			title: 'Test',
			sidebar: [{ label: 'Example', href: '/' } as any],
		})
	).toThrowErrorMatchingInlineSnapshot(`
"Invalid config passed to starlight integration
**sidebar.0**: Did not match union:
> Expected type \`{ link: string } | { items: array } | { autogenerate: object }\`
> Received {\\"label\\":\\"Example\\",\\"href\\":\\"/\\"}"
	`);
});
