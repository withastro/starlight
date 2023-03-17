import type { AstroIntegration } from 'astro';

export default function StarbookIntegration(): AstroIntegration {
  return {
    name: 'starbook',
    hooks: {
      'astro:config:setup': ({ injectRoute }) => {
        injectRoute({
          pattern: '[...slug]',
          entryPoint: 'starbook/index.astro',
        });
      },
    },
  };
}
