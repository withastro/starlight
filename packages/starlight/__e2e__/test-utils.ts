import { fileURLToPath } from 'node:url';
import { test as baseTest, type Page } from '@playwright/test';
import { dev } from 'astro';

export { expect, type Locator } from '@playwright/test';

// Setup a test environment that will start a dev server for a given fixture path and provide a
// Starlight Playwright fixture accessible from within all tests.
export async function testFactory(fixturePath: string) {
	let devServer: DevServer | undefined;

	const test = baseTest.extend<{ starlight: StarlightPage }>({
		starlight: async ({ page }, use) => {
			if (!devServer) {
				throw new Error('Could not find a dev server to run tests against.');
			}

			await use(new StarlightPage(devServer, page));
		},
	});

	test.beforeAll(async () => {
		devServer = await dev({
			logLevel: 'error',
			root: fileURLToPath(new URL(fixturePath, import.meta.url)),
			devToolbar: { enabled: false },
		});
	});

	test.afterAll(async () => {
		await devServer?.stop();
	});

	return test;
}

// A Playwright test fixture accessible from within all tests.
class StarlightPage {
	constructor(
		private readonly devServer: DevServer,
		private readonly page: Page
	) {}

	// Navigate to a URL relative to the server used during a test run and return the resource response.
	goto(url: string) {
		return this.page.goto(this.resolveUrl(url));
	}

	// Resolve a URL relative to the server used during a test run.
	resolveUrl(url: string) {
		return `http://localhost:${this.devServer.address.port}${url.replace(/^\/?/, '/')}`;
	}
}

type DevServer = Awaited<ReturnType<typeof dev>>;
