import { mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import type { BenchRunOptions } from 'vitest';
import { build } from 'astro';

process.env.ASTRO_TELEMETRY_DISABLED = 'true';
process.env.ASTRO_DISABLE_UPDATE_CHECK = 'true';

type FixtureName = 'large-sidebar' | 'locales';

export interface DocFile {
	path: string;
	title: string;
	body: string;
}

export const buildBenchOptions: BenchRunOptions = {
	// Number of builds to run in the benchmark.
	iterations: 1,
	// Disable the minimum time budget per task so only `iterations` controls the number of builds.
	time: 0,
	// Disable warmup to measure a cold build like a real `astro build`.
	warmup: false,
};

const astroArtifactDirs = ['.astro', 'dist', 'node_modules/.astro'];

function getFixtureRoot(name: FixtureName) {
	return fileURLToPath(new URL(`./fixtures/${name}/`, import.meta.url));
}

export async function writeFixtureDocs(name: FixtureName, docs: DocFile[]) {
	const root = getFixtureRoot(name);
	const docsRoot = join(root, 'src/content/docs');
	await rm(docsRoot, { recursive: true, force: true });
	await Promise.all(
		docs.map(async ({ path, title, body }) => {
			const filePath = join(docsRoot, path);
			await mkdir(dirname(filePath), { recursive: true });
			await writeFile(filePath, `---\ntitle: ${title}\n---\n\n${body}`);
		})
	);
}

export async function resetFixtureBuild(name: FixtureName) {
	const root = getFixtureRoot(name);
	await Promise.all(
		astroArtifactDirs.map((dir) => rm(join(root, dir), { recursive: true, force: true }))
	);
}

export async function buildFixture(name: FixtureName) {
	await build({ logLevel: 'silent', root: getFixtureRoot(name) });
}

export async function cleanFixture(name: FixtureName) {
	await rm(join(getFixtureRoot(name), 'src/content/docs'), { recursive: true, force: true });
	await resetFixtureBuild(name);
}
