import { bench, describe } from 'vitest';
import builtinTranslations from '../translations';
import {
	buildBenchOptions,
	buildFixture,
	cleanFixture,
	createComponentDocs,
	resetFixtureBuild,
	writeFixtureDocs,
} from './fixtures';

const locales = Object.keys(builtinTranslations);

describe('locales', () => {
	bench('build', () => buildFixture('locales'), {
		...buildBenchOptions,
		setup: async () => {
			await writeFixtureDocs('locales', createComponentDocs(locales));
			await resetFixtureBuild('locales');
		},
		teardown: () => cleanFixture('locales'),
	});
});
