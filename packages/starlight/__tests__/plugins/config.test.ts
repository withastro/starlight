import { describe, expect, test } from 'vitest';
import config from 'virtual:starlight/user-config';
import { getSidebar } from '../../utils/navigation';
import { runPlugins } from '../../utils/plugins';
import { TestAstroIntegrationLogger } from '../test-config';

test('reads and updates a configuration option', () => {
	expect(config.title).toBe('Plugins - Custom');
});

test('overwrites a configuration option', () => {
	expect(getSidebar('/', undefined)).toMatchObject([{ href: '/showcase/', label: 'Showcase' }]);
});

test('runs plugins in the order that they are configured and always passes down the latest user config', () => {
	expect(config.description).toBe('plugin 1 - plugin 2 - plugin 3');
});

test('receives the user provided configuration without any Zod `transform`s applied', () => {
	/**
	 * If the `transform` associated to the favicon schema was applied, the favicon `href` would be
	 * `invalid.svg`.
	 * @see {@link file://./vitest.config.ts} for more details in the `test-plugin-1` plugin.
	 */
	expect(config.favicon.href).toBe('valid.svg');
});

describe('validation', () => {
	test('validates starlight configuration before running plugins', async () => {
		expect(
			async () =>
				await runPlugins(
					// @ts-expect-error - invalid sidebar config.
					{ title: 'Test Docs', sidebar: true },
					[],
					new TestAstroIntegrationLogger()
				)
		).rejects.toThrowError(/Invalid config passed to starlight integration/);
	});

	test('validates plugins configuration before running them', async () => {
		expect(
			async () =>
				await runPlugins(
					{ title: 'Test Docs' },
					// @ts-expect-error - invalid plugin with no `hooks` defined.
					[{ name: 'invalid-plugin' }],
					new TestAstroIntegrationLogger()
				)
		).rejects.toThrowError(/Invalid plugins config passed to starlight integration/);
	});

	test('validates configuration updates from plugins', async () => {
		expect(
			async () =>
				await runPlugins(
					{ title: 'Test Docs' },
					[
						{
							name: 'test-plugin',
							hooks: {
								setup: ({ updateConfig }) => {
									// @ts-expect-error - invalid sidebar config update.
									updateConfig({ description: true });
								},
							},
						},
					],
					new TestAstroIntegrationLogger()
				)
		).rejects.toThrowError(/Invalid config update provided by the 'test-plugin' plugin/);
	});
});

test('does not expose plugins to the config virtual module', () => {
	// @ts-expect-error - plugins are not serializable and thus not in the config virtual module.
	expect(config.plugins).not.toBeDefined();
});
