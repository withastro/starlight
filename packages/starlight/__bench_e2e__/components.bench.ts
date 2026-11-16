import { beforeAll, describe, test } from 'vitest';
import {
	buildBenchOptions,
	buildFixture,
	cleanFixture,
	createComponentDocs,
	resetFixtureBuild,
	writeFixtureDocs,
} from './fixtures';

describe('components', () => {
	beforeAll(async () => {
		await writeFixtureDocs('components', createComponentDocs());
		await resetFixtureBuild('components');

		return () => cleanFixture('components');
	});

	test('build', async ({ bench }) => {
		await bench('build', async () => {
			await buildFixture('components');
		}).run(buildBenchOptions);
	});
});
