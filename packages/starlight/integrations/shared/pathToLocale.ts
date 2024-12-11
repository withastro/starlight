import type { AstroConfig } from 'astro';
import type { StarlightConfig } from '../../types';
import { getCollectionPath } from '../../loader';
import { slugToLocale } from './slugToLocale';

/** Get current locale from the full file path. */
export function pathToLocale(
	path: string | undefined,
	{
		starlightConfig,
		astroConfig,
	}: {
		starlightConfig: Pick<StarlightConfig, 'defaultLocale' | 'locales'>;
		astroConfig: { root: AstroConfig['root']; srcDir: AstroConfig['srcDir'] };
	}
): string | undefined {
	const docsPath = getCollectionPath('docs', astroConfig.srcDir);
	// Format path to unix style path.
	path = path?.replace(/\\/g, '/');
	// Ensure that the page path starts with a slash if the docs directory also does,
	// which makes stripping the docs path in the next step work on Windows, too.
	if (path && !path.startsWith('/') && docsPath.startsWith('/')) path = '/' + path;
	// Strip docs path leaving only content collection file ID.
	// Example: /Users/houston/repo/src/content/docs/en/guide.md => en/guide.md
	const slug = path?.replace(docsPath, '');
	return slugToLocale(slug, starlightConfig);
}
