import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
	srcDir: './www',
	integrations: [
		starlight({
			title: 'Custom src directory',
			pagefind: false,
		}),
	],
});
