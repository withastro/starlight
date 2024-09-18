import type { AstroConfig, HookParameters, ViteUserConfig } from 'astro';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
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
		root,
		srcDir,
		trailingSlash,
	}: Pick<AstroConfig, 'root' | 'srcDir' | 'trailingSlash'> & {
		build: Pick<AstroConfig['build'], 'format'>;
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

	const docsPath = resolve(fileURLToPath(srcDir), 'content/docs');

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
			root,
			srcDir,
			trailingSlash,
		})}`,
		'virtual:starlight/git-info':
			(command !== 'build'
				? `import { makeAPI } from ${resolveLocalPath('../utils/git.ts')};` +
					`const api = makeAPI(${JSON.stringify(docsPath)});`
				: `import { makeAPI } from ${resolveLocalPath('../utils/gitInlined.ts')};` +
					`const api = makeAPI(${JSON.stringify(getAllNewestCommitDate(docsPath))});`) +
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
				userCollections = (await import(${resolveId('./content/config.ts', srcDir)})).collections;
			} catch {}
			export const collections = userCollections;`,
		'virtual:starlight/plugin-translations': `export default ${JSON.stringify(pluginTranslations)}`,
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
