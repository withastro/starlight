import { mkdtempSync, mkdirSync, writeFileSync, rmdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { dev, build, preview, type AstroInlineConfig } from 'astro';
import { version as astroVersion } from 'astro/package.json';
import { version as nodeIntegrationVersion } from '@astrojs/node/package.json';
import { afterEach, test } from 'vitest';

// Receive a file tree instead of a flattened list of files so it better works on Windows.
export type FileTree = { [name in string]: TreeEntry };
type TreeEntry = string | FileTree;

const defaultFileTree: FileTree = {
	'package.json': JSON.stringify({
		name: 'test-docs',
		private: true,
		type: 'module',
		version: '0.0.1',
		dependencies: {
			astro: astroVersion,
			'@astrojs/node': nodeIntegrationVersion,
			'@astrojs/starlight': new URL('../../', import.meta.url).toString(),
		},
	}),
	'.gitignore': 'node_modules\ndist\n',
	src: {
		content: {
			'config.ts': `
import { defineCollection } from 'astro:content';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({ schema: docsSchema() }),
	i18n: defineCollection({ type: 'data', schema: i18nSchema() }),
};
`,
		},
	},
};

type ProjectOptions = {
	fileTree?: FileTree;
	config: Omit<AstroInlineConfig, 'root'>;
	initialCommitDate?: ISODate;
};

function writeFileTree(root: string, fileTree: FileTree) {
	for (const [name, entry] of Object.entries(fileTree)) {
		const path = join(root, name);

		if (typeof entry === 'string') {
			writeFileSync(path, entry);
		} else {
			mkdirSync(path, { recursive: true });
			writeFileTree(path, entry);
		}
	}
}

// Resource auto-cleanup
const resourceCleanup: Array<() => Promise<void> | void> = [];
afterEach(async () => {
	const currentCleanup = resourceCleanup.splice(0, resourceCleanup.length);
	await Promise.all(currentCleanup.map((cleanup) => cleanup()));
});

export function makeTestProject(options: ProjectOptions) {
	const prefix = join(tmpdir(), 'starlight-test-');
	const projectPath = realpathSync(mkdtempSync(prefix));

	resourceCleanup.push(() => rmdirSync(projectPath, { recursive: true }));

	function runInRepo(command: string, args: string[], env: NodeJS.ProcessEnv = {}) {
		const result = spawnSync(command, args, {
			cwd: projectPath,
			env: {
				...process.env,
				...env,
			},
		});

		if (result.status !== 0) {
			throw new Error(
				`Failed to execute test repository command: '${command} ${args.join(' ')}'` +
					`\n\n${result.error}` +
					`\n\n${result.stderr.toString()}` +
					`\n\n${result.stdout.toString()}`
			);
		}
	}

	// Configure git specifically for this test repository.
	runInRepo('git', ['init']);
	runInRepo('git', ['config', 'user.name', 'starlight-test']);
	runInRepo('git', ['config', 'user.email', 'starlight-test@example.com']);
	runInRepo('git', ['config', 'commit.gpgsign', 'false']);

	const astroConfig: AstroInlineConfig = {
		...options.config,
		root: projectPath,
	};
	let serverAddress: string | null = null;

	function checkNoServer() {
		if (serverAddress) {
			throw new Error('Test server is already running');
		}
	}

	const projectHandle = {
		// The `dateStr` argument should be in the `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ` format.
		commitAllChanges(message: string, dateStr: ISODate) {
			const date = dateStr.endsWith('Z') ? dateStr : `${dateStr}T00:00:00Z`;

			runInRepo('git', ['add', '-A']);
			// This sets both the author and committer dates to the provided date.
			runInRepo('git', ['commit', '-m', message, '--date', date], { GIT_COMMITTER_DATE: date });
		},
		getFilePath(...parts: string[]) {
			return join(projectPath, ...parts);
		},
		writeFile(name: string, content: string) {
			const filePath = join(projectPath, name);
			const directoryPath = dirname(filePath);

			mkdirSync(directoryPath, { recursive: true });
			writeFileSync(filePath, content);
		},
		writeFileTree(fileTree: FileTree) {
			writeFileTree(projectPath, fileTree);
		},

		/** Make a request to the server. */
		async fetch(path: string, options: RequestInit = {}) {
			if (!serverAddress) {
				throw new Error('Server is not running');
			}

			return fetch(new URL(path, serverAddress), options);
		},
		async dev() {
			checkNoServer();
			const devServer = await dev(astroConfig);
			resourceCleanup.push(() => devServer.stop());

			serverAddress = `http://${devServer.address.address}:${devServer.address.port}}`;
			return {
				...devServer,
				async stop() {
					await devServer.stop();
					serverAddress = null;
				},
			};
		},
		async build() {
			// @ts-ignore
			await build(astroConfig, { teardownCompiler: false });
		},
		async preview() {
			checkNoServer();
			const previewServer = await preview(astroConfig);
			resourceCleanup.push(() => previewServer.stop());

			serverAddress = `http://${previewServer.host ?? 'localhost'}:${previewServer.port}`;
			return {
				...previewServer,
				async stop() {
					await previewServer.stop();
					serverAddress = null;
				},
			};
		},
	};

	projectHandle.writeFileTree(defaultFileTree);
	projectHandle.writeFileTree(options.fileTree ?? {});

	runInRepo('pnpm', ['install']);

	// Starlight first release as default initial date <3
	projectHandle.commitAllChanges('Initial commit', options.initialCommitDate ?? '2023-05-08');

	return projectHandle;
}

type ISODate =
	| `${number}-${number}-${number}`
	| `${number}-${number}-${number}T${number}:${number}:${number}Z`;

export function longTest(name: string, testFn: () => Promise<void>) {
	test(name, testFn, {
		concurrent: false,
		timeout: 15000,
	});
}
