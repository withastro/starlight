import { fileURLToPath } from 'node:url';
import { afterEach, expect, test, vi } from 'vitest';
import * as pagefind from 'pagefind';
import { starlightPagefind } from '../../integrations/pagefind';
import { TestAstroIntegrationLogger } from '../test-plugin-utils';

vi.mock('pagefind');

afterEach(() => {
	vi.clearAllMocks();
});

async function runStarlightPagefind(outputDir: URL) {
	const index = createMockIndex();

	vi.mocked(pagefind.createIndex).mockResolvedValue({ index, errors: [] });

	await starlightPagefind({ dir: outputDir, logger: new TestAstroIntegrationLogger() }, {});

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

	await expect(starlightPagefind({ dir: outputDir, logger }, {})).rejects.toThrow();

	expect(logger.error).toHaveBeenCalledWith(`Pagefind error: ${errorMessage}`);

	expect(pagefind.close).toHaveBeenCalled();
});
