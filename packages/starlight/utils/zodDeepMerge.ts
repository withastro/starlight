import type { z } from 'astro/zod';

/** Type-level equivalent of {@link mergeWithDefaultSchema}. */
export type MergedSchema<Default extends z.core.$ZodType, User extends z.core.$ZodType> =
	User extends z.ZodOptional<infer WrappedSchema extends z.core.$ZodType>
		? z.ZodOptional<MergedSchema<UnwrappedSchema<Default>, WrappedSchema>>
		: User extends z.ZodNullable<infer WrappedSchema extends z.core.$ZodType>
			? z.ZodNullable<MergedSchema<UnwrappedSchema<Default>, WrappedSchema>>
			: User extends z.ZodDefault<infer WrappedSchema extends z.core.$ZodType>
				? z.ZodDefault<MergedSchema<UnwrappedSchema<Default>, WrappedSchema>>
				: User extends z.ZodPrefault<infer WrappedSchema extends z.core.$ZodType>
					? z.ZodPrefault<MergedSchema<UnwrappedSchema<Default>, WrappedSchema>>
					: UnwrappedSchema<Default> extends z.ZodObject<infer DefaultShape>
						? User extends z.ZodObject<infer UserShape, infer UserConfig>
							? z.ZodObject<MergedShape<DefaultShape, UserShape>, UserConfig>
							: User
						: UnwrappedSchema<Default> extends z.ZodArray<
									infer DefaultItemSchema extends z.core.$ZodType
							  >
							? User extends z.ZodArray<infer UserItemSchema extends z.core.$ZodType>
								? z.ZodArray<MergedSchema<DefaultItemSchema, UserItemSchema>>
								: User
							: User;

/** Type-level equivalent of {@link unwrapSchema}. */
type UnwrappedSchema<T extends z.core.$ZodType> =
	T extends z.ZodOptional<infer Wrapped extends z.core.$ZodType>
		? UnwrappedSchema<Wrapped>
		: T extends z.ZodNullable<infer Wrapped extends z.core.$ZodType>
			? UnwrappedSchema<Wrapped>
			: T extends z.ZodDefault<infer Wrapped extends z.core.$ZodType>
				? UnwrappedSchema<Wrapped>
				: T extends z.ZodPrefault<infer Wrapped extends z.core.$ZodType>
					? UnwrappedSchema<Wrapped>
					: T;

/**
 * Merged Zod object shapes, preserving default properties, adding user-only properties, and
 * recursively merging shared properties.
 */
type MergedShape<Default extends z.ZodRawShape, User extends z.ZodRawShape> = {
	[Key in keyof Default | keyof User]: Key extends keyof User
		? Key extends keyof Default
			? MergedSchema<Default[Key], User[Key]>
			: User[Key]
		: Key extends keyof Default
			? Default[Key]
			: never;
};

export function mergeWithDefaultSchema(defaultSchema: z.ZodType, userSchema: z.ZodType): z.ZodType {
	const unwrappedDefaultSchema = unwrapSchema(defaultSchema);

	if (isWrappedSchema(userSchema)) {
		return userSchema.clone({
			...userSchema._zod.def,
			innerType: mergeWithDefaultSchema(unwrappedDefaultSchema, userSchema._zod.def.innerType),
		} as Parameters<typeof userSchema.clone>[0]);
	}

	if (isZodObject(unwrappedDefaultSchema) && isZodObject(userSchema)) {
		const shape: z.core.$ZodLooseShape = { ...unwrappedDefaultSchema.shape };

		for (const key of Object.keys(userSchema.shape)) {
			const userFieldSchema = userSchema.shape[key] as z.ZodType;
			const defaultFieldSchema = shape[key] as z.ZodType | undefined;

			shape[key] = defaultFieldSchema
				? mergeWithDefaultSchema(defaultFieldSchema, userFieldSchema)
				: userFieldSchema;
		}

		return userSchema.safeExtend(shape);
	}

	if (isZodArray(unwrappedDefaultSchema) && isZodArray(userSchema)) {
		return userSchema.clone({
			...userSchema._zod.def,
			element: mergeWithDefaultSchema(unwrappedDefaultSchema.element, userSchema.element),
		});
	}

	return userSchema;
}

/**
 * Unwrap any Zod schema that wraps other schemas, such as `z.optional()`, `z.nullable()`,
 * `z.default()`, etc. until we reach the innermost schema.
 */
function unwrapSchema(schema: z.ZodType): z.ZodType {
	let current = schema;

	while (isWrappedSchema(current)) {
		current = current._zod.def.innerType;
	}

	return current;
}

/**
 * Check if a schema wraps another schema which can happen when using modifiers like
 * `z.optional()`, `z.nullable()`, `z.default()`, etc.
 */
function isWrappedSchema(schema: z.ZodType): schema is z.ZodType & {
	_zod: { def: z.ZodType['_zod']['def'] & { innerType: z.ZodType } };
} {
	return (
		schema._zod.def.type === 'optional' ||
		schema._zod.def.type === 'nullable' ||
		schema._zod.def.type === 'default' ||
		schema._zod.def.type === 'prefault'
	);
}

function isZodObject(schema: z.ZodType): schema is z.ZodObject<z.ZodRawShape> {
	return schema._zod.def.type === 'object';
}

function isZodArray(schema: z.ZodType): schema is z.ZodArray<z.ZodType> {
	return schema._zod.def.type === 'array';
}
