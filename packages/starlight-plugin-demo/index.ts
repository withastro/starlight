import type { StarlightPlugin } from '@astrojs/starlight/types';

// TODO(HiDeoo) Delete this entire plugin.

export default function starlightPluginDemo(): StarlightPlugin {
	return {
		name: 'starlight-plugin-demo',
		hooks: {
			'config:setup': async ({ addIntegration }) => {
				addIntegration({
					name: 'starlight-plugin-integration',
					hooks: {
						'astro:config:setup': ({ injectRoute }) => {
							injectRoute({
								entrypoint: 'starlight-plugin-demo/routes/5.astro',
								pattern: '/tests/5',
								prerender: true,
							});
							injectRoute({
								entrypoint: 'starlight-plugin-demo/routes/6.astro',
								pattern: '/tests/6',
								prerender: true,
							});
							injectRoute({
								entrypoint: 'starlight-plugin-demo/routes/7.astro',
								pattern: '/tests/7',
								prerender: true,
							});
							injectRoute({
								entrypoint: 'starlight-plugin-demo/routes/8.astro',
								pattern: '/tests/8',
								prerender: true,
							});
						},
					},
				});
			},
		},
	};
}
