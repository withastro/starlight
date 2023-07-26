import { describe, expect, test } from 'vitest';
import { FaviconSchema } from '../../schemas/favicon';

describe('FaviconSchema', () => {
	test('returns the proper href and type attributes', () => {
		const icon = '/custom-icon.jpg';

		const favicon = FaviconSchema().parse(icon);

		expect(favicon.href).toBe(icon);
		expect(favicon.type).toBe('image/jpeg');
	});

	test('throws on invalid favicon extensions', () => {
		expect(() => FaviconSchema().parse('/favicon.pdf')).toThrow();
	});
});
