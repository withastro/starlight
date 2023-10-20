import { defineVitestConfig } from '../test-config';

export default defineVitestConfig({
	title: 'Plugins',
	sidebar: [{ label: 'Getting Started', link: 'getting-started' }],
	plugins: [
		{
			name: 'test-plugin-1',
			plugin({ config, updateConfig }) {
				updateConfig({
					title: `${config.title} - Custom`,
					description: 'plugin 1',
				});
			},
		},
		{
			name: 'test-plugin-2',
			plugin({ config, updateConfig }) {
				updateConfig({
					description: `${config.description} - plugin 2`,
					sidebar: [{ label: 'Showcase', link: 'showcase' }],
				});
			},
		},
		{
			name: 'test-plugin-3',
			async plugin({ config, updateConfig }) {
				await Promise.resolve();
				updateConfig({
					description: `${config.description} - plugin 3`,
				});
			},
		},
	],
});
