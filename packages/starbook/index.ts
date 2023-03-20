import type { AstroIntegration, AstroUserConfig, ViteUserConfig } from 'astro';
import { StarbookConfig } from './types';

const virtualModuleId = 'virtual:starbook/user-config';
const resolvedVirtualModuleId = '\0' + virtualModuleId;

export default function StarbookIntegration(
  opts: StarbookConfig
): AstroIntegration {
  return {
    name: 'starbook',
    hooks: {
      'astro:config:setup': ({ injectRoute, updateConfig }) => {
        injectRoute({
          pattern: '[...slug]',
          entryPoint: 'starbook/index.astro',
        });
        const newConfig: AstroUserConfig = {
          vite: {
            plugins: [vitePluginStarBookUserConfig(opts)],
          },
        };
        updateConfig(newConfig);
      },
    },
  };
}

/** Expose the StarBook user config object via a virtual module. */
function vitePluginStarBookUserConfig(
  opts: StarbookConfig
): NonNullable<ViteUserConfig['plugins']>[number] {
  return {
    name: 'vite-plugin-starbook-user-config',
    resolveId(id) {
      if (id === virtualModuleId) return resolvedVirtualModuleId;
    },
    load(id) {
      if (id === resolvedVirtualModuleId)
        return `export default ${JSON.stringify(opts)}`;
    },
  };
}
