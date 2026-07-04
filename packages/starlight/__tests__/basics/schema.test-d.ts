import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';
import { describe, expectTypeOf, test } from 'vitest';

interface PartialDocsSchemaOutput {
	title: string;
	description?: string | undefined;
	template: 'doc' | 'splash';
	sidebar: {
		hidden: boolean;
	};
}

describe('docs schema', () => {
	test('docs schema should parse to expected shape', () => {
		const schema = docsSchema()({ image: () => ({}) as any });
		const parsed = schema.parse({});
		expectTypeOf(parsed).toExtend<PartialDocsSchemaOutput>();
	});

	test('docs schema should parse to expected shape when making existing key required', () => {
		const schema = docsSchema({ extend: z.object({ description: z.string() }) })({
			image: () => ({}) as any,
		});
		const parsed = schema.parse({});
		expectTypeOf(parsed.description).toBeString();
	});

	test('docs schema should parse to expected shape when extending existing enum', () => {
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
			image: () => ({}) as any,
		});
		const parsed = schema.parse({});
		expectTypeOf(parsed.template).toEqualTypeOf<'doc' | 'splash' | 'custom'>();
		expectTypeOf(parsed.hero!.actions[0]!.variant).toEqualTypeOf<
			'primary' | 'secondary' | 'custom'
		>();
	});

	test('docs schema should parse to expected shape when adding a custom key', () => {
		const schema = docsSchema({ extend: z.object({ custom: z.string() }) })({
			image: () => ({}) as any,
		});
		const parsed = schema.parse({});
		expectTypeOf(parsed).toExtend<PartialDocsSchemaOutput>();
		expectTypeOf(parsed.custom).toBeString();
	});

	test('docs schema should parse to expected shape when extending a nested object', () => {
		const schema = docsSchema({
			extend: z.object({ sidebar: z.object({ custom: z.number() }) }),
		})({
			image: () => ({}) as any,
		});
		const parsed = schema.parse({});
		expectTypeOf(parsed).toExtend<PartialDocsSchemaOutput>();
		expectTypeOf(parsed.sidebar.custom).toBeNumber();
	});
});
