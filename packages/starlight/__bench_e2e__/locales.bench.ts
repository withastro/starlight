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
import { nonRootLocales } from './fixtures/locales/locales';

beforeAll(async () => {
	await writeFixtureDocs(
		'locales',
		createLocaleDocs(
			nonRootLocales.map(({ key }) => key),
			40
		)
	);
	await resetFixtureBuild('locales');

	return () => cleanFixture('locales');
});

test('locales', async ({ bench }) => {
	await bench('build', async () => {
		await buildFixture('locales');
	}).run(buildBenchOptions);
});

/**
 * Create pages for the root locale and translate half of them into every other locale. Missing
 * translations use fallback routes.
 */
function createLocaleDocs(locales: string[], pagesPerLocale: number): DocFile[] {
	const docs: DocFile[] = [];
	for (let page = 0; page < pagesPerLocale; page++) {
		docs.push({ path: `page-${page}.md`, content: getMarkdownContent(`Page ${page}`) });
		if (page % 2 !== 0) continue;

		for (const locale of locales) {
			docs.push({
				path: `${locale}/page-${page}.md`,
				content: getMarkdownContent(`Page ${page} (${locale})`),
			});
		}
	}
	return docs;
}

function getMarkdownContent(title: string) {
	return (
		frontmatter(title) +
		Array.from(
			{ length: 3 },
			(_, index) =>
				`## Section ${index}\n\nBenchmark content.\n\n### Subsection ${index}\n\nBenchmark content.\n`
		).join('\n')
	);
}
