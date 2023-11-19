import type { StarlightConfig } from '../../types';

function slugToLocale(
	slug: string | undefined,
	localesConfig: StarlightConfig['locales']
): string | undefined {
	const locales = Object.keys(localesConfig || {});
	const baseSegment = slug?.split('/')[0];
	return baseSegment && locales.includes(baseSegment) ? baseSegment : undefined;
}

/** Get current locale from the full file path. */
export function pathToLocale(
	path: string | undefined,
	{
		starlightConfig,
		astroConfig,
	}: {
		starlightConfig: { locales: StarlightConfig['locales'] };
		astroConfig: { root: URL; srcDir: URL };
	}
): string | undefined {
	const srcDir = new URL(astroConfig.srcDir, astroConfig.root);
	const docsDir = new URL('content/docs/', srcDir);
	const slug = path
		// Format path to unix style path.
		?.replace(/\\/g, '/')
		// Strip docs path leaving only content collection file ID.
		// Example: /Users/houston/repo/src/content/docs/en/guide.md => en/guide.md
		.replace(docsDir.pathname, '');
	return slugToLocale(slug, starlightConfig.locales);
}
