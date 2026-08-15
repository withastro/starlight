// @ts-check
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import { preventNodeBuiltinDependencyPlugin } from './src/noNodeModule';

export default defineConfig({
	integrations: [
		starlight({
			title: 'Basics',
			pagefind: false,
			markdown: { processedDirs: ['./src/content/comments/'] },
		}),
	],
	vite: {
		plugins: [preventNodeBuiltinDependencyPlugin()],
	},
});
