import type { AstroConfig, HookParameters, ViteUserConfig } from 'astro';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveCollectionPath } from '../utils/collection';
import type { StarlightConfig } from '../utils/user-config';
import { getAllNewestCommitDate } from '../utils/git';
import type { PluginTranslations } from '../utils/plugins';

function resolveVirtualModuleId<T extends string>(id: T): `\0${T}` {
	return `\0${id}`;
}

/** Vite plugin that exposes Starlight user config and project context via virtual modules. */
export function vitePluginStarlightUserConfig(
	command: HookParameters<'astro:config:setup'>['command'],
	opts: StarlightConfig,
	{
		build,
		legacy,
		root,
		srcDir,
		trailingSlash,
	}: Pick<AstroConfig, 'root' | 'srcDir' | 'trailingSlash'> & {
		build: Pick<AstroConfig['build'], 'format'>;
		legacy: Pick<AstroConfig['legacy'], 'collections'>;
	},
	pluginTranslations: PluginTranslations
): NonNullable<ViteUserConfig['plugins']>[number] {
	/**
	 * Resolves module IDs to a usable format:
	 * - Relative paths (e.g. `'./module.js'`) are resolved against `base` and formatted as an absolute path.
	 * - Package identifiers (e.g. `'module'`) are returned unchanged.
	 *
	 * By default, `base` is the project root directory.
	 */
	const resolveId = (id: string, base = root) =>
		JSON.stringify(id.startsWith('.') ? resolve(fileURLToPath(base), id) : id);

	/**
	 * Resolves a path to a Starlight file relative to this file.
	 * @example
	 * resolveLocalPath('../utils/git.ts');
	 * // => '"/users/houston/docs/node_modules/@astrojs/starlight/utils/git.ts"'
	 */
	const resolveLocalPath = (path: string) =>
		JSON.stringify(fileURLToPath(new URL(path, import.meta.url)));

	const rootPath = fileURLToPath(root);
	const docsPath = resolveCollectionPath('docs', srcDir);

	let collectionConfigImportPath = resolve(
		fileURLToPath(srcDir),
		legacy.collections ? './content/config.ts' : './content.config.ts'
	);
	// If not using legacy collections and the config doesn't exist, fallback to the legacy location.
	// We need to test this ahead of time as we cannot `try/catch` a failing import in the virtual
	// module as this would fail at build time when Rollup tries to resolve a non-existent path.
	if (!legacy.collections && !existsSync(collectionConfigImportPath)) {
		collectionConfigImportPath = resolve(fileURLToPath(srcDir), './content/config.ts');
	}

	const virtualComponentModules = Object.fromEntries(
		Object.entries(opts.components).map(([name, path]) => [
			`virtual:starlight/components/${name}`,
			`export { default } from ${resolveId(path)};`,
		])
	);

	/** Map of virtual module names to their code contents as strings. */
	const modules = {
		'virtual:starlight/user-config': `export default ${JSON.stringify(opts)}`,
		'virtual:starlight/project-context': `export default ${JSON.stringify({
			build: { format: build.format },
			legacyCollections: legacy.collections,
			root,
			srcDir,
			trailingSlash,
		})}`,
		'virtual:starlight/git-info':
			(command !== 'build'
				? `import { makeAPI } from ${resolveLocalPath('../utils/git.ts')};` +
					`const api = makeAPI(${JSON.stringify(rootPath)});`
				: `import { makeAPI } from ${resolveLocalPath('../utils/gitInlined.ts')};` +
					`const api = makeAPI(${JSON.stringify(getAllNewestCommitDate(rootPath, docsPath))});`) +
			'export const getNewestCommitDate = api.getNewestCommitDate;',
		'virtual:starlight/user-css': opts.customCss.map((id) => `import ${resolveId(id)};`).join(''),
		'virtual:starlight/user-images': opts.logo
			? 'src' in opts.logo
				? `import src from ${resolveId(
						opts.logo.src
					)}; export const logos = { dark: src, light: src };`
				: `import dark from ${resolveId(opts.logo.dark)}; import light from ${resolveId(
						opts.logo.light
					)}; export const logos = { dark, light };`
			: 'export const logos = {};',
		'virtual:starlight/collection-config': `let userCollections;
			try {
				userCollections = (await import(${JSON.stringify(collectionConfigImportPath)})).collections;
			} catch {}
			export const collections = userCollections;`,
		'virtual:starlight/plugin-translations': `export default ${JSON.stringify(pluginTranslations)}`,
		'virtual:starlight/pagefind-config': `export const pagefindUserConfig = ${JSON.stringify(opts.pagefind || {})}`,
		...virtualComponentModules,
	} satisfies Record<string, string>;

	/** Mapping names prefixed with `\0` to their original form. */
	const resolutionMap = Object.fromEntries(
		(Object.keys(modules) as (keyof typeof modules)[]).map((key) => [
			resolveVirtualModuleId(key),
			key,
		])
	);

	return {
		name: 'vite-plugin-starlight-user-config',
		resolveId(id): string | void {
			if (id in modules) return resolveVirtualModuleId(id);
		},
		load(id): string | void {
			const resolution = resolutionMap[id];
			if (resolution) return modules[resolution];
		},
	};
}
