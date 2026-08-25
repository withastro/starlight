import { afterEach, expect, test, vi } from 'vitest';

const code = 'export {}';

afterEach(() => {
	vi.doUnmock('node:url');
	vi.resetModules();
});

test('marks the Starlight components barrel as side-effect free for different path formats', async () => {
	const transform = await getTransform(
		String.raw`C:\project\node_modules\@astrojs\starlight\components.ts`
	);

	for (const id of [
		'C:/project/node_modules/@astrojs/starlight/components.ts',
		String.raw`C:\project\node_modules\@astrojs\starlight\components.ts`,
		'C:/project/node_modules/@astrojs/starlight/components.ts?astro&type=script',
	]) {
		expect(transform.filter.id.test(id)).toBe(true);
		expect(transform.handler(code, id)).toEqual({
			code,
			moduleSideEffects: false,
		});
	}
});

test('only marks the Starlight components barrel as side-effect free', async () => {
	const transform = await getTransform('/project/node_modules/@astrojs/starlight/components.ts');

	expect(transform.filter.id.test('/project/src/components.ts')).toBe(true);
	expect(transform.handler(code, '/project/src/components.ts')).toBeUndefined();

	expect(transform.filter.id.test('/project/src/my-components.ts')).toBe(false);
	expect(transform.handler(code, '/project/src/my-components.ts')).toBeUndefined();
});

async function getTransform(componentBarrelPath: string) {
	vi.resetModules();
	vi.doMock('node:url', async (importOriginal) => {
		const url = await importOriginal<typeof import('node:url')>();

		return { ...url, fileURLToPath: () => componentBarrelPath };
	});

	// Reset the modules registry and re-import the plugin so the module can be re-evaluated and
	// `starlightComponentsBarrelId` re-computed.
	const { vitePluginStarlightLazyBarrelOptimization } = await import(
		'../../integrations/vite-lazy-barrel-optimization'
	);
	const plugin = vitePluginStarlightLazyBarrelOptimization();

	return (
		plugin as {
			transform: { filter: { id: RegExp }; handler: (code: string, id: string) => unknown };
		}
	).transform;
}
