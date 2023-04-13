import type {
  AstroConfig,
  AstroIntegration,
  AstroUserConfig,
  ViteUserConfig,
} from 'astro';
import { spawn } from 'node:child_process';
import { dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { starbookAsides } from './integrations/asides';
import {
  StarBookUserConfig,
  StarbookConfig,
  StarbookConfigSchema,
} from './utils/user-config';

export default function StarbookIntegration(
  opts: StarBookUserConfig
): AstroIntegration {
  const userConfig = StarbookConfigSchema.parse(opts);

  return {
    name: 'starbook',
    hooks: {
      'astro:config:setup': ({
        config,
        injectRoute,
        updateConfig,
        command,
      }) => {
        injectRoute({
          pattern: '[...slug]',
          entryPoint: 'starbook/index.astro',
        });
        injectRoute({
          pattern: '[...path]',
          entryPoint: 'starbook/pagefind.ts',
        });
        const newConfig: AstroUserConfig = {
          vite: {
            plugins: [vitePluginStarBookUserConfig(userConfig, config)],
            ssr: {
              external: command === 'dev' ? ['@astrojs/markdown-remark'] : [],
            },
          },
          markdown: {
            remarkPlugins: [...starbookAsides()],
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

function resolveVirtualModuleId(id: string) {
  return '\0' + id;
}

/** Expose the StarBook user config object via a virtual module. */
function vitePluginStarBookUserConfig(
  opts: StarbookConfig,
  { root }: AstroConfig
): NonNullable<ViteUserConfig['plugins']>[number] {
  const modules = {
    'virtual:starbook/user-config': `export default ${JSON.stringify(opts)}`,
    'virtual:starbook/project-context': `export default ${JSON.stringify({
      root,
    })}`,
    'virtual:starbook/user-css': opts.customCss
      .map((id) => `import "${id}";`)
      .join(''),
  };
  const resolutionMap = Object.fromEntries(
    (Object.keys(modules) as (keyof typeof modules)[]).map((key) => [
      resolveVirtualModuleId(key),
      key,
    ])
  );

  return {
    name: 'vite-plugin-starbook-user-config',
    resolveId(id): string | void {
      if (id in modules) return resolveVirtualModuleId(id);
    },
    load(id): string | void {
      const resolution = resolutionMap[id];
      if (resolution) return modules[resolution];
    },
  };
}
