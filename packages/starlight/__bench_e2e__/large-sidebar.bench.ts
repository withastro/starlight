import { bench, describe } from 'vitest';
import {
	buildBenchOptions,
	buildFixture,
	cleanFixture,
	createLargeSidebarDocs,
	resetFixtureBuild,
	writeFixtureDocs,
} from './fixtures';

describe('large_sidebar', () => {
	bench('build', () => buildFixture('large-sidebar'), {
		...buildBenchOptions,
		setup: async () => {
			await writeFixtureDocs('large-sidebar', createLargeSidebarDocs());
			await resetFixtureBuild('large-sidebar');
		},
		teardown: () => cleanFixture('large-sidebar'),
	});
});
