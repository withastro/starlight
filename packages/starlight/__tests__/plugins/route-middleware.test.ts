import { expect, test } from 'vitest';
import { runPlugins } from '../../src/utils/plugins';
import { createTestPluginContext } from '../test-plugin-utils';

test('adds route middleware entrypoints added by plugins respecting order', async () => {
	const { starlightConfig } = await runPlugins(
		{ title: 'Test Docs', routeMiddleware: 'user' },
		[
			{
				name: 'test-plugin-1',
				hooks: {
					setup({ addRouteMiddleware }) {
						addRouteMiddleware({ entrypoint: 'one' });
					},
				},
			},
			{
				name: 'test-plugin-2',
				hooks: {
					setup({ addRouteMiddleware }) {
						addRouteMiddleware({ entrypoint: 'two', order: 'pre' });
					},
				},
			},
			{
				name: 'test-plugin-3',
				hooks: {
					setup({ addRouteMiddleware }) {
						addRouteMiddleware({ entrypoint: 'three', order: 'post' });
					},
				},
			},
			{
				name: 'test-plugin-4',
				hooks: {
					setup({ addRouteMiddleware }) {
						addRouteMiddleware({ entrypoint: 'four' });
					},
				},
			},
		],
		createTestPluginContext()
	);

	expect(starlightConfig.routeMiddleware).toMatchObject(['two', 'user', 'one', 'four', 'three']);
});
