import { glob, type Loader, type LoaderContext } from 'astro/loaders';

// https://github.com/withastro/astro/blob/main/packages/astro/src/core/constants.ts#L87
// https://github.com/withastro/astro/blob/main/packages/integrations/mdx/src/index.ts#L59
const docsExtensions = ['markdown', 'mdown', 'mkdn', 'mkd', 'mdwn', 'md', 'mdx'];
const i18nExtensions = ['json', 'yml', 'yaml'];

export function docsLoader(): Loader {
	return {
		name: 'starlight-docs-loader',
		load: createGlobLoadFn('docs'),
	};
}

export function i18nLoader(): Loader {
	return {
		name: 'starlight-i18n-loader',
		load: createGlobLoadFn('i18n'),
	};
}

function createGlobLoadFn(type: GlobLoadFnType): Loader['load'] {
	return (context: LoaderContext) => {
		// TODO(HiDeoo) We still rely on the content folder structure to be fixed for now:
		// - At build time, if the feature is enabled, we get all the last commit dates for each file
		//   in the docs folder ahead of time. In the current approach, we cannot know at this time the
		//   user-defined content folder path as this would only be available from the loader. A
		//   potential solution could be to do that from a custom loader re-implementing the glob
		//   loader. Although, we don't have access to the Starlight configuration from the loader to
		//   even know we should do that.
		// - Remark plugins get passed down an absolute path to a content file and we need to figure
		//   out the language from that path. Without knowing the content folder path, we cannot
		//   reliably do so.
		const base =
			context.config.srcDir.pathname.replace(context.config.root.pathname, '') + 'content/' + type;
		const extensions = type === 'docs' ? docsExtensions : i18nExtensions;

		if (
			type === 'docs' &&
			context.config.integrations.find(({ name }) => name === '@astrojs/markdoc')
		) {
			// https://github.com/withastro/astro/blob/main/packages/integrations/markdoc/src/content-entry-type.ts#L28
			extensions.push('mdoc');
		}

		return glob({
			base,
			pattern: `**/[^_]*.{${extensions.join(',')}}`,
		}).load(context);
	};
}

type GlobLoadFnType = 'docs' | 'i18n';
