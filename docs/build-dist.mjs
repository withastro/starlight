// @ts-check
import { execFileSync } from 'node:child_process';
import { readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const rootDir = new URL('../', import.meta.url);
const docsDir = new URL('docs/', rootDir);
const starlightDir = new URL('packages/starlight/', rootDir);

const docsPackageJson = new URL('package.json', docsDir);

const tarballPath = join(tmpdir(), `starlight-${process.pid}.tgz`);
const pnpmPath = process.env.npm_execpath ?? '';

if (!pnpmPath || !process.env.npm_config_user_agent?.startsWith('pnpm/')) {
	throw new Error('The script must be run using pnpm');
}

let shouldRestoreWorkspace = false;

const originalPackageJson = await readFile(docsPackageJson);

try {
	// Build Starlight.
	runPnpm(starlightDir, 'build');
	// Pack Starlight in a tarball.
	runPnpm(starlightDir, 'pack', '--out', tarballPath);

	// Only restore the workspace if we are not running in CI or Netlify.
	shouldRestoreWorkspace = !process.env.CI && !process.env.NETLIFY;

	// Install the tarball in the `docs/` directory without updating the `pnpm-lock.yaml` file.
	runPnpm(docsDir, 'add', '--prefer-offline', '--lockfile=false', tarballPath);
	// Build the documentation using the built version of Starlight.
	runPnpm(docsDir, 'exec', 'astro', 'build');
} finally {
	try {
		if (shouldRestoreWorkspace) {
			// Restore the `docs/package.json` file.
			await writeFile(docsPackageJson, originalPackageJson);
			// Restore the dependencies.
			runPnpm(rootDir, 'install', '--offline', '--frozen-lockfile');
		}
	} finally {
		// Remove the tarball.
		await rm(tarballPath, { force: true });
	}
}

/**
 * @param {URL} cwd - Current working directory for the command.
 * @param {...string} args - Arguments to pass to the pnpm command.
 */
function runPnpm(cwd, ...args) {
	execFileSync(process.execPath, [pnpmPath, ...args], { cwd, stdio: 'inherit' });
}
