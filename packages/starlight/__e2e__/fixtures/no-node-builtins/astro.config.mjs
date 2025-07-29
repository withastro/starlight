// @ts-check
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import { preventNodeBuiltinDependencyPlugin } from './src/noNodeModule';

export default defineConfig({
	integrations: [
		starlight({
			title: 'No Node Builtins',
			pagefind: false,
		}),
	],
	vite: {
		plugins: [preventNodeBuiltinDependencyPlugin()],
	},
});
