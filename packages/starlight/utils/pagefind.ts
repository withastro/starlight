import type { AstroIntegrationLogger } from 'astro';
import * as pagefind from 'pagefind';

type PagefindGenerationOptions = {
	inputDir: string;
	outputDir: string;
	logger: AstroIntegrationLogger;
};

export async function generatePagefindIndex(options: PagefindGenerationOptions): Promise<void> {
	const startTime = performance.now();

	const indexCreation = await pagefind.createIndex({});

	if (!indexCreation.index) {
		throw new Error('Failed to create pagefind index: \n-' + indexCreation.errors.join('\n-'));
	}

	const { index } = indexCreation;

	options.logger.info('Indexing content...');

	const indexingResult = await index.addDirectory({ path: options.inputDir });

	if (indexingResult.errors.length > 0) {
		throw new Error('Failed to index content: \n-' + indexingResult.errors.join('\n-'));
	}

	options.logger.info(`Indexed ${indexingResult.page_count} pages!`);

	const indexSaveResult = await index.writeFiles({ outputPath: options.outputDir });

	if (indexSaveResult.errors.length > 0) {
		throw new Error(
			'Failed to save pagefind index files: \n-' + indexSaveResult.errors.join('\n-')
		);
	}

	const endTime = performance.now();

	options.logger.info(`Finished indexing in ${Math.round(endTime - startTime)}ms.`);
}
