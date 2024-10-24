import { test as baseTest, type Page } from '@playwright/test';
import {
	DefaultTerminalReporter,
	getViolations,
	injectAxe,
	reportViolations,
} from 'axe-playwright';
import Sitemapper from 'sitemapper';

export { expect, type Locator } from '@playwright/test';

const config: Config = {
	axe: {
		// https://www.deque.com/axe/core-documentation/api-documentation/#axecore-tags
		runOnly: {
			type: 'tag',
			values: ['wcag2a', 'wcag21a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'],
		},
	},
	sitemap: {
		url: 'http://localhost:4321/sitemap-index.xml',
		exclude: {
			// A pattern to exclude URLs from the sitemap.
			pattern: /\/(de|zh-cn|fr|es|pt-br|pt-pt|it|id|ko|ru|tr|hi|da|uk)\/.*/,
			// A list of slugs to exclude from the sitemap after processing the pattern.
			slugs: [
				'components/using-components',
				'getting-started',
				'guides/customization',
				'guides/i18n',
				'guides/overriding-components',
				'guides/pages',
				'guides/project-structure',
				'guides/site-search',
				'manual-setup',
				'reference/frontmatter',
				'reference/overrides',
				'reference/plugins',
			],
		},
		replace: {
			query: 'https://starlight.astro.build',
			value: 'http://localhost:4321',
		},
	},
};

process.env.ASTRO_TELEMETRY_DISABLED = 'true';
process.env.ASTRO_DISABLE_UPDATE_CHECK = 'true';

export const test = baseTest.extend<{
	docsSite: DocsSite;
}>({
	docsSite: async ({ page }, use) => use(new DocsSite(page)),
});

// A Playwright test fixture accessible from within all tests.
class DocsSite {
	constructor(private readonly page: Page) {}

	async getAllUrls() {
		const sitemap = new Sitemapper({ url: config.sitemap.url });
		const { sites } = await sitemap.fetch();

		if (sites.length === 0) {
			throw new Error('No URLs found in sitemap.');
		}

		const urls: string[] = [];

		for (const site of sites) {
			const url = site.replace(config.sitemap.replace.query, config.sitemap.replace.value);
			if (config.sitemap.exclude.pattern.test(url)) continue;
			if (config.sitemap.exclude.slugs.some((slug) => url.endsWith(`/${slug}/`))) continue;
			urls.push(url);
		}

		return urls;
	}

	async testPage(url: string) {
		await this.page.goto(url);
		await injectAxe(this.page);
		await this.page.waitForLoadState('networkidle');
		return getViolations(this.page, undefined, config.axe);
	}

	async reportPageViolations(violations: Awaited<ReturnType<typeof this.testPage>>) {
		const url = this.page.url().replace(config.sitemap.replace.value, '');

		if (violations.length > 0) {
			console.error(`> Found ${violations.length} violations on ${url}\n`);
			await reportViolations(violations, new DefaultTerminalReporter(true, true, false));
			console.error('\n');
		} else {
			console.log(`> Found no violations on ${url}`);
		}
	}
}

interface Config {
	axe: Parameters<typeof getViolations>[2];
	sitemap: {
		url: string;
		exclude: {
			pattern: RegExp;
			slugs: string[];
		};
		replace: {
			query: string;
			value: string;
		};
	};
}
