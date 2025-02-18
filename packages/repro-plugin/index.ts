import type { StarlightPlugin } from '@astrojs/starlight/types';

export default function reproPlugin(): StarlightPlugin {
	return {
		name: 'repro-plugin',
		hooks: {
			'config:setup': ({ addIntegration }) => {
				addIntegration({
					name: 'repro-integration',
					hooks: {
						'astro:config:setup': ({ injectRoute }) => {
							injectRoute({
								entrypoint: 'repro-plugin/Route.astro',
								// This seems to trigger the issue
								pattern: '[...dog]',
								// Using this pattern instead works
								// pattern: '/repro',
								prerender: true,
							});
						},
					},
				});
			},
		},
	};
}
