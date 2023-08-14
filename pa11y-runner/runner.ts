import { bold, cyan, dim, green, red, underline } from 'kleur/colors';
import pa11y from 'pa11y';
import puppeteer from 'puppeteer';
import Sitemapper from 'sitemapper';
import wrap from 'word-wrap';

const config: Config = {
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
 * A simplified re-implementation of the `pa11y-ci` CLI utility to run Pa11y on a list of URLs for
 * a specific color scheme.
 * The color scheme to use is specified via the `COLOR_SCHEME` environment variable.
 * @see https://github.com/pa11y/pa11y-ci
 */
async function main() {
	if (process.env.COLOR_SCHEME !== 'dark' && process.env.COLOR_SCHEME !== 'light') {
		console.info(red('The COLOR_SCHEME environment variable must be set to "dark" or "light".'));
		process.exit(1);
	}

	const urls = await getUrls();

	await runPa11yOnUrls(urls, process.env.COLOR_SCHEME);
}

/** Runs Pa11y on a list of URLs. */
async function runPa11yOnUrls(urls: string[], colorScheme: ColorScheme) {
	console.info(cyan(`Running Pa11y on ${urls.length} URLs - ${colorScheme} color scheme:\n`));

	let browser: Pa11yBrowser | undefined;
	let results: Results = new Map();
	let issueCount = 0;

	try {
		browser = await getPa11yBrowser(colorScheme);

		for (const url of urls) {
			const { count, result } = await runPa11yOnUrl(url, browser);

			results.set(url, result);
			issueCount += count;
		}

		if (issueCount === 0) {
			console.info(green(bold('\nNo issues found.')));
		} else {
			reportErrors(issueCount, results, colorScheme);

			process.exit(1);
		}
	} finally {
		await browser?.browser?.close();
	}
}

/** Runs Pa11y on a specific URL. */
async function runPa11yOnUrl(url: string, browser: Pa11yBrowser) {
	const result = await pa11y(url, { ...browser, runners: ['axe'] });
	const count = result.issues.length;

	const color = count === 0 ? green : red;
	console.info(` ${cyan('>')} ${url} - ${color(`${count} errors`)}`);

	return { count, result };
}

/** Reports Pa11y test results to the console. */
function reportErrors(issues: number, results: Results, colorScheme: ColorScheme) {
	console.info(red(`\nFound ${issues} issues in ${results.size} URLs.`));

	for (const [url, result] of results) {
		if (result.issues.length === 0) {
			continue;
		}

		console.error(
			underline(
				`\nFound ${result.issues.length} issues in ${url} - ${bold(`${colorScheme} color scheme:`)}`
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

/** Wraps a text to a specific width. */
function wrapText(text: string) {
	return wrap(text, { indent: '   ', width: config.wrapWidth });
}

/** Returns an incognito browser browser and page to run Pa11y using the specified color scheme. */
async function getPa11yBrowser(colorScheme: ColorScheme): Promise<Pa11yBrowser> {
	const browser = await puppeteer.launch();
	const context = await browser.createIncognitoBrowserContext();
	const page = await context.newPage();
	await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: colorScheme }]);

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
type Results = Map<string, Pa11yResults>;

type Pa11yOptions = NonNullable<Parameters<typeof pa11y>[1]>;
type Pa11yBrowser = {
	browser: NonNullable<Pa11yOptions['browser']>;
	page: NonNullable<Pa11yOptions['page']>;
};
type Pa11yResults = Awaited<ReturnType<typeof pa11y>>;
