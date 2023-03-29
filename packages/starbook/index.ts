import type { AstroIntegration, AstroUserConfig, ViteUserConfig } from 'astro';
import { spawn } from 'node:child_process';
import { dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  StarBookUserConfig,
  StarbookConfig,
  StarbookConfigSchema,
} from './utils/user-config';

const virtualModuleId = 'virtual:starbook/user-config';
const resolvedVirtualModuleId = '\0' + virtualModuleId;

export default function StarbookIntegration(
  opts: StarBookUserConfig
): AstroIntegration {
  const config = StarbookConfigSchema.parse(opts);

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
            plugins: [vitePluginStarBookUserConfig(config)],
          },
        };
        updateConfig(newConfig);
      },

      'astro:build:done': ({ dir }) => {
        const targetDir = fileURLToPath(dir);
        const cwd = dirname(fileURLToPath(import.meta.url));
        const relativeDir = relative(cwd, targetDir);
        return new Promise<void>((resolve) => {
          spawn('npx', ['-y', 'pagefind', '--source', relativeDir], {
            stdio: 'inherit',
            shell: true,
            cwd,
          }).on('close', () => resolve());
        });
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
    resolveId(id): string | void {
      if (id === virtualModuleId) return resolvedVirtualModuleId;
    },
    load(id): string | void {
      if (id === resolvedVirtualModuleId)
        return `export default ${JSON.stringify(opts)}`;
    },
  };
}
