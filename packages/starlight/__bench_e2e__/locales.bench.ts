import { beforeAll, describe, test } from 'vitest';
import builtinTranslations from '../src/translations';
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
	beforeAll(async () => {
		await writeFixtureDocs('locales', createComponentDocs(locales));
		await resetFixtureBuild('locales');

		return () => cleanFixture('locales');
	});

	test('build', async ({ bench }) => {
		await bench('build', async () => {
			await buildFixture('locales');
		}).run(buildBenchOptions);
	});
});
