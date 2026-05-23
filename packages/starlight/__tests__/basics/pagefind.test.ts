import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, test, vi } from 'vitest';
import * as pagefind from 'pagefind';
import { starlightPagefind } from '../../integrations/pagefind';
import { PagefindConfigSchema } from '../../schemas/pagefind';
import { TestAstroIntegrationLogger } from '../test-plugin-utils';

vi.mock('pagefind');

afterEach(() => {
	vi.clearAllMocks();
});

async function runStarlightPagefind(outputDir: URL) {
	const index = createMockIndex();

	vi.mocked(pagefind.createIndex).mockResolvedValue({ index, errors: [] });

	await starlightPagefind({ dir: outputDir, logger: new TestAstroIntegrationLogger() });

	return index;
}

function createMockIndex(): pagefind.PagefindIndex {
	return {
		addDirectory: vi.fn().mockResolvedValue({ page_count: 10, errors: [] }),
		writeFiles: vi.fn().mockResolvedValue({ errors: [] }),
	} as unknown as pagefind.PagefindIndex;
}

const outputDir = new URL('file:///build/output/dir/');

test('runs and closes Pagefind successfully', async () => {
	const index = await runStarlightPagefind(outputDir);

	// Create an index.
	expect(pagefind.createIndex).toHaveBeenCalled();

	// Add the build output directory to the index using a file path.
	expect(index.addDirectory).toHaveBeenCalledWith({
		path: fileURLToPath(outputDir),
	});

	// Write files to the `./pagefind/` directory inside the build output directory.
	expect(index.writeFiles).toHaveBeenCalledWith({
		outputPath: fileURLToPath(new URL('./pagefind/', outputDir)),
	});

	// Close Pagefind.
	expect(pagefind.close).toHaveBeenCalled();
});

test('logs Pagefind errors and closes Pagefind', async () => {
	const errorMessage = 'Failed to create index';

	const logger = new TestAstroIntegrationLogger();
	vi.spyOn(logger, 'error');
	vi.spyOn(logger, 'fork').mockReturnValue(logger);

	vi.mocked(pagefind.createIndex).mockResolvedValue({
		index: createMockIndex(),
		errors: [errorMessage],
	});

	await expect(starlightPagefind({ dir: outputDir, logger })).rejects.toThrow();

	expect(logger.error).toHaveBeenCalledWith(`Pagefind error: ${errorMessage}`);

	expect(pagefind.close).toHaveBeenCalled();
});

describe('PagefindConfigSchema ranking weights', () => {
	const schema = PagefindConfigSchema();

	// Regression coverage for https://github.com/withastro/starlight/issues/3912 —
	// the schema previously omitted `diacriticSimilarity` (Pagefind v1.2.0) and
	// `metaWeights` (Pagefind v1.4.0), so those options were silently stripped
	// during validation and never reached Pagefind.

	test('accepts diacriticSimilarity as a non-negative number', () => {
		const config = schema.parse({ ranking: { diacriticSimilarity: 0.5 } });
		expect(config.ranking.diacriticSimilarity).toBe(0.5);

		const zero = schema.parse({ ranking: { diacriticSimilarity: 0 } });
		expect(zero.ranking.diacriticSimilarity).toBe(0);
	});

	test('accepts metaWeights as a record of string to number', () => {
		const config = schema.parse({ ranking: { metaWeights: { title: 5, description: 2 } } });
		expect(config.ranking.metaWeights).toEqual({ title: 5, description: 2 });
	});

	test('preserves defaults for existing ranking fields when only new fields are set', () => {
		const config = schema.parse({ ranking: { diacriticSimilarity: 1 } });
		expect(config.ranking.pageLength).toBe(0.1);
		expect(config.ranking.termFrequency).toBe(0.1);
		expect(config.ranking.termSaturation).toBe(2);
		expect(config.ranking.termSimilarity).toBe(9);
		expect(config.ranking.diacriticSimilarity).toBe(1);
	});

	test('rejects diacriticSimilarity below 0', () => {
		const result = schema.safeParse({ ranking: { diacriticSimilarity: -1 } });
		expect(result.success).toBe(false);
	});

	test('rejects metaWeights with non-number values', () => {
		const result = schema.safeParse({ ranking: { metaWeights: { title: 'high' } } });
		expect(result.success).toBe(false);
	});

	test('still strips unknown ranking keys', () => {
		const config = schema.parse({
			ranking: { diacriticSimilarity: 0.5, unknownKey: 42 },
		} as Parameters<typeof schema.parse>[0]);
		expect('unknownKey' in config.ranking).toBe(false);
		expect(config.ranking.diacriticSimilarity).toBe(0.5);
	});
});
