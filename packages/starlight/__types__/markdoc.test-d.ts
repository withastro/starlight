import type { ComponentProps } from 'astro/types';
import { expectTypeOf, test } from 'vitest';

import Aside from '../user-components/Aside.astro';

type UserComponents = keyof typeof import('@astrojs/starlight/components');
type UserComponentProps<T extends (args: any) => any> = keyof ComponentProps<T>;

type MarkdocPreset = typeof import('../markdoc.mjs').StarlightMarkdocPreset;
type MarkdocTags = keyof MarkdocPreset['tags'];
type MarkdocTagAttributes<T extends MarkdocTags> = keyof MarkdocPreset['tags'][T]['attributes'];

test('defines a tag for each user components', () => {
	expectTypeOf<MarkdocTags>().toEqualTypeOf<Lowercase<UserComponents>>();
});

test('defines all aside component attributes', () => {
	expectTypeOf<MarkdocTagAttributes<'aside'>>().toEqualTypeOf<UserComponentProps<typeof Aside>>();
});
