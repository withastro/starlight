import { glob, type Loader } from 'astro/loaders';

// https://github.com/withastro/astro/blob/main/packages/astro/src/core/constants.ts#L87
// https://github.com/withastro/astro/blob/main/packages/integrations/mdx/src/index.ts#L59
const docsExtensions = ['markdown', 'mdown', 'mkdn', 'mkd', 'mdwn', 'md', 'mdx'];
const i18nExtensions = ['json', 'yml', 'yaml'];

// TODO(HiDeoo) We still rely on the content folder structure to be fixed for now:
// - At build time, we get all the last commit dates for each file in the docs folder ahead of
//   time. In the current approach, we cannot know at this time the user-defined content folder
//   path as this would only be available from the loader. A potential solution could be to do
//   that from a custom loader re-implementing the glob loader. Although, we don't have access to
//   the Starlight configuration from the loader to even know we should do that.
// - Remark plugins get passed down an absolute path to a content file and we need to figure out
//   the language from that path. Without knowing the content folder path, we cannot reliably do
//   so.
const docsBase = './src/content/docs';
const i18nBase = './src/content/i18n';

// TODO(HiDeoo) Do we need to support Markdoc or does the integration still handle that for us?
// https://github.com/withastro/astro/blob/next/packages/integrations/markdoc/src/index.ts#L28

export function docsLoader(): Loader {
	return {
		name: 'starlight-docs-loader',
		load: createGlobLoadFn(docsBase, docsExtensions),
	};
}

export function i18nLoader(): Loader {
	return {
		name: 'starlight-i18n-loader',
		load: createGlobLoadFn(i18nBase, i18nExtensions),
	};
}

function createGlobLoadFn(base: string | URL, extensions: string[]): Loader['load'] {
	return glob({ base, pattern: `**/[^_]*.{${extensions.join(',')}}` }).load;
}
