import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
// TODO(HiDeoo) Remove or keep depending on the final decision regarding the peer dep change
import mdx from '@astrojs/mdx';

export default defineConfig({
	integrations: [
		starlight({
			title: 'Basics',
			pagefind: false,
		}),
		// TODO(HiDeoo) Remove or keep depending on the final decision regarding the peer dep change
		mdx(),
	],
});
