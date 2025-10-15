import type { ViteUserConfig } from 'astro';
import MagicString from 'magic-string';

const starlightPageImportSource = '@astrojs/starlight/components/StarlightPage.astro';

/**
 * Vite plugin that ensures the StarlightPage component is always imported first when imported in
 * an Astro file.
 *
 * This is necessary to ensure a predictable CSS layer order which is defined by the `<Page />`
 * imported by the `<StarlightPage />` component. If a user imports any other component using
 * cascade layers before the `<StarlightPage />` component, it will result in undesired layers
 * being created before we explicitly set the expected layer order.
 */
export function vitePluginStarlightCssLayerOrder(): VitePlugin {
	return {
		name: 'vite-plugin-starlight-css-layer-order',
		enforce: 'pre',
		transform(code, id) {
			if (
				!id.endsWith('.astro') ||
				id.endsWith(starlightPageImportSource) ||
				code.indexOf('StarlightPage.astro') === -1
			) {
				return;
			}

			let ast: ReturnType<typeof this.parse>;

			try {
				ast = this.parse(code);
			} catch {
				return;
			}

			let hasStarlightPageImport = false;

			for (const node of ast.body) {
				if (node.type !== 'ImportDeclaration') continue;
				if (node.source.value !== starlightPageImportSource) continue;

				const importDefaultSpecifier = node.specifiers.find(
					(specifier) => specifier.type === 'ImportDefaultSpecifier'
				);
				if (!importDefaultSpecifier) continue;

				hasStarlightPageImport = true;
				break;
			}

			if (!hasStarlightPageImport) return;

			// Format path to unix style path.
			const filename = id.replace(/\\/g, '/');
			const ms = new MagicString(code, { filename });
			ms.prepend(`import "${starlightPageImportSource}";\n`);

			return {
				code: ms.toString(),
				map: ms.generateMap({ hires: 'boundary' }),
			};
		},
	};
}

type VitePlugin = NonNullable<ViteUserConfig['plugins']>[number];
