import { fileURLToPath } from 'node:url';
import { test as baseTest, type Page } from '@playwright/test';
import { build, dev, preview, type AstroInlineConfig } from 'astro';

export { expect, type Locator } from '@playwright/test';

process.env.ASTRO_TELEMETRY_DISABLED = 'true';

// Setup a test environment that will build and start a preview server for a given fixture path and
// provide a Starlight Playwright fixture accessible from within all tests.
export function testFactory(fixturePath: string) {
	const fixturePathUrl = new URL(fixturePath, import.meta.url);
	// Combining absolute paths with a `file:` base URL on Windows results
	// in a URL with the drive letter as the protocol.
	// In that case, use the URL as is instead of interpreting the `file:` protocol.
	const root =
		fixturePathUrl.protocol === 'file:'
			? fileURLToPath(new URL(fixturePath, import.meta.url))
			: fixturePathUrl.toString();

	async function makeServer(
		options: {
			mode?: 'build' | 'dev';
			config?: AstroInlineConfig;
		} = {}
	): Promise<Server> {
		const { mode, config } = options;
		if (mode === 'dev') {
			return await dev({ logLevel: 'error', root, ...config });
		} else {
			await build({ logLevel: 'error', root, ...config });
			return await preview({ logLevel: 'error', root, ...config });
		}
	}

	const customServers: Server[] = [];
	// Optimization for tests that don't customize any server options
	// to not rebuild the fixture for each test.
	const defaultServers: {
		build?: Server;
		dev?: Server;
	} = {};

	const test = baseTest.extend<{
		makeServer: (config?: Parameters<typeof makeServer>[0]) => Promise<StarlightPage>;
	}>({
		makeServer: ({ page }, use) =>
			use(async (params) => {
				const { mode = 'build', config } = params ?? {};

				if (config === undefined) {
					const server = (defaultServers[mode] ??= await makeServer({ mode }));
					return new StarlightPage(server, page);
				}

				const newServer = await makeServer(params);
				customServers.push(newServer);

				return new StarlightPage(newServer, page);
			}),
	});

	test.afterAll(async () => {
		await defaultServers.build?.stop();
		await defaultServers.dev?.stop();
	});

	test.afterEach(async () => {
		// Stop all started servers.
		await Promise.all(customServers.map((server) => server.stop()));
		customServers.splice(0, customServers.length);
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
