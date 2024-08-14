import type { AstroUserConfig } from 'astro';
import esbuild from 'esbuild';

type VitePlugin = NonNullable<NonNullable<AstroUserConfig['vite']>['plugins']>[number];

export const vitePluginMinifiedImports = () =>
	({
		name: 'vite-plugin-minified-imports',
		async transform(code, id) {
			if (!id.endsWith('?sl-inline-minified')) return null;
			const minified = await esbuild.transform(code, { minify: true });
			return `export default ${JSON.stringify(minified.code)}`;
		},
	}) satisfies VitePlugin;
