import type { AstroIntegration } from 'astro';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export default function StarbookIntegration(): AstroIntegration {
  return {
    name: 'starbook',
    hooks: {
      'astro:config:setup': ({ injectRoute }) => {
        injectRoute({
          pattern: '[...slug]',
          entryPoint: require.resolve('./index.astro'),
        });
      },
    },
  };
}
