import { glob, type Loader } from 'astro/loaders';

// https://github.com/withastro/astro/blob/main/packages/astro/src/core/constants.ts#L87
// https://github.com/withastro/astro/blob/main/packages/integrations/mdx/src/index.ts#L59
const docsExtensions = ['markdown', 'mdown', 'mkdn', 'mkd', 'mdwn', 'md', 'mdx'];
const i18nExtensions = ['json', 'yml', 'yaml'];

// TODO(HiDeoo) Do we need to support Markdoc or does the integration still handle that for us?
// https://github.com/withastro/astro/blob/next/packages/integrations/markdoc/src/index.ts#L28

export function docsLoader(base: string | URL): Loader {
	return {
		name: 'starlight-docs-loader',
		load: createGlobLoadFn(base, docsExtensions),
	};
}

export function i18nLoader(base: string | URL): Loader {
	return {
		name: 'starlight-i18n-loader',
		load: createGlobLoadFn(base, i18nExtensions),
	};
}

function createGlobLoadFn(base: string | URL, extensions: string[]): Loader['load'] {
	return glob({ base, pattern: `**/[^_]*.{${extensions.join(',')}}` }).load;
}
