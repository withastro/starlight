import { rmSync } from 'node:fs';
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

function getFixtureRoot(name: FixtureName) {
	return fileURLToPath(new URL(`./fixtures/${name}/`, import.meta.url));
}

export function frontmatter(title: string) {
	return `---\ntitle: ${title}\n---\n\n`;
}

export function createLargeSidebarDocs(): DocFile[] {
	const docs: DocFile[] = [
		{ path: '404.md', content: frontmatter('Not found') + 'Benchmark fallback page.\n' },
	];
	for (let section = 0; section < 10; section++) {
		const nesting = Array.from({ length: 7 }, (_, index) => `level-${index + 1}`).join('/');
		for (let page = 0; page < 100; page++) {
			docs.push({
				path: `reference/section-${section}/${nesting}/page-${page}.md`,
				content: frontmatter(`Page ${section}-${page}`) + 'Benchmark content.\n',
			});
		}
	}
	return docs;
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
	await Promise.all([
		rm(join(root, '.astro'), { recursive: true, force: true }),
		rm(join(root, 'dist'), { recursive: true, force: true }),
	]);
}

export async function buildFixture(name: FixtureName) {
	await build({ logLevel: 'silent', root: getFixtureRoot(name) });
}

export function cleanFixture(name: FixtureName) {
	const root = getFixtureRoot(name);
	for (const path of ['src/content/docs', '.astro', 'dist']) {
		rmSync(join(root, path), { recursive: true, force: true });
	}
}
