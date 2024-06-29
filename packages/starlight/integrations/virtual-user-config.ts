import type { AstroConfig, ViteUserConfig } from 'astro';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StarlightConfig } from '../utils/user-config';
import { getNewestCommitDate, listGitTrackedFiles } from '../utils/git';

function resolveVirtualModuleId<T extends string>(id: T): `\0${T}` {
	return `\0${id}`;
}

/** Vite plugin that exposes Starlight user config and project context via virtual modules. */
export function vitePluginStarlightUserConfig(
	command: 'dev' | 'build' | 'preview',
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

	const srcDirectory = resolve(fileURLToPath(root), 'src/content/docs');

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
		'virtual:starlight/git-info': generateGitInfoModule({ command, srcDirectory }),
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
				userCollections = (await import('${new URL('./content/config.ts', srcDir).pathname}')).collections;
			} catch {}
			export const collections = userCollections;`,
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

function generateGitInfoModule({
	command,
	srcDirectory,
}: {
	command: 'dev' | 'build' | 'preview';
	srcDirectory: string;
}) {
	if (command === 'dev') {
		const onDemandGitInfoModule = new URL('../utils/git.ts', import.meta.url);

		// In dev mode expose the function directly so git is executed only when needed.
		return `export {getNewestCommitDate} from '${onDemandGitInfoModule}';`;
	}

	const docsPath = resolve('content/docs', srcDirectory);

	const trackedDocsFiles = listGitTrackedFiles(docsPath).map((file) => [
		relative(docsPath, file),
		getNewestCommitDate(file).valueOf(),
	]);

	return `
const trackedDocsFiles = new Map(${JSON.stringify(trackedDocsFiles)});

export function getNewestCommitDate(file) {
	const timestamp = trackedDocsFiles.get(file);
	if (!timestamp) throw new Error('File not found in git history');
	return new Date(timestamp);
}`;
}
