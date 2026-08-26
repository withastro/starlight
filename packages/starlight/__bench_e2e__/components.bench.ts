import { bench, describe } from 'vitest';
import {
	buildBenchOptions,
	buildFixture,
	cleanFixture,
	createComponentDocs,
	resetFixtureBuild,
	writeFixtureDocs,
} from './fixtures';

describe('components', () => {
	bench('build', () => buildFixture('components'), {
		...buildBenchOptions,
		setup: async () => {
			await writeFixtureDocs('components', createComponentDocs());
			await resetFixtureBuild('components');
		},
		teardown: () => cleanFixture('components'),
	});
});
