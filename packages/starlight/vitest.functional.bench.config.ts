import { fileURLToPath } from 'node:url';
import codspeedPlugin from '@codspeed/vitest-plugin';
import { defineVitestConfig } from './__tests__/test-config';

const testConfig = await defineVitestConfig({
	title: 'Starlight benchmarks',
	sidebar: [{ label: 'Reference', items: [{ autogenerate: { directory: 'reference' } }] }],
});

export default async (env: Parameters<typeof testConfig>[0]) => {
	const config = await testConfig(env);
	return {
		...config,
		plugins: [...(config.plugins ?? []), codspeedPlugin()],
		resolve: {
			...config.resolve,
			/** @see {@link file://./__bench_fn__/benchmark-functions.ts} */
			alias: {
				'./benchmark-functions': fileURLToPath(
					new URL('./__bench_fn__/dist/benchmark-functions.mjs', import.meta.url)
				),
			},
		},
		test: {
			...config.test,
			// The shared serializer path is not resolvable from this root benchmark config.
			snapshotSerializers: [],
			benchmark: {
				include: ['__bench_fn__/*.bench.ts'],
			},
			fileParallelism: false,
		},
	};
};
