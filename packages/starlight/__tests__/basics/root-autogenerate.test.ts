import { describe, expect, test, vi } from 'vitest';
import { getSidebarFromConfig } from '../../src/utils/navigation';
import { SidebarItemSchema } from '../../src/schemas/sidebar';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.md', { title: 'Home' }],
			['guide.md', { title: 'Guide', sidebar: { order: 1, label: 'Start', badge: 'New' } }],
			['nested/page.md', { title: 'Nested' }],
			['hidden.md', { title: 'Hidden', sidebar: { hidden: true } }],
		],
	})
);

describe('root autogeneration', () => {
	test.each(['', '/'])('matches the default sidebar for directory "%s"', (directory) => {
		const expected = getSidebarFromConfig(undefined, '/guide/', undefined);
		expect(expected).toHaveLength(3);
		expect(
			getSidebarFromConfig(
				[SidebarItemSchema.parse({ autogenerate: { directory } })],
				'/guide/',
				undefined
			)
		).toEqual(expected);
	});
});
