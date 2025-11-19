import { describe, expectTypeOf, test } from 'vitest';
import { z } from 'astro/zod';
import type { StarlightConfigSchema, StarlightUserConfig } from '../../src/utils/user-config';
import type {
	StarlightPluginsConfigSchema,
	StarlightUserConfigWithPlugins,
} from '../../src/utils/plugins';
import type { I18nBadgeConfigSchema, I18nBadgeUserConfig } from '../../src/schemas/badge';
import type { ComponentConfigSchema, ComponentUserConfig } from '../../src/schemas/components';
import type {
	ExpressiveCodeSchema,
	ExpressiveCodeUserConfig,
} from '../../src/schemas/expressiveCode';
import type { FaviconSchema, FaviconUserConfig } from '../../src/schemas/favicon';
import type { HeadConfigSchema, HeadUserConfig } from '../../src/schemas/head';
import type { IconSchema, IconUserConfig } from '../../src/schemas/icon';
import type { LocaleConfigSchema, LocaleUserConfig } from '../../src/schemas/locale';
import type { LogoConfigSchema, LogoUserConfig } from '../../src/schemas/logo';
import type { PagefindConfigSchema, PagefindUserConfig } from '../../src/schemas/pagefind';
import type { SidebarItemSchema, SidebarItemUserConfig } from '../../src/schemas/sidebar';
import type { TitleConfigSchema, TitleUserConfig } from '../../src/schemas/site-title';
import type { SocialLinksSchema, SocialLinksUserConfig } from '../../src/schemas/social';
import type {
	TableOfContentsSchema,
	TableOfContentsUserConfig,
} from '../../src/schemas/tableOfContents';

test('has matching `StarlightUserConfig` input type for `StarlightConfigSchema`', () => {
	expectTypeOf<z.input<typeof StarlightConfigSchema>>().toEqualTypeOf<StarlightUserConfig>();
});

test('has matching `StarlightPluginsUserConfig` input type for `StarlightPluginsConfigSchema`', () => {
	expectTypeOf<z.input<typeof StarlightPluginsConfigSchema>>().toEqualTypeOf<
		StarlightUserConfigWithPlugins['plugins']
	>();
});

describe('sub-schemas', () => {
	test('has matching `I18nBadgeUserConfig` input type for `I18nBadgeConfigSchema`', () => {
		expectTypeOf<
			z.input<ReturnType<typeof I18nBadgeConfigSchema>>
		>().toEqualTypeOf<I18nBadgeUserConfig>();
	});

	test('has matching `ComponentUserConfig` input type for `ComponentConfigSchema`', () => {
		expectTypeOf<
			z.input<ReturnType<typeof ComponentConfigSchema>>
		>().toEqualTypeOf<ComponentUserConfig>();
	});

	test('has matching `ExpressiveCodeUserConfig` input type for `ExpressiveCodeSchema`', () => {
		expectTypeOf<
			z.input<ReturnType<typeof ExpressiveCodeSchema>>
		>().toEqualTypeOf<ExpressiveCodeUserConfig>();
	});

	test('has matching `FaviconUserConfig` input type for `FaviconSchema`', () => {
		expectTypeOf<z.input<ReturnType<typeof FaviconSchema>>>().toEqualTypeOf<FaviconUserConfig>();
	});

	test('has matching `HeadUserConfig` input type for `HeadConfigSchema`', () => {
		expectTypeOf<z.input<ReturnType<typeof HeadConfigSchema>>>().toEqualTypeOf<HeadUserConfig>();
	});

	test('has matching `IconUserConfig` input type for `IconSchema`', () => {
		expectTypeOf<z.input<ReturnType<typeof IconSchema>>>().toEqualTypeOf<IconUserConfig>();
	});

	test('has matching `LocaleUserConfig` input type for `LocaleConfigSchema`', () => {
		expectTypeOf<
			z.input<ReturnType<typeof LocaleConfigSchema>>
		>().toEqualTypeOf<LocaleUserConfig>();
	});

	test('has matching `LogoUserConfig` input type for `LogoConfigSchema`', () => {
		expectTypeOf<z.input<ReturnType<typeof LogoConfigSchema>>>().toEqualTypeOf<LogoUserConfig>();
	});

	test('has matching `PagefindUserConfig` input type for `PagefindConfigSchema`', () => {
		expectTypeOf<
			z.input<ReturnType<typeof PagefindConfigSchema>>
		>().toEqualTypeOf<PagefindUserConfig>();
	});

	test('has matching `SidebarItemUserConfig` input type for `SidebarItemSchema`', () => {
		expectTypeOf<z.input<typeof SidebarItemSchema>>().toEqualTypeOf<SidebarItemUserConfig>();
	});

	test('has matching `TitleUserConfig` input type for `TitleConfigSchema`', () => {
		expectTypeOf<z.input<ReturnType<typeof TitleConfigSchema>>>().toEqualTypeOf<TitleUserConfig>();
	});

	test('has matching `SocialLinksUserConfig` input type for `SocialLinksSchema`', () => {
		expectTypeOf<
			z.input<ReturnType<typeof SocialLinksSchema>>
		>().toEqualTypeOf<SocialLinksUserConfig>();
	});

	test('has matching `TableOfContentsUserConfig` input type for `TableOfContentsSchema`', () => {
		expectTypeOf<
			z.input<ReturnType<typeof TableOfContentsSchema>>
		>().toEqualTypeOf<TableOfContentsUserConfig>();
	});
});
