import type { AstroConfig, ViteUserConfig } from 'astro';
import type { StarlightConfig } from '../utils/user-config';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Vite plugin that allows the user to override internal components. */
export function vitePluginStarlightOverrides(
	opts: StarlightConfig,
	{ root }: Pick<AstroConfig, 'root'>
): NonNullable<ViteUserConfig['plugins']>[number] {
  if (!opts.components) return
	return {
		name: 'vite-plugin-starlight-overrides',
		load(id): string | void {
      // Local development of Starlight doesn't include the package name in the module resolution. To get around this, we check for the filepath
      if (!id.includes('packages/starlight/components/') && !id.includes('@astrojs/starlight/components/')) return
      let name = id.split('packages/starlight/components/').at(-1)?.split('@astrojs/starlight/components/').at(-1)

      if (!name?.endsWith('.astro')) return
      name = name.slice(0, name.length - 6)

      const moduleName = opts.components?.[name]
      if (!moduleName) return

      return readFileSync(join(root.pathname, moduleName), 'utf8')
		},
	};
}
