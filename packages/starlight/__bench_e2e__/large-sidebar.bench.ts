import { beforeAll, describe, test } from 'vitest';
import {
	buildBenchOptions,
	buildFixture,
	cleanFixture,
	createLargeSidebarDocs,
	resetFixtureBuild,
	writeFixtureDocs,
} from './fixtures';

describe('large_sidebar', () => {
	beforeAll(async () => {
		await writeFixtureDocs('large-sidebar', createLargeSidebarDocs());
		await resetFixtureBuild('large-sidebar');

		return () => cleanFixture('large-sidebar');
	});

	test('build', async ({ bench }) => {
		await bench('build', async () => {
			await buildFixture('large-sidebar');
		}).run(buildBenchOptions);
	});
});
