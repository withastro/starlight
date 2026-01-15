import type { HookParameters } from 'astro';
import { fileURLToPath } from 'node:url';
import * as pagefind from 'pagefind';

/** Run Pagefind to generate search index files based on the build output directory. */
export async function starlightPagefind({
	dir,
	logger: starlightLogger,
}: PagefindIntegrationOptions) {
	const logger = starlightLogger.fork('starlight:pagefind');
	const options = { dir, logger };

	try {
		const now = performance.now();
		logger.info('Building search index with Pagefind...');

		const newIndexResponse = await pagefind.createIndex();

		const { index } = assertPagefindResponse<pagefind.NewIndexResponse>(newIndexResponse, options);

		const indexingResponse = await index.addDirectory({ path: fileURLToPath(dir) });
		const { page_count } = assertPagefindResponse<pagefind.IndexingResponse>(
			indexingResponse,
			options
		);

		logger.info(`Found ${page_count} HTML files.`);

		const writeFilesResponse = await index.writeFiles({
			outputPath: fileURLToPath(new URL('./pagefind/', dir)),
		});
		assertPagefindResponse<pagefind.WriteFilesResponse>(writeFilesResponse, options);

		const pagefindTime = performance.now() - now;
		logger.info(
			`Finished building search index in ${pagefindTime < 750 ? `${Math.round(pagefindTime)}ms` : `${(pagefindTime / 1000).toFixed(2)}s`}.`
		);
	} catch (cause) {
		throw new Error('Failed to run Pagefind.', { cause });
	} finally {
		await pagefind.close();
	}
}

function assertPagefindResponse<T extends PagefindBaseResponse>(
	response: T,
	{ logger }: PagefindIntegrationOptions
) {
	if (response.errors.length > 0) {
		for (const error of response.errors) logger.error(`Pagefind error: ${error}`);
		throw new Error('Pagefind response contained errors.');
	}
	return response as Required<T>;
}

interface PagefindBaseResponse {
	errors: string[];
}

type PagefindIntegrationOptions = Pick<HookParameters<'astro:build:done'>, 'dir' | 'logger'>;
