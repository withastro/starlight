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
