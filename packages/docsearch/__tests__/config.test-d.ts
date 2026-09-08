import { z } from 'astro/zod';
import { expectTypeOf, test } from 'vitest';
import type { DocSearchConfigSchema } from '../src/config';
import type { DocSearchUserConfig } from '../src/index';

test('has matching `DocSearchUserConfig` input type for `DocSearchConfigSchema`', () => {
	expectTypeOf<z.input<typeof DocSearchConfigSchema>>().toEqualTypeOf<DocSearchUserConfig>();
});
