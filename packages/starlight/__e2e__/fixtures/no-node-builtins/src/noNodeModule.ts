import type { ViteUserConfig } from 'astro';
import { builtinModules } from 'node:module';

const nodeModules = builtinModules.map((name) => [name, `node:${name}`]).flat();

/**
 * A Vite plugin used to verify that the final bundle does not have a hard dependency on Node.js
 * builtins due to Starlight.
 * This is to ensure that Starlight can run on platforms like Cloudflare.
 *
 * @see https://github.com/withastro/astro/blob/8491aa56e8685677af8458ff1c5a80d6461413f8/packages/astro/test/test-plugins.js
 */
export function preventNodeBuiltinDependencyPlugin(): NonNullable<
	ViteUserConfig['plugins']
>[number] {
	return {
		name: 'verify-no-node-stuff',
		generateBundle() {
			nodeModules.forEach((name) => {
				const importers = this.getModuleInfo(name)?.importers || [];
				const starlightPath = new URL('../../../../', import.meta.url).pathname;
				const nodeStarlightImport = importers.find((importer) =>
					importer.startsWith(starlightPath)
				);

				if (nodeStarlightImport) {
					throw new Error(
						'A node builtin dependency imported by Starlight was found in the production bundle:\n\n' +
							` - Node builtin: '${name}'\n` +
							` - Importer: ${nodeStarlightImport}\n`
					);
				}
			});
		},
	};
}
