import { describe, expect, test } from 'vitest';
import { FaviconSchema } from '../../schemas/favicon';
import { TitleTransformConfigSchema } from '../../schemas/site-title';

describe('FaviconSchema', () => {
	test('returns the proper href and type attributes', () => {
		const icon = '/custom-icon.jpg';

		const favicon = FaviconSchema().parse(icon);

		expect(favicon.href).toBe(icon);
		expect(favicon.type).toBe('image/jpeg');
	});

	test('returns the proper href and type attributes when contains query', () => {
		const icon = '/custom-icon.gif?v=123456&x=987654';

		const favicon = FaviconSchema().parse(icon);

		expect(favicon.href).toBe(icon);
		expect(favicon.type).toBe('image/gif');
	});

	test('returns the proper href and type attributes when contains fragment', () => {
		const icon = '/custom-icon.png#favicon';

		const favicon = FaviconSchema().parse(icon);

		expect(favicon.href).toBe(icon);
		expect(favicon.type).toBe('image/png');
	});

	test('returns the proper href and type attributes when contains query and fragment', () => {
		const icon = '/custom-icon.ico?v=123456&x=987654#favicon';

		const favicon = FaviconSchema().parse(icon);

		expect(favicon.href).toBe(icon);
		expect(favicon.type).toBe('image/x-icon');
	});

	test('throws on invalid favicon extensions', () => {
		expect(() => FaviconSchema().parse('/favicon.pdf')).toThrow();
	});
});

describe('TitleTransformConfigSchema', () => {
	test('title can be a string', () => {
		const title = 'My Site';
		const defaultLang = 'en';

		const siteTitle = TitleTransformConfigSchema(defaultLang).parse(title);

		expect(siteTitle).toEqual({
			en: title,
		});
	});

	test('title can be an object', () => {
		const title = {
			en: 'My Site',
			es: 'Mi Sitio',
		};
		const defaultLang = 'en';

		const siteTitle = TitleTransformConfigSchema(defaultLang).parse(title);

		expect(siteTitle).toEqual(title);
	});

	test('throws on missing default language key', () => {
		const title = {
			es: 'Mi Sitio',
		};
		const defaultLang = 'en';

		expect(() => TitleTransformConfigSchema(defaultLang).parse(title)).toThrow();
	});
});
