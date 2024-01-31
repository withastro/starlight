import type { AstroConfig, ViteUserConfig } from 'astro';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StarlightConfig } from '../utils/user-config';

function resolveVirtualModuleId<T extends string>(id: T): `\0${T}` {
	return `\0${id}`;
}

/** Vite plugin that exposes Starlight user config and project context via virtual modules. */
export function vitePluginStarlightUserConfig(
	opts: StarlightConfig,
	{
		build,
		root,
		srcDir,
		trailingSlash,
	}: Pick<AstroConfig, 'root' | 'srcDir' | 'trailingSlash'> & {
		build: Pick<AstroConfig['build'], 'format'>;
	}
): NonNullable<ViteUserConfig['plugins']>[number] {
	const resolveId = (id: string) =>
		JSON.stringify(id.startsWith('.') ? resolve(fileURLToPath(root), id) : id);

	const virtualComponentModules = Object.fromEntries(
		Object.entries(opts.components).map(([name, path]) => [
			`virtual:starlight/components/${name}`,
			`export { default } from ${resolveId(path)};`,
		])
	);

	// TODO(HiDeoo) Clean this
	const collectionConfigPath = '/src/content/config.ts';
	// const collectionConfigPath = resolve(fileURLToPath(root), 'src/content/test.ts');

	// TODO(HiDeoo) Comment this when this is working
	const collectionConfigModule = `import { defineCollection } from 'astro:content';
		import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
		let userCollections;
		try {
			userCollections = (await import('${collectionConfigPath}')).collections;
			// TODO(HiDeoo) Remove this
			console.log('🚨 [virtual-user-config.ts:41] userCollections:', userCollections)
		} catch (error) {
			// TODO(HiDeoo) Remove this
			console.log('🚨 [virtual-user-config.ts:43] error:', error)
		}
		if (!userCollections) {
			userCollections = {
				docs: defineCollection({ schema: docsSchema() }),
				i18n: defineCollection({ type: 'data', schema: i18nSchema() }),
			};
		}
		export const collections = userCollections;`;

	/** Map of virtual module names to their code contents as strings. */
	const modules = {
		'virtual:starlight/user-config': `export default ${JSON.stringify(opts)}`,
		'virtual:starlight/project-context': `export default ${JSON.stringify({
			build: { format: build.format },
			root,
			srcDir,
			trailingSlash,
		})}`,
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
		'virtual:starlight/collection-config': collectionConfigModule,
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
