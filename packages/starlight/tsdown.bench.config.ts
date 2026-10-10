import { defineConfig } from 'tsdown';

export default defineConfig({
	deps: {
		neverBundle: [/^astro:/, /^virtual:starlight\//],
	},
	entry: ['__bench_fn__/benchmark-functions.ts'],
	outDir: '__bench_fn__/dist',
});
