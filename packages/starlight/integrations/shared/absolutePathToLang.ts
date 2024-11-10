import type { AstroConfig } from 'astro';
import { AstroError } from 'astro/errors';
import type { StarlightConfig } from '../../types';
import { localeToLang } from './localeToLang';
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
) {
	const srcDir = new URL(astroConfig.srcDir, astroConfig.root);
	const docsDir = new URL('content/docs/', srcDir);
	// Format path to unix style path.
	path = path?.replace(/\\/g, '/');
	// Ensure that the page path starts with a slash if the docs directory also does,
	// which makes stripping the docs path in the next step work on Windows, too.
	if (path && !path.startsWith('/') && docsDir.pathname.startsWith('/')) path = '/' + path;
	// Strip docs path leaving only content collection file ID.
	// Example: /Users/houston/repo/src/content/docs/en/guide.md => en/guide.md
	const slug = path?.replace(docsDir.pathname, '');
	// If the provided path is not a valid docs path, throw an error.
	if (path === slug) {
		throw new AstroError(
			`Invalid file path: ${path}`,
			'The `absolutePathToLang()` function can only be used with absolute paths for files in the docs directory.\n' +
				'Learn more about `absolutePathToLang()` at https://starlight.astro.build/reference/plugins/#absolutepathtolang'
		);
	}
	const locale = slugToLocale(slug, starlightConfig);
	return localeToLang(starlightConfig, locale);
}
