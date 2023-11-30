import type { StarlightPlugin } from '@astrojs/starlight/types';
import { getThings } from './things';

export function virtualPagesDemo(): StarlightPlugin {
	return {
		name: 'virtual-pages-demo',
		hooks: {
			setup({ addIntegration, config, updateConfig }) {
				addIntegration({
					name: 'virtual-pages-demo-integration',
					hooks: {
						'astro:config:setup': ({ injectRoute }) => {
							injectRoute({
								entryPoint: 'virtual-pages-demo/route',
								pattern: '[...virtualPagesDemoSlug]',
							});
						},
					},
				});

				updateConfig({
					sidebar: [
						...(config.sidebar ?? []),
						{
							label: 'Virtual pages',
							items: getThings().map((thing) => ({
								label: `Thing ${thing}`,
								link: `virtual-pages-demo/${thing}/`,
							})),
						},
					],
				});
			},
		},
	};
}
