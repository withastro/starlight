import { glob, type Loader, type LoaderContext } from 'astro/loaders';
import { getCollectionPathFromRoot, type StarlightCollection } from './utils/collection';

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

function createGlobLoadFn(collection: StarlightCollection): Loader['load'] {
	return (context: LoaderContext) => {
		const extensions = collection === 'docs' ? docsExtensions : i18nExtensions;

		if (
			collection === 'docs' &&
			context.config.integrations.find(({ name }) => name === '@astrojs/markdoc')
		) {
			// https://github.com/withastro/astro/blob/main/packages/integrations/markdoc/src/content-entry-type.ts#L28
			extensions.push('mdoc');
		}

		return glob({
			base: getCollectionPathFromRoot(collection, context.config),
			pattern: `**/[^_]*.{${extensions.join(',')}}`,
		}).load(context);
	};
}
