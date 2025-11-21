import { describe, expectTypeOf, test } from 'vitest';
import type { StarlightUserConfig } from '../../src/utils/user-config';

describe('sidebar', () => {
	test('emits a type error for custom attributes on groups', () => {
		type SidebarUserItem = NonNullable<StarlightUserConfig['sidebar']>[number];

		// Links
		expectTypeOf('getting-started').toExtend<SidebarUserItem>();
		expectTypeOf({ slug: 'getting-started' }).toExtend<SidebarUserItem>();
		expectTypeOf({
			label: 'Getting Started',
			link: '/getting-started/',
		}).toExtend<SidebarUserItem>();

		// Groups
		expectTypeOf({
			label: 'References',
			items: [],
		}).toExtend<SidebarUserItem>();
		expectTypeOf({
			label: 'References',
			autogenerate: { directory: 'references' },
		}).toExtend<SidebarUserItem>();

		// Links with attributes
		expectTypeOf({
			slug: 'getting-started',
			attrs: { class: 'test' },
		}).toExtend<SidebarUserItem>();
		expectTypeOf({
			label: 'Getting Started',
			link: '/getting-started/',
			attrs: { class: 'test' },
		}).toExtend<SidebarUserItem>();

		// Groups with attributes which are not supported
		expectTypeOf({
			label: 'References',
			items: [],
			attrs: { class: 'test' },
			// @ts-expect-error - Attributes are not supported on groups
		}).toExtend<SidebarUserItem>();
		expectTypeOf({
			label: 'References',
			autogenerate: { directory: 'references' },
			attrs: { class: 'test' },
			// @ts-expect-error - Attributes are not supported on groups
		}).toExtend<SidebarUserItem>();
	});
});
