import type { Server as HttpServer } from 'node:http';
import type { Server as HttpsServer } from 'node:https';
import type { AddressInfo } from 'node:net';
import { fileURLToPath } from 'node:url';
import { test as baseTest, type Page } from '@playwright/test';
import { build, dev, preview } from 'astro';

export { expect, type Locator } from '@playwright/test';

process.env.ASTRO_TELEMETRY_DISABLED = 'true';
process.env.ASTRO_DISABLE_UPDATE_CHECK = 'true';

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
		} = {}
	): Promise<Server> {
		const { mode } = options;
		if (mode === 'dev') {
			return await dev({
				logLevel: 'error',
				root,
				// Vite's dev server hangs on the optimization discovery phase when
				// trying to stop the server programmatically at the end of the test.
				// Disabling this optimization here allows the test to run properly
				// on CI and fresh clones of the project.
				vite: { optimizeDeps: { noDiscovery: true } },
			});
		} else {
			await build({ logLevel: 'error', root });
			// Use an OS-assigned port instead of relying on Vite's port fallback because some adapters
			// like `@astrojs/node` don't support the same behavior.
			return await preview({ logLevel: 'error', root, server: { port: 0 } });
		}
	}

	// Optimization for tests that don't customize any server options
	// to not rebuild the fixture for each test.
	let prodServer: Server | null = null;
	const servers = new Map<string, Server>();

	const test = baseTest.extend<{
		getProdServer: () => Promise<StarlightPage>;
		makeServer: (name: string, ...params: Parameters<typeof makeServer>) => Promise<StarlightPage>;
	}>({
		getProdServer: ({ page }, use) =>
			use(async () => {
				const server = (prodServer ??= await makeServer({
					mode: 'build',
				}));
				return new StarlightPage(server, page);
			}),
		makeServer: ({ page }, use) =>
			use(async (name, ...params) => {
				const server = servers.get(name) ?? (await makeServer(...params));
				servers.set(name, server);
				return new StarlightPage(server, page);
			}),
	});

	test.afterAll(async () => {
		await prodServer?.stop();
		for (const server of servers.values()) {
			await server.stop();
		}
	});

	return test;
}

// A Playwright test fixture accessible from within all tests.
export class StarlightPage {
	private readonly server: Server;
	private readonly page: Page;

	constructor(server: Server, page: Page) {
		this.server = server;
		this.page = page;
	}

	// Navigate to a URL relative to the server used during a test run and return the resource response.
	goto(url: string) {
		return this.page.goto(this.resolveUrl(url));
	}

	// Resolve a URL relative to the server used during a test run.
	resolveUrl(url: string) {
		const address =
			'address' in this.server
				? this.server.address
				: // The server may contain a `server.server` property if it's using the `@astrojs/node`
					// adapter but it's not exposed in the `PreviewServer` type.
					// https://github.com/withastro/astro/blob/0f0a4ce1b28a6d6ec1658c7f59e0e68408935135/packages/integrations/node/src/standalone.ts#L104
					isServerWithAddressInfo(this.server)
					? this.server.server.address()
					: undefined;

		const port = isAddressInfo(address)
			? address.port
			: 'port' in this.server
				? this.server.port
				: undefined;

		if (typeof port !== 'number') {
			throw new Error('Failed to resolve test server address.');
		}

		return `http://localhost:${port}${url.replace(/^\/?/, '/')}`;
	}
}

function isServerWithAddressInfo(server: Server): server is Server & ServerWithAddressInfo {
	return (
		'server' in server &&
		typeof server.server === 'object' &&
		server.server !== null &&
		'address' in server.server &&
		typeof server.server.address === 'function'
	);
}

function isAddressInfo(
	address: ReturnType<HttpServer['address']> | undefined
): address is AddressInfo {
	return !!address && typeof address !== 'string';
}

interface ServerWithAddressInfo {
	server: HttpServer | HttpsServer;
}

type PreviewServer = Awaited<ReturnType<typeof preview>>;
type DevServer = Awaited<ReturnType<typeof dev>>;
type Server = PreviewServer | DevServer;
