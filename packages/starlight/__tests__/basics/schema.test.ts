import { describe, expect, test } from 'vitest';
import { FaviconSchema } from '../../schemas/favicon';
import { TitleTransformConfigSchema } from '../../schemas/site-title';
import { HeadConfigSchema, type HeadUserConfig } from '../../schemas/head';
import { parseWithFriendlyErrors } from '../../utils/error-map';

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

describe('HeadConfigSchema', () => {
	function parseHeadConfigWithFriendlyErrors(
		source: Parameters<typeof HeadConfigSchema>[0]['source'],
		data: HeadUserConfig
	) {
		return parseWithFriendlyErrors(
			HeadConfigSchema({ source }),
			data,
			'Data does not match schema'
		);
	}

	const headConfigWithoutAttrs: HeadUserConfig = [{ tag: 'meta', content: '1234' }];
	const headConfigWithAttrs: HeadUserConfig = [
		{ tag: 'meta', attrs: { property: 'test:id' }, content: '1234' },
	];

	describe('source: config', () => {
		test('errors with head `meta` tag with `content` and attributes', () => {
			expect(() => parseHeadConfigWithFriendlyErrors('config', headConfigWithoutAttrs))
				.toThrowErrorMatchingInlineSnapshot(`
				"[AstroUserError]:
					Data does not match schema
				Hint:
					The \`head\` configuration includes a \`meta\` tag with \`content\` which is invalid HTML.
					You should instead use a \`content\` attribute with an additional attribute such as \`name\`, \`property\`, or \`http-equiv\` to identify the kind of metadata it represents in the \`attrs\` object:
					
					{
					  "tag": "meta",
					  "attrs": {
					    "name": "identifier",
					    "content": "1234"
					  }
					}"
			`);
		});
		test('errors with head `meta` tag with `content` and no attributes', () => {
			expect(() => parseHeadConfigWithFriendlyErrors('config', headConfigWithAttrs))
				.toThrowErrorMatchingInlineSnapshot(`
				"[AstroUserError]:
					Data does not match schema
				Hint:
					The \`head\` configuration includes a \`meta\` tag with \`content\` which is invalid HTML.
					You should instead use a \`content\` attribute in the \`attrs\` object:
					
					{
					  "tag": "meta",
					  "attrs": {
					    "property": "test:id",
					    "content": "1234"
					  }
					}"
			`);
		});
	});

	describe('source: content', () => {
		test('errors with head `meta` tag with `content` and attributes', () => {
			expect(() => parseHeadConfigWithFriendlyErrors('content', headConfigWithoutAttrs))
				.toThrowErrorMatchingInlineSnapshot(`
				"[AstroUserError]:
					Data does not match schema
				Hint:
					The \`head\` configuration includes a \`meta\` tag with \`content\` which is invalid HTML.
					You should instead use a \`content\` attribute with an additional attribute such as \`name\`, \`property\`, or \`http-equiv\` to identify the kind of metadata it represents in the \`attrs\` object:
					
					- tag: meta
					  attrs:
					    name: identifier
					    content: '1234'
					"
			`);
		});
		test('errors with head `meta` tag with `content` and no attributes', () => {
			expect(() => parseHeadConfigWithFriendlyErrors('content', headConfigWithAttrs))
				.toThrowErrorMatchingInlineSnapshot(`
				"[AstroUserError]:
					Data does not match schema
				Hint:
					The \`head\` configuration includes a \`meta\` tag with \`content\` which is invalid HTML.
					You should instead use a \`content\` attribute in the \`attrs\` object:
					
					- tag: meta
					  attrs:
					    property: test:id
					    content: '1234'
					"
			`);
		});
	});
});
