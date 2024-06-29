import { fileURLToPath } from 'node:url';
import { test as baseTest, type Page } from '@playwright/test';
import { build, dev, preview, type AstroInlineConfig } from 'astro';

export { expect, type Locator } from '@playwright/test';

// Setup a test environment that will build and start a preview server for a given fixture path and
// provide a Starlight Playwright fixture accessible from within all tests.
export async function testFactory(fixturePath: string, options: { mode?: 'build' | 'dev' } = {}) {
	async function makeServer(
		options: {
			mode?: 'build' | 'dev';
			config?: AstroInlineConfig;
		} = {}
	): Promise<Server> {
		const { mode, config } = options;
		const root = fileURLToPath(new URL(fixturePath, import.meta.url));
		if (mode === 'build') {
			await build({ logLevel: 'error', root, ...config });
			return await preview({ logLevel: 'error', root, ...config });
		} else {
			return await dev({ logLevel: 'error', root, ...config });
		}
	}

	let server: Server | undefined;

	const test = baseTest.extend<{
		starlight: StarlightPage;
		makeServer: (config?: Parameters<typeof makeServer>[0]) => Promise<StarlightPage>;
	}>({
		starlight: async ({ page }, use) => {
			if (!server) {
				throw new Error('Could not find a preview server to run tests against.');
			}

			await use(new StarlightPage(server, page));
		},
		makeServer: ({ page }, use) =>
			use(async (config) => {
				const newServer = await makeServer(config);

				return new StarlightPage(newServer, page);
			}),
	});

	test.beforeAll(async () => {
		server = await makeServer(options);
	});

	test.afterAll(async () => {
		await server?.stop();
	});

	return test;
}

// A Playwright test fixture accessible from within all tests.
class StarlightPage {
	constructor(
		private readonly server: Server,
		private readonly page: Page
	) {}

	// Navigate to a URL relative to the server used during a test run and return the resource response.
	goto(url: string) {
		return this.page.goto(this.resolveUrl(url));
	}

	// Resolve a URL relative to the server used during a test run.
	resolveUrl(url: string) {
		const port = 'address' in this.server ? this.server.address.port : this.server.port;

		return `http://localhost:${port}${url.replace(/^\/?/, '/')}`;
	}
}

type PreviewServer = Awaited<ReturnType<typeof preview>>;
type DevServer = Awaited<ReturnType<typeof dev>>;
type Server = PreviewServer | DevServer;
