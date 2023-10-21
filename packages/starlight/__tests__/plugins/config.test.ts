import { expect, test } from 'vitest';
import config from 'virtual:starlight/user-config';
import { getSidebar } from '../../utils/navigation';

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

test('does not expose plugins to the config virtual module', () => {
	// @ts-expect-error - plugins are not serializable and thus not in the config virtual module
	expect(config.plugins).not.toBeDefined();
});
