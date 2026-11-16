import { beforeAll, test } from 'vitest';
import {
	buildBenchOptions,
	buildFixture,
	cleanFixture,
	frontmatter,
	resetFixtureBuild,
	writeFixtureDocs,
	type DocFile,
} from './fixtures';

beforeAll(async () => {
	await writeFixtureDocs('large-sidebar', createLargeSidebarDocs());
	await resetFixtureBuild('large-sidebar');

	return () => cleanFixture('large-sidebar');
});

test('large_sidebar', async ({ bench }) => {
	await bench('build', async () => {
		await buildFixture('large-sidebar');
	}).run(buildBenchOptions);
});

/** Create 10 top-level groups each with 7 nested subgroups. Every group contains 14 pages. */
function createLargeSidebarDocs(): DocFile[] {
	const docs: DocFile[] = [];
	for (let section = 0; section < 10; section++) {
		for (let level = 0; level <= 7; level++) {
			const directory = ['reference', `section-${section}`]
				.concat(Array.from({ length: level }, (_, index) => `level-${index + 1}`))
				.join('/');
			for (let page = 0; page < 14; page++) {
				docs.push({
					path: `${directory}/page-${page}.md`,
					content: frontmatter(`Page ${section}-${level}-${page}`) + 'Benchmark content.\n',
				});
			}
		}
	}
	return docs;
}
