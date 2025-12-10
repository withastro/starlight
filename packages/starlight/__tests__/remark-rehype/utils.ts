import type { StarlightUserConfig } from '../../types';
import { StarlightConfigSchema } from '../../utils/user-config';
import type { RemarkRehypePluginOptions } from '../../integrations/remark-rehype';
import { createTranslationSystemFromFs } from '../../utils/translations-fs';
import { absolutePathToLang } from '../../integrations/shared/absolutePathToLang';
import { getCollectionPosixPath } from '../../utils/collection-fs';

/** Returns options for the Starlight remark-rehype plugins to be used in tests. */
export async function createRemarkRehypePluginTestOptions(
	starlightUserConfig?: StarlightUserConfig
): Promise<RemarkRehypePluginOptions> {
	const starlightConfig = StarlightConfigSchema.parse(
		starlightUserConfig ?? { title: 'Remark-Rehype Tests' }
	);

	const astroConfig = {
		root: new URL(import.meta.url),
		srcDir: new URL('./_src/', import.meta.url),
		experimental: { headingIdCompat: false },
	};

	return {
		starlightConfig,
		astroConfig,
		useTranslations: await createTranslationSystemFromFs(
			starlightConfig,
			// Using non-existent `_src/` to ignore custom files in test fixtures.
			{ srcDir: astroConfig.srcDir }
		),
		absolutePathToLang: (path: string) =>
			absolutePathToLang(path, {
				docsPath: getCollectionPosixPath('docs', astroConfig.srcDir),
				starlightConfig,
			}),
	};
}
