import { pathToFileURL } from 'node:url';
import type { AstroConfig } from 'astro';
import type { StarlightConfig } from '../../types';
import { localeToLang } from './localeToLang';
import { getCollectionPath } from '../../utils/collection';
import { slugToLocale } from './slugToLocale';

/** Get current language from an absolute file path. */
export function absolutePathToLang(
	path: string,
	{
		starlightConfig,
		astroConfig,
	}: {
		starlightConfig: Pick<StarlightConfig, 'defaultLocale' | 'locales'>;
		astroConfig: { root: AstroConfig['root']; srcDir: AstroConfig['srcDir'] };
	}
): string {
	const docsPath = getCollectionPath('docs', astroConfig.srcDir);
	// Format path to URL-encoded path.
	path = pathToFileURL(path).pathname;
	// Ensure that the page path starts with a slash if the docs directory also does,
	// which makes stripping the docs path in the next step work on Windows, too.
	if (path && !path.startsWith('/') && docsPath.startsWith('/')) path = '/' + path;
	// Strip docs path leaving only content collection file ID.
	// Example: /Users/houston/repo/src/content/docs/en/guide.md => en/guide.md
	const slug = path?.replace(docsPath, '');
	const locale = slugToLocale(slug, starlightConfig);
	return localeToLang(starlightConfig, locale);
}
