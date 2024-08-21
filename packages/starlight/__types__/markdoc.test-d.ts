import type { ComponentProps } from 'astro/types';
import { expectTypeOf, test } from 'vitest';

import {
	Aside,
	Badge,
	Card,
	CardGrid,
	FileTree,
	LinkButton,
	LinkCard,
	Steps,
	TabItem,
	Tabs,
} from '@astrojs/starlight/components';

type UserComponents = keyof typeof import('@astrojs/starlight/components');
type UserComponentProps<T extends (args: any) => any> = keyof RemoveIndexSignature<
	ComponentProps<T>
>;

type MarkdocPreset = typeof import('../markdoc.mjs').StarlightMarkdocPreset;
type MarkdocTags = keyof MarkdocPreset['tags'];
type MarkdocTagAttributes<T extends MarkdocTags> = keyof MarkdocPreset['tags'][T]['attributes'];

test('defines a tag for each user components', () => {
	expectTypeOf<MarkdocTags>().toEqualTypeOf<Lowercase<UserComponents>>();
});

test('defines all `<Aside>` component attributes', () => {
	expectTypeOf<MarkdocTagAttributes<'aside'>>().toEqualTypeOf<UserComponentProps<typeof Aside>>();
});

test('defines all `<Badge>` component attributes', () => {
	expectTypeOf<MarkdocTagAttributes<'badge'>>().toEqualTypeOf<UserComponentProps<typeof Badge>>();
});

test('defines all `<Card>` component attributes', () => {
	expectTypeOf<MarkdocTagAttributes<'card'>>().toEqualTypeOf<UserComponentProps<typeof Card>>();
});

test('defines all `<CardGrid>` component attributes', () => {
	expectTypeOf<MarkdocTagAttributes<'cardgrid'>>().toEqualTypeOf<
		UserComponentProps<typeof CardGrid>
	>();
});

test('defines all `<FileTree>` component attributes', () => {
	expectTypeOf<MarkdocTagAttributes<'filetree'>>().toEqualTypeOf<
		UserComponentProps<typeof FileTree>
	>();
});

test('defines all `<LinkButton>` component attributes', () => {
	expectTypeOf<MarkdocTagAttributes<'linkbutton'>>().toEqualTypeOf<
		UserComponentProps<typeof LinkButton>
	>();
});

test('defines all `<LinkCard>` component attributes', () => {
	expectTypeOf<MarkdocTagAttributes<'linkcard'>>().toEqualTypeOf<
		UserComponentProps<typeof LinkCard>
	>();
});

test('defines all `<Steps>` component attributes', () => {
	expectTypeOf<MarkdocTagAttributes<'steps'>>().toEqualTypeOf<UserComponentProps<typeof Steps>>();
});

test('defines all `<TabItem>` component attributes', () => {
	expectTypeOf<MarkdocTagAttributes<'tabitem'>>().toEqualTypeOf<
		UserComponentProps<typeof TabItem>
	>();
});

test('defines all `<Tabs>` component attributes', () => {
	expectTypeOf<MarkdocTagAttributes<'tabs'>>().toEqualTypeOf<UserComponentProps<typeof Tabs>>();
});

// https://stackoverflow.com/a/66252656/1945960
type RemoveIndexSignature<T> = {
	[K in keyof T as string extends K
		? never
		: number extends K
			? never
			: symbol extends K
				? never
				: K]: T[K];
};
