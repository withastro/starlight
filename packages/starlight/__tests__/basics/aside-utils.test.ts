import { describe, expect, test } from 'vitest';
import { getAsideIcon, getAsideIconName } from '../../src/integrations/aside-utils';
import { Icons } from '../../src/components-internals/Icons';

describe('getAsideIconName()', () => {
	test('returns the default icon of a variant', () => {
		expect(getAsideIconName('note')).toBe('information');
	});

	test('returns a valid custom icon', () => {
		expect(getAsideIconName('note', 'heart')).toBe('heart');
		expect(getAsideIcon('note', 'heart')).toBe(Icons.heart);
	});

	test('throws on an unknown custom icon', () => {
		expect(() => getAsideIconName('note', 'invalid-icon-name')).toThrow('Invalid aside icon');
	});

	test.each(['constructor', 'toString', 'hasOwnProperty', '__proto__'])(
		'throws on a custom icon named after an Object.prototype property (%s)',
		(icon) => {
			expect(() => getAsideIconName('note', icon)).toThrow('Invalid aside icon');
		}
	);
});
