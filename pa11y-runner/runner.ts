import { bold, cyan, dim, green, red, underline } from 'kleur/colors';
import pa11y from 'pa11y';
import puppeteer from 'puppeteer';
import Sitemapper from 'sitemapper';
import wrap from 'word-wrap';

const config: Config = {
	colorSchemes: ['dark', 'light'],
	sitemap: {
		url: 'http://localhost:3000/sitemap-index.xml',
		exclude: /\/(de|zh|fr|es|pt-br|it)\/.*/,
		replace: {
			query: 'https://starlight.astro.build',
			value: 'http://localhost:3000',
		},
	},
	wrapWidth: 80,
};

/**
 * A simplified re-implementation of the `pa11y-ci` CLI utility to run Pa11y on a list of URLs on
 * multiple color schemes.
 * @see https://github.com/pa11y/pa11y-ci
 */
async function main() {
	const urls = await getUrls();

	await runPa11yOnUrls(urls);
}

/** Runs Pa11y on a list of URLs. */
async function runPa11yOnUrls(urls: string[]) {
	console.info(cyan(`Running Pa11y on ${urls.length} URLs:\n`));

	let browser: Pa11yBrowser | undefined;
	let results: ResultsByColorScheme = new Map();
	let totalIssues = 0;

	try {
		browser = await getPa11yBrowser();

		for (const url of urls) {
			const { issues, results: urlResults } = await runPa11yOnUrl(url, browser);

			results.set(url, urlResults);
			totalIssues += issues;
		}

		if (totalIssues === 0) {
			console.info(green(bold('\nNo issues found.')));
		} else {
			reportResults(totalIssues, results);

			process.exit(1);
		}
	} finally {
		await browser?.browser?.close();
	}
}

/** Runs Pa11y on a specific URL. */
async function runPa11yOnUrl(url: string, browser: Pa11yBrowser) {
	const results: ResultByColorScheme = new Map();
	let issues = 0;

	for (const scheme of config.colorSchemes) {
		const result = await runPa11yOnUrlWithColorScheme(url, browser, scheme);

		issues += result.issues.length;
		results.set(scheme, result);
	}

	const color = issues === 0 ? green : red;
	console.info(` ${cyan('>')} ${url} - ${color(`${issues} errors`)}`);

	return { issues, results };
}

/** Runs Pa11y on a specific URL with a specific color scheme. */
async function runPa11yOnUrlWithColorScheme(
	url: string,
	{ browser, page }: Pa11yBrowser,
	scheme: ColorScheme
) {
	await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }]);

	return pa11y(url, { browser, page, runners: ['axe'] });
}

/** Reports Pa11y test results to the console. */
function reportResults(issues: number, results: ResultsByColorScheme) {
	console.info(red(`\nFound ${issues} issues in ${results.size} URLs.`));

	for (const [url, resultsByColorScheme] of results) {
		for (const [scheme, result] of resultsByColorScheme) {
			if (result.issues.length === 0) {
				continue;
			}

			console.error(
				underline(
					`\nFound ${result.issues.length} issues in ${url} - ${bold(`${scheme} color scheme:`)}`
				)
			);

			for (const issue of result.issues) {
				console.error(
					[
						`\n ${red('•')} ${wrapText(issue.message).trim()}`,
						`\n${wrapText(dim(`(${issue.selector})`))}`,
						`\n${wrapText(
							dim(issue.context ? issue.context.replaceAll(/\s+/g, ' ') : 'No context available')
						)}`,
					].join('\n')
				);
			}
		}
	}
}

/** Wraps a text to a specific width. */
function wrapText(text: string) {
	return wrap(text, { indent: '   ', width: config.wrapWidth });
}

/** Returns an incognito browser browser and page to run Pa11y on. */
async function getPa11yBrowser(): Promise<Pa11yBrowser> {
	const browser = await puppeteer.launch();
	const context = await browser.createIncognitoBrowserContext();
	const page = await context.newPage();

	// @ts-expect-error - @types/pa11y community types are using @types/puppeteer v5.4.X which does
	// not match pa11y requirements.
	return { browser, page };
}

/** Returns a list of URLs to run Pa11y on based on a sitemap. */
async function getUrls() {
	const { replace, url } = config.sitemap;

	const sitemap = new Sitemapper({ url });
	const { sites } = await sitemap.fetch();

	if (sites.length === 0) {
		throw new Error('No URLs found in sitemap.');
	}

	return sites
		.map((url) => url.replace(replace.query, replace.value))
		.filter((url) => !config.sitemap.exclude.test(url));
}

main();

interface Config {
	colorSchemes: ColorScheme[];
	sitemap: {
		url: string;
		exclude: RegExp;
		replace: {
			query: string;
			value: string;
		};
	};
	wrapWidth: number;
}

type ColorScheme = 'dark' | 'light';
type ResultByColorScheme = Map<ColorScheme, Pa11yResults>;
type ResultsByColorScheme = Map<string, ResultByColorScheme>;

type Pa11yOptions = NonNullable<Parameters<typeof pa11y>[1]>;
type Pa11yBrowser = {
	browser: NonNullable<Pa11yOptions['browser']>;
	page: NonNullable<Pa11yOptions['page']>;
};
type Pa11yResults = Awaited<ReturnType<typeof pa11y>>;
