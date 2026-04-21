import type { ComponentProps, HTMLAttributes } from 'astro/types';
import { describe, expectTypeOf, test } from 'vitest';

import {
	Aside,
	Badge,
	Card,
	CardGrid,
	Code,
	FileTree,
	Icon,
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

type MarkdocPreset = typeof import('../index.mjs').StarlightMarkdocPreset;
type MarkdocNodes = keyof MarkdocPreset['nodes'];
type MarkdocNodeAttributes<T extends MarkdocNodes> = keyof MarkdocPreset['nodes'][T]['attributes'];
type MarkdocTags = keyof MarkdocPreset['tags'];
type MarkdocTagAttributes<T extends MarkdocTags> = keyof MarkdocPreset['tags'][T]['attributes'];

describe('nodes', () => {
	test('defines attributes for fenced code blocks with support for some text markers', () => {
		type FenceAttributes = MarkdocNodeAttributes<'fence'>;

		// Markdoc default fence attributes are `content` and `language`.
		type MarkdocFenceAttributes = 'content' | 'language';

		// Ensure Markdoc default fence attributes are always mapped.
		expectTypeOf<
			Extract<FenceAttributes, MarkdocFenceAttributes>
		>().toEqualTypeOf<MarkdocFenceAttributes>();

		type UnsupportedCodeProps =
			/** The `code` and `lang` attributes mapping is tested above. */
			| 'code'
			| 'lang'
			/** Not all `<Code>` component props are supported in code fences. */
			| 'class'
			| 'hangingIndent'
			| 'locale'
			| 'preserveIndent'
			| 'useDiffSyntax'
			| 'wrap'
			/**
			 * Some props cannot be described using Markdoc attribute validation syntax.
			 * @see {@link file://./../index.mjs}
			 */
			| 'mark'
			| 'ins'
			| 'del';

		// Ensure all non-unsupported `<Code>` component props are mapped.
		expectTypeOf<Exclude<FenceAttributes, MarkdocFenceAttributes>>().toEqualTypeOf<
			Exclude<UserComponentProps<typeof Code>, UnsupportedCodeProps>
		>();
	});
});

describe('tags', () => {
	test('defines a tag for each user components', () => {
		expectTypeOf<MarkdocTags>().toEqualTypeOf<Lowercase<UserComponents>>();
	});

	test('defines all `<Aside>` component attributes', () => {
		expectTypeOf<MarkdocTagAttributes<'aside'>>().toEqualTypeOf<UserComponentProps<typeof Aside>>();
	});

	test('defines all `<Badge>` component attributes', () => {
		/**
		 * Only supports a list of well-known `<span>` attributes.
		 * @see {@link file://./../html.mjs}
		 */
		type UnsupportedBadgeProps = Exclude<keyof HTMLAttributes<'span'>, WellKnownElementAttributes>;

		expectTypeOf<MarkdocTagAttributes<'badge'>>().toEqualTypeOf<
			Exclude<UserComponentProps<typeof Badge>, UnsupportedBadgeProps>
		>();
	});

	test('defines all `<Card>` component attributes', () => {
		expectTypeOf<MarkdocTagAttributes<'card'>>().toEqualTypeOf<UserComponentProps<typeof Card>>();
	});

	test('defines all `<CardGrid>` component attributes', () => {
		expectTypeOf<MarkdocTagAttributes<'cardgrid'>>().toEqualTypeOf<
			UserComponentProps<typeof CardGrid>
		>();
	});

	test('defines all `<Code>` component attributes', () => {
		/**
		 * Some props cannot be described using Markdoc attribute validation syntax.
		 * @see {@link file://./../index.mjs}
		 */
		type UnsupportedCodeProps = 'mark' | 'ins' | 'del';

		expectTypeOf<MarkdocTagAttributes<'code'>>().toEqualTypeOf<
			Exclude<UserComponentProps<typeof Code>, UnsupportedCodeProps>
		>();
	});

	test('defines all `<FileTree>` component attributes', () => {
		expectTypeOf<MarkdocTagAttributes<'filetree'>>().toEqualTypeOf<
			UserComponentProps<typeof FileTree>
		>();
	});

	test('defines all `<Icon>` component attributes', () => {
		expectTypeOf<MarkdocTagAttributes<'icon'>>().toEqualTypeOf<UserComponentProps<typeof Icon>>();
	});

	test('defines all `<LinkButton>` component attributes', () => {
		/**
		 * Only supports a list of well-known `<a>` attributes.
		 * @see {@link file://./../html.mjs}
		 */
		type UnsupportedLinkButtonProps = Exclude<keyof HTMLAttributes<'a'>, WellKnownAnchorAttributes>;

		expectTypeOf<MarkdocTagAttributes<'linkbutton'>>().toEqualTypeOf<
			Exclude<UserComponentProps<typeof LinkButton>, UnsupportedLinkButtonProps>
		>();
	});

	test('defines all `<LinkCard>` component attributes', () => {
		/**
		 * Only supports a list of well-known `<a>` attributes.
		 * @see {@link file://./../html.mjs}
		 */
		type UnsupportedLinkCardProps = Exclude<keyof HTMLAttributes<'a'>, WellKnownAnchorAttributes>;

		expectTypeOf<MarkdocTagAttributes<'linkcard'>>().toEqualTypeOf<
			Exclude<UserComponentProps<typeof LinkCard>, UnsupportedLinkCardProps>
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
});

type WellKnownElementAttributes = keyof typeof import('../html.mjs').WellKnownElementAttributes;
type WellKnownAnchorAttributes = keyof typeof import('../html.mjs').WellKnownAnchorAttributes;

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
