import { describe, expect, test } from 'vitest';
import { docsSchema } from '../../schema';
import { FaviconSchema } from '../../schemas/favicon';
import { TitleTransformConfigSchema } from '../../schemas/site-title';
import { HeadConfigSchema, type HeadUserConfig } from '../../schemas/head';
import { parseWithFriendlyErrors } from '../../utils/error-map';
import { z } from 'astro/zod';

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

describe('docsSchema', () => {
	test('basic frontmatter should parse to expected shape', () => {
		const schema = docsSchema()({ image: () => ({}) as never });
		const parsed = schema.parse({ title: 'Test Title' });
		expect(parsed).toMatchInlineSnapshot(`
			{
			  "draft": false,
			  "editUrl": true,
			  "head": [],
			  "pagefind": true,
			  "sidebar": {
			    "attrs": {},
			    "hidden": false,
			  },
			  "template": "doc",
			  "title": "Test Title",
			}
		`);
	});

	test('docs schema can be extended to make property required', () => {
		const schema = docsSchema({ extend: z.object({ description: z.string() }) })({
			image: () => ({}) as never,
		});
		expect(() => schema.parse({ title: 'Test Title' })).toThrowErrorMatchingInlineSnapshot(`
			[ZodError: [
			  {
			    "expected": "string",
			    "code": "invalid_type",
			    "path": [
			      "description"
			    ],
			    "message": "Invalid input: expected string, received undefined"
			  }
			]]
		`);
	});

	test('an existing enum can be extended', () => {
		const schema = docsSchema({
			extend: z.object({
				template: z.enum(['doc', 'splash', 'custom']),
				hero: z
					.object({
						actions: z
							.array(
								z.object({ variant: z.enum(['primary', 'secondary', 'custom']).default('primary') })
							)
							.default([]),
					})
					.optional(),
			}),
		})({
			image: () => ({}) as never,
		});

		const parsed = schema.parse({
			title: 'Test Title',
			template: 'custom',
			hero: { actions: [{ variant: 'custom', text: '', link: '' }] },
		});
		expect(parsed).toMatchInlineSnapshot(`
			{
			  "draft": false,
			  "editUrl": true,
			  "head": [],
			  "hero": {
			    "actions": [
			      {
			        "link": "",
			        "text": "",
			        "variant": "custom",
			      },
			    ],
			  },
			  "pagefind": true,
			  "sidebar": {
			    "attrs": {},
			    "hidden": false,
			  },
			  "template": "custom",
			  "title": "Test Title",
			}
		`);
	});

	test('docs schema can be extended to add a new property', () => {
		const schema = docsSchema({ extend: z.object({ custom: z.string() }) })({
			image: () => ({}) as never,
		});
		const parsed = schema.parse({ title: 'Test Title', custom: 'Custom Value' });
		expect(parsed).toMatchInlineSnapshot(`
			{
			  "custom": "Custom Value",
			  "draft": false,
			  "editUrl": true,
			  "head": [],
			  "pagefind": true,
			  "sidebar": {
			    "attrs": {},
			    "hidden": false,
			  },
			  "template": "doc",
			  "title": "Test Title",
			}
		`);
	});

	test('docs schema can be extended to add a property to a nested object', () => {
		const schema = docsSchema({ extend: z.object({ sidebar: z.object({ custom: z.number() }) }) })({
			image: () => ({}) as never,
		});
		const parsed = schema.parse({ title: 'Test Title', sidebar: { custom: 42 } });
		expect(parsed).toMatchInlineSnapshot(`
			{
			  "draft": false,
			  "editUrl": true,
			  "head": [],
			  "pagefind": true,
			  "sidebar": {
			    "attrs": {},
			    "custom": 42,
			    "hidden": false,
			  },
			  "template": "doc",
			  "title": "Test Title",
			}
		`);
	});

	test('docs schema preserves user-defined refinements when extending a nested object', () => {
		const schema = docsSchema({
			extend: z.object({
				sidebar: z
					.object({ custom: z.number() })
					.refine(({ custom }) => custom > 0, 'custom must be positive'),
			}),
		})({
			image: () => ({}) as never,
		});

		expect(() => schema.parse({ title: 'Test Title', sidebar: { custom: 42 } })).not.toThrow();

		expect(() => schema.parse({ title: 'Test Title', sidebar: { custom: -1 } }))
			.toThrowErrorMatchingInlineSnapshot(`
		[ZodError: [
		  {
		    "code": "custom",
		    "path": [
		      "sidebar"
		    ],
		    "message": "custom must be positive"
		  }
		]]
	`);
	});
});
