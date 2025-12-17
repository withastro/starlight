/**
 * This is a modified version of Astro's error map.
 * source: https://github.com/withastro/astro/blob/main/packages/astro/src/content/error-map.ts
 */

import { AstroError } from 'astro/errors';
import { z, locales } from 'astro/zod';

// The default Zod error map that we use to retrieve default error messages.
const zodErrorMap = locales.en().localeError;

type TypeErrByPathEntry = {
	code: 'invalid_type';
	received: unknown;
	expected: unknown[];
};

/**
 * Parse data with a Zod schema and throw a nicely formatted error if it is invalid.
 *
 * @param schema The Zod schema to use to parse the input.
 * @param input Input data that should match the schema.
 * @param message Error message preamble to use if the input fails to parse.
 * @returns Validated data parsed by Zod.
 */
export function parseWithFriendlyErrors<T extends z.Schema>(
	schema: T,
	input: z.input<T>,
	message: string
): z.output<T> {
	return processParsedData<T>(
		schema.safeParse(input, { error: errorMap, reportInput: true }),
		message
	);
}

/**
 * Asynchronously parse data with a Zod schema that contains asynchronous refinements or transforms
 * and throw a nicely formatted error if it is invalid.
 *
 * @param schema The Zod schema to use to parse the input.
 * @param input Input data that should match the schema.
 * @param message Error message preamble to use if the input fails to parse.
 * @returns Validated data parsed by Zod.
 */
export async function parseAsyncWithFriendlyErrors<T extends z.Schema>(
	schema: T,
	input: z.input<T>,
	message: string
): Promise<z.output<T>> {
	return processParsedData<T>(
		await schema.safeParseAsync(input, { error: errorMap, reportInput: true }),
		message
	);
}

function processParsedData<T extends z.Schema>(
	parsedData: z.ZodSafeParseResult<z.output<T>>,
	message: string
) {
	if (!parsedData.success) {
		throw new AstroError(message, parsedData.error.issues.map((i) => i.message).join('\n'));
	}
	return parsedData.data;
}

const errorMap: z.core.$ZodErrorMap = (issue) => {
	const baseErrorPath = flattenErrorPath(issue.path ?? []);
	if (issue.code === 'invalid_union') {
		// Optimization: Combine type and literal errors for keys that are common across ALL union types
		// Ex. a union between `{ key: z.literal('tutorial') }` and `{ key: z.literal('blog') }` will
		// raise a single error when `key` does not match:
		// > Did not match union.
		// > key: Expected `'tutorial' | 'blog'`, received 'foo'
		const unionErrors = issue.errors.flat();
		const typeOrLiteralErrByPath: Map<string, TypeErrByPathEntry> = new Map();
		for (const unionError of unionErrors) {
			if (unionError.code === 'invalid_type') {
				const flattenedErrorPath = flattenErrorPath([baseErrorPath, ...unionError.path]);
				if (typeOrLiteralErrByPath.has(flattenedErrorPath)) {
					typeOrLiteralErrByPath.get(flattenedErrorPath)!.expected.push(unionError.expected);
				} else {
					typeOrLiteralErrByPath.set(flattenedErrorPath, {
						code: unionError.code,
						received: parsedType(issue.input),
						expected: [unionError.expected],
					});
				}
			}
		}
		const messages: string[] = [prefix(baseErrorPath, 'Did not match union.')];
		const details: string[] = [...typeOrLiteralErrByPath.entries()]
			// If type or literal error isn't common to ALL union types,
			// filter it out. Can lead to confusing noise.
			.filter(([, error]) => error.expected.length === unionErrors.length)
			.map(([key, error]) =>
				key === baseErrorPath
					? // Avoid printing the key again if it's a base error
						`> ${getTypeOrLiteralMsg(error)}`
					: `> ${prefix(key, getTypeOrLiteralMsg(error))}`
			);

		if (details.length === 0) {
			const expectedShapes: string[] = [];
			for (const unionError of issue.errors) {
				const expectedShape: string[] = [];
				for (const issue of unionError) {
					// If the issue is a nested union error, show the associated error message instead of the
					// base error message.
					if (issue.code === 'invalid_union') {
						return errorMap({ ...issue, input: issue.input, path: [baseErrorPath, ...issue.path] });
					}
					const relativePath = flattenErrorPath(issue.path)
						.replace(baseErrorPath, '')
						.replace(leadingPeriod, '');
					if (issue.code === 'invalid_type') {
						expectedShape.push(
							relativePath ? `${relativePath}: ${issue.expected}` : issue.expected
						);
					} else if (issue.code === 'custom') {
						expectedShape.push(relativePath);
					}
				}
				if (expectedShape.length === 1 && !expectedShape[0]?.includes(':')) {
					// In this case the expected shape is not an object, but probably a literal type, e.g. `['string']`.
					expectedShapes.push(expectedShape.join(''));
				} else if (expectedShape.length > 0) {
					expectedShapes.push(`{ ${expectedShape.join('; ')} }`);
				}
			}
			if (expectedShapes.length) {
				details.push('> Expected type `' + expectedShapes.join(' | ') + '`');
				details.push('> Received `' + stringify(issue.input) + '`');
			}
		}

		return messages.concat(details).join('\n');
	} else if (issue.code === 'invalid_type') {
		return prefix(
			baseErrorPath,
			getTypeOrLiteralMsg({
				code: issue.code,
				received: parsedType(issue.input),
				expected: [issue.expected],
			})
		);
	} else if (issue.message) {
		return prefix(baseErrorPath, issue.message);
	} else {
		// By design, the default Zod error is not provided in Zod 4 error maps. Instead, error maps
		// are supposed to return `undefined` in order to yield control to the next error map in the
		// precedence chain. Unfortunately, this prevents us from prefixing all errors with their paths
		// so we have to manually invoke the default Zod error map here.
		const defaultError = zodErrorMap(issue);
		if (!defaultError) return;

		return prefix(
			baseErrorPath,
			typeof defaultError === 'string' ? defaultError : defaultError.message
		);
	}
};

const getTypeOrLiteralMsg = (error: TypeErrByPathEntry): string => {
	// received could be `undefined` or the string `'undefined'`
	if (typeof error.received === 'undefined' || error.received === 'undefined') return 'Required';
	const expectedDeduped = new Set(error.expected);
	return `Expected type \`${unionExpectedVals(expectedDeduped)}\`, received \`${stringify(
		error.received
	)}\``;
};

const prefix = (key: string, msg: string) => (key.length ? `**${key}**: ${msg}` : msg);

const unionExpectedVals = (expectedVals: Set<unknown>) =>
	[...expectedVals].map((expectedVal) => stringify(expectedVal)).join(' | ');

const flattenErrorPath = (errorPath: PropertyKey[]) => errorPath.join('.');

/** `JSON.stringify()` a value with spaces around object/array entries. */
const stringify = (val: unknown) =>
	JSON.stringify(val, null, 1).split(newlinePlusWhitespace).join(' ');
const newlinePlusWhitespace = /\n\s*/;
const leadingPeriod = /^\./;

/**
 * In Zod 4, we don't necessarily get a human-readable representation of input data types. For such
 * cases, we use the same logic as Zod's own `parsedType()` function.
 * @see https://github.com/colinhacks/zod/blob/73b071d7d08825dedb6b48b78718739118ee1308/packages/zod/src/v4/locales/en.ts#L5
 */
const parsedType = (data: unknown): string => {
	const t = typeof data;

	switch (t) {
		case 'number': {
			return Number.isNaN(data) ? 'NaN' : 'number';
		}
		case 'object': {
			if (Array.isArray(data)) {
				return 'array';
			}
			if (data === null) {
				return 'null';
			}

			if (data && Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
				return data.constructor.name;
			}
		}
	}
	return t;
};
