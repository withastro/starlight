import { mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { build } from 'astro';

process.env.ASTRO_TELEMETRY_DISABLED = 'true';
process.env.ASTRO_DISABLE_UPDATE_CHECK = 'true';

type FixtureName = 'large-sidebar' | 'locales';

export interface DocFile {
	path: string;
	content: string;
}

export const buildBenchOptions = {
	iterations: 1,
	time: 0,
	warmupIterations: 0,
	warmupTime: 0,
};

const astroArtifactDirs = ['.astro', 'dist', 'node_modules/.astro'];

function getFixtureRoot(name: FixtureName) {
	return fileURLToPath(new URL(`./fixtures/${name}/`, import.meta.url));
}

export function frontmatter(title: string) {
	return `---\ntitle: ${title}\n---\n\n`;
}

export async function writeFixtureDocs(name: FixtureName, docs: DocFile[]) {
	const root = getFixtureRoot(name);
	const docsRoot = join(root, 'src/content/docs');
	await rm(docsRoot, { recursive: true, force: true });
	await Promise.all(
		docs.map(async ({ path, content }) => {
			const filePath = join(docsRoot, path);
			await mkdir(dirname(filePath), { recursive: true });
			await writeFile(filePath, content);
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
