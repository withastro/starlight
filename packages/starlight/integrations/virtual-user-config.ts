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
		'virtual:starlight/git-info': generateGitInfoModule({
			command,
			root: fileURLToPath(root),
			srcDir: fileURLToPath(srcDir),
		}),
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
	root,
	srcDir,
}: {
	command: 'dev' | 'build' | 'preview';
	root: string;
	srcDir: string;
}) {
	const docsPath = resolve(srcDir, 'content/docs');

	if (command !== 'build') {
		const onDemandGitInfoModule = new URL('../utils/git.ts', import.meta.url);

		// In dev mode expose the function directly so git is executed only when needed.
		return `import {getNewestCommitDate as getInternal} from '${onDemandGitInfoModule}';
import { resolve } from 'node:path';

export const getNewestCommitDate = (file) => getInternal(
	resolve(${JSON.stringify(docsPath)}, file)
);
`;
	}

	const trackedDocsFiles = listGitTrackedFiles(docsPath).flatMap((file) => {
		try {
			return [[relative(docsPath, file), getNewestCommitDate(file).valueOf()]];
		} catch {
			// Files tracked but deleted in the staging area of git will be on the list
			// but fail to retrieve the commit info.
			return [];
		}
	});

	return `
const trackedDocsFiles = new Map(${JSON.stringify(trackedDocsFiles)});

export function getNewestCommitDate(file) {
	const timestamp = trackedDocsFiles.get(file);
	if (!timestamp) throw new Error(\`Failed to retrieve the git history for file "\${file}"\`);
	return new Date(timestamp);
}`;
}
