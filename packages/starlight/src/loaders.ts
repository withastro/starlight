import { glob, type Loader, type LoaderContext } from 'astro/loaders';
import { getCollectionPathFromRoot, type StarlightCollection } from './utils/collection';

// https://github.com/withastro/astro/blob/main/packages/astro/src/core/constants.ts#L87
// https://github.com/withastro/astro/blob/main/packages/integrations/mdx/src/index.ts#L59
const docsExtensions = ['markdown', 'mdown', 'mkdn', 'mkd', 'mdwn', 'md', 'mdx'];
const i18nExtensions = ['json', 'yml', 'yaml'];

type GlobOptions = Parameters<typeof glob>[0];
type GenerateIdFunction = NonNullable<GlobOptions['generateId']>;

/**
 * Loads content files from the `src/content/docs/` directory, ignoring filenames starting with `_`.
 */
export function docsLoader({
	generateId,
}: {
	/**
	 * Function that generates an ID for an entry. Default implementation generates a slug from the entry path.
	 * @returns The ID of the entry. Must be unique per collection.
	 **/
	generateId?: GenerateIdFunction;
} = {}): Loader {
	return {
		name: 'starlight-docs-loader',
		load: createGlobLoadFn('docs', generateId),
	};
}

/**
 * Loads data files from the `src/content/i18n/` directory, ignoring filenames starting with `_`.
 */
export function i18nLoader(): Loader {
	return {
		name: 'starlight-i18n-loader',
		load: createGlobLoadFn('i18n'),
	};
}

function createGlobLoadFn(
	collection: StarlightCollection,
	generateId?: GenerateIdFunction
): Loader['load'] {
	return (context: LoaderContext) => {
		const extensions = collection === 'docs' ? docsExtensions : i18nExtensions;

		if (
			collection === 'docs' &&
			context.config.integrations.find(({ name }) => name === '@astrojs/markdoc')
		) {
			// https://github.com/withastro/astro/blob/main/packages/integrations/markdoc/src/content-entry-type.ts#L28
			extensions.push('mdoc');
		}

		const options: GlobOptions = {
			base: getCollectionPathFromRoot(collection, context.config),
			pattern: `**/[^_]*.{${extensions.join(',')}}`,
		};
		if (generateId) options.generateId = generateId;

		return glob(options).load(context);
	};
}
