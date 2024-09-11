import fs from 'node:fs/promises';
import path from 'node:path';
import { expect, test, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const prodUrl = new URL('https://starlight.astro.build');

// A list of all the routes to visually compare between the production and development environments.
// This could be based on the sitemap but it was not worth the effort for this PR.
const routePaths = [
	'/',
	'/getting-started/',
	'/manual-setup/',
	'/environmental-impact/',
	'/guides/pages/',
	'/guides/authoring-content/',
	'/guides/components/',
	'/guides/css-and-tailwind/',
	'/guides/customization/',
	'/guides/i18n/',
	'/guides/overriding-components/',
	'/guides/sidebar/',
	'/guides/site-search/',
	'/reference/configuration/',
	'/resources/plugins/',
	'/resources/community-content/',
	'/resources/showcase/',
];

// The maximum number of mismatched pixels between the production and development screenshots.
const maxDiffPixels = 10;

for (const routePath of routePaths) {
	test.only(`CSS Layers: ${routePath}`, async ({ page }) => {
		const prodScreenshotPath = getScreenshotPath(routePath, 'prod');

		// Take a screenshot of the production route if it doesn't exist.
		if (!(await exists(prodScreenshotPath))) {
			await page.goto(new URL(routePath, prodUrl).toString());
			await takeScreenshot(page, prodScreenshotPath);
		}

		const devScreenshotPath = getScreenshotPath(routePath, 'dev');

		// Take a screenshot of the development route.
		await page.goto(routePath);
		await takeScreenshot(page, devScreenshotPath);

		// Compare the screenshots between the production and development routes.
		const { diffPixels, diffImage } = await compareScreenshots(
			prodScreenshotPath,
			devScreenshotPath
		);

		// Save the diff image if the number of mismatched pixels is greater than the maximum allowed.
		if (diffPixels >= maxDiffPixels) {
			await fs.writeFile(getScreenshotPath(routePath, 'diff'), PNG.sync.write(diffImage));
		}

		// Assert the number of mismatched pixels is less than the maximum allowed.
		expect(diffPixels).toBeLessThan(maxDiffPixels);
	});
}

async function compareScreenshots(screenshotPath1: string, screenshotPath2: string) {
	let screenshot1: PNG = await getScreenshot(screenshotPath1);
	let screenshot2: PNG = await getScreenshot(screenshotPath2);

	let diffSize: ScreenshotSize;

	// If the screenshots have different dimensions, resize them to the largest dimensions so we can
	// see where the differences start to appear.
	if (screenshot1.width !== screenshot2.width || screenshot1.height !== screenshot2.height) {
		diffSize = {
			width: Math.max(screenshot1.width, screenshot2.width),
			height: Math.max(screenshot1.height, screenshot2.height),
		};

		screenshot1 = resizeScreenshot(screenshot1, diffSize);
		screenshot2 = resizeScreenshot(screenshot2, diffSize);
	} else {
		diffSize = { width: screenshot1.width, height: screenshot1.height };
	}

	const diffImage = new PNG(diffSize);

	const diffPixels = pixelmatch(
		screenshot1.data,
		screenshot2.data,
		diffImage.data,
		diffSize.width,
		diffSize.height,
		{ threshold: 0.1 }
	);

	return { diffPixels, diffImage };
}

function resizeScreenshot(screenshot: PNG, size: ScreenshotSize) {
	const resized = new PNG(size);
	PNG.bitblt(screenshot, resized, 0, 0, screenshot.width, screenshot.height);
	return resized;
}

async function getScreenshot(screenshotPath: string) {
	const data = await fs.readFile(screenshotPath);
	return PNG.sync.read(data);
}

async function takeScreenshot(page: Page, screenshotPath: string) {
	// Ensure all images are loaded before taking the screenshot.
	for (const lazyImage of await page.locator('img[loading="lazy"]:visible').all()) {
		await lazyImage.scrollIntoViewIfNeeded();
	}

	const overviewLink = page.getByRole('link', { name: 'Overview', exact: true });

	// Scroll to the top of the page to ensure the screenshot is consistent.
	if (await overviewLink.isVisible()) {
		// Use the Overview link when possible to avoid mismatched pixels due to ToC highlighting.
		overviewLink.click();
	} else {
		await page.evaluate(() => window.scrollTo(0, 0));
	}
	await page.waitForTimeout(500);

	await page.screenshot({ path: screenshotPath, fullPage: true });
}

function getScreenshotPath(routePath: string, type: ScreenshotType) {
	return path.join(
		'screenshots',
		type,
		routePath.replace(/\//g, '-').replace(/^-/, '').replace(/-$/, '').replace(/^$/, 'index') +
			'.png'
	);
}

async function exists(filePath: string) {
	try {
		await fs.access(filePath, fs.constants.F_OK);
		return true;
	} catch {
		return false;
	}
}

type ScreenshotType = 'dev' | 'prod' | 'diff';

interface ScreenshotSize {
	width: number;
	height: number;
}
