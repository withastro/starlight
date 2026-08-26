import codspeedPlugin from '@codspeed/vitest-plugin';
import { defineVitestConfig } from './__tests__/test-config';

const testConfig = await defineVitestConfig(
	{
		title: 'Starlight benchmarks',
		sidebar: [{ label: 'Reference', items: [{ autogenerate: { directory: 'reference' } }] }],
	},
	{ snapshotSerializers: false }
);

export default async (env: Parameters<typeof testConfig>[0]) => {
	const config = await testConfig(env);
	return {
		...config,
		plugins: [...(config.plugins ?? []), codspeedPlugin()],
		benchmark: {
			include: ['__bench_fn__/*.bench.ts'],
		},
		test: {
			...config.test,
			fileParallelism: false,
			hookTimeout: 600_000,
		},
	};
};
