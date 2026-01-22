import type { Page } from '@playwright/test';
import fs from 'node:fs/promises';
import { expect, testFactory, type Locator, type StarlightPage } from './test-utils';

const test = testFactory('./fixtures/basics/');

test.describe('components', () => {
	test.describe('tabs', () => {
		test('syncs tabs with a click event', async ({ page, getProdServer }) => {
			const starlight = await getProdServer();
			await starlight.goto('/tabs');

			const tabs = page.locator('starlight-tabs');
			const pkgTabsA = tabs.nth(0);
			const pkgTabsB = tabs.nth(2);

			// Select the pnpm tab in the first set of synced tabs.
			await pkgTabsA.getByRole('tab').filter({ hasText: 'pnpm' }).click();

			await expectSelectedTab(pkgTabsA, 'pnpm', 'pnpm command');
			await expectSelectedTab(pkgTabsB, 'pnpm', 'another pnpm command');

			// Select the yarn tab in the second set of synced tabs.
			await pkgTabsB.getByRole('tab').filter({ hasText: 'yarn' }).click();

			await expectSelectedTab(pkgTabsB, 'yarn', 'another yarn command');
			await expectSelectedTab(pkgTabsA, 'yarn', 'yarn command');
		});

		test('syncs tabs with a keyboard event', async ({ page, getProdServer }) => {
			const starlight = await getProdServer();
			await starlight.goto('/tabs');

			const tabs = page.locator('starlight-tabs');
			const pkgTabsA = tabs.nth(0);
			const pkgTabsB = tabs.nth(2);

			// Select the pnpm tab in the first set of synced tabs with the keyboard.
			await pkgTabsA.getByRole('tab', { selected: true }).press('ArrowRight');

			await expectSelectedTab(pkgTabsA, 'pnpm', 'pnpm command');
			await expectSelectedTab(pkgTabsB, 'pnpm', 'another pnpm command');

			// Select back the npm tab in the second set of synced tabs with the keyboard.
			const selectedTabB = pkgTabsB.getByRole('tab', { selected: true });
			await selectedTabB.press('ArrowRight');
			await selectedTabB.press('ArrowLeft');
			await selectedTabB.press('ArrowLeft');

			await expectSelectedTab(pkgTabsA, 'npm', 'npm command');
			await expectSelectedTab(pkgTabsB, 'npm', 'another npm command');
		});

		test('syncs only tabs using the same sync key', async ({ page, getProdServer }) => {
			const starlight = await getProdServer();
			await starlight.goto('/tabs');

			const tabs = page.locator('starlight-tabs');
			const pkgTabsA = tabs.nth(0);
			const unsyncedTabs = tabs.nth(1);
			const styleTabs = tabs.nth(3);
			const osTabsA = tabs.nth(5);
			const osTabsB = tabs.nth(6);

			// Select the pnpm tab in the set of tabs synced with the 'pkg' key.
			await pkgTabsA.getByRole('tab').filter({ hasText: 'pnpm' }).click();

			await expectSelectedTab(unsyncedTabs, 'one', 'tab 1');
			await expectSelectedTab(styleTabs, 'css', 'css code');
			await expectSelectedTab(osTabsA, 'macos', 'macOS');
			await expectSelectedTab(osTabsB, 'macos', 'ls');
		});

		test('supports synced tabs with different tab items', async ({ page, getProdServer }) => {
			const starlight = await getProdServer();
			await starlight.goto('/tabs');

			const tabs = page.locator('starlight-tabs');
			const pkgTabsA = tabs.nth(0);
			const pkgTabsB = tabs.nth(2); // This set contains an extra tab item.

			// Select the bun tab in the second set of synced tabs.
			await pkgTabsB.getByRole('tab').filter({ hasText: 'bun' }).click();

			await expectSelectedTab(pkgTabsA, 'npm', 'npm command');
			await expectSelectedTab(pkgTabsB, 'bun', 'another bun command');
		});

		test('persists the focus when syncing tabs', async ({ page, getProdServer }) => {
			const starlight = await getProdServer();
			await starlight.goto('/tabs');

			const pkgTabsA = page.locator('starlight-tabs').nth(0);

			// Focus the selected tab in the set of tabs synced with the 'pkg' key.
			await pkgTabsA.getByRole('tab', { selected: true }).focus();
			// Select the pnpm tab in the set of tabs synced with the 'pkg' key using the keyboard.
			await page.keyboard.press('ArrowRight');

			expect(
				await pkgTabsA
					.getByRole('tab', { selected: true })
					.evaluate((node) => document.activeElement === node)
			).toBe(true);
		});

		test('preserves tabs position when alternating between tabs with different content heights', async ({
			page,
			getProdServer,
		}) => {
			const starlight = await getProdServer();
			await starlight.goto('/tabs-variable-height');

			const tabs = page.locator('starlight-tabs').nth(1);
			const selectedTab = tabs.getByRole('tab', { selected: true });

			// Scroll to the second set of synced tabs and focus the selected tab.
			await tabs.scrollIntoViewIfNeeded();
			await selectedTab.focus();

			// Get the bounding box of the tabs.
			const initialBoundingBox = await tabs.boundingBox();

			// Select the second tab which has a different height.
			await selectedTab.press('ArrowRight');

			// Ensure the tabs vertical position is exactly the same after selecting the second tab.
			// Note that a small difference could be the result of the base line-height having a fractional part which can cause a
			// sub-pixel difference in some browsers like Chrome or Firefox.
			expect((await tabs.boundingBox())?.y).toBe(initialBoundingBox?.y);
		});

		test('syncs tabs with the same sync key if they do not consistently use icons', async ({
			page,
			getProdServer,
		}) => {
			const starlight = await getProdServer();
			await starlight.goto('/tabs');

			const tabs = page.locator('starlight-tabs');
			const pkgTabsA = tabs.nth(0); // This set does not use icons for tab items.
			const pkgTabsB = tabs.nth(4); // This set uses icons for tab items.

			// Select the pnpm tab in the first set of synced tabs.
			await pkgTabsA.getByRole('tab').filter({ hasText: 'pnpm' }).click();

			await expectSelectedTab(pkgTabsA, 'pnpm', 'pnpm command');
			await expectSelectedTab(pkgTabsB, 'pnpm', 'another pnpm command');

			// Select the yarn tab in the second set of synced tabs.
			await pkgTabsB.getByRole('tab').filter({ hasText: 'yarn' }).click();

			await expectSelectedTab(pkgTabsB, 'yarn', 'another yarn command');
			await expectSelectedTab(pkgTabsA, 'yarn', 'yarn command');
		});

		test('restores tabs only for synced tabs with a persisted state', async ({
			page,
			getProdServer,
		}) => {
			const starlight = await getProdServer();
			await starlight.goto('/tabs');

			const tabs = page.locator('starlight-tabs');
			const pkgTabsA = tabs.nth(0);
			const pkgTabsB = tabs.nth(2);
			const pkgTabsC = tabs.nth(4);
			const unsyncedTabs = tabs.nth(1);
			const styleTabs = tabs.nth(3);
			const osTabsA = tabs.nth(5);
			const osTabsB = tabs.nth(6);

			// Select the pnpm tab in the set of tabs synced with the 'pkg' key.
			await pkgTabsA.getByRole('tab').filter({ hasText: 'pnpm' }).click();

			await expectSelectedTab(pkgTabsA, 'pnpm', 'pnpm command');
			await expectSelectedTab(pkgTabsB, 'pnpm', 'another pnpm command');
			await expectSelectedTab(pkgTabsC, 'pnpm', 'another pnpm command');

			await page.reload();

			// The synced tabs with a persisted state should be restored.
			await expectSelectedTab(pkgTabsA, 'pnpm', 'pnpm command');
			await expectSelectedTab(pkgTabsB, 'pnpm', 'another pnpm command');
			await expectSelectedTab(pkgTabsC, 'pnpm', 'another pnpm command');

			// Other tabs should not be affected.
			await expectSelectedTab(unsyncedTabs, 'one', 'tab 1');
			await expectSelectedTab(styleTabs, 'css', 'css code');
			await expectSelectedTab(osTabsA, 'macos', 'macOS');
			await expectSelectedTab(osTabsB, 'macos', 'ls');
		});

		test('restores tabs for a single set of synced tabs with a persisted state', async ({
			page,
			getProdServer,
		}) => {
			const starlight = await getProdServer();
			await starlight.goto('/tabs');

			const tabs = page.locator('starlight-tabs');
			const styleTabs = tabs.nth(3);

			// Select the tailwind tab in the set of tabs synced with the 'style' key.
			await styleTabs.getByRole('tab').filter({ hasText: 'tailwind' }).click();

			await expectSelectedTab(styleTabs, 'tailwind', 'tailwind code');

			await page.reload();

			// The synced tabs with a persisted state should be restored.
			await expectSelectedTab(styleTabs, 'tailwind', 'tailwind code');
		});

		test('restores tabs for multiple synced tabs with different sync keys', async ({
			page,
			getProdServer,
		}) => {
			const starlight = await getProdServer();
			await starlight.goto('/tabs');

			const tabs = page.locator('starlight-tabs');
			const pkgTabsA = tabs.nth(0);
			const pkgTabsB = tabs.nth(2);
			const pkgTabsC = tabs.nth(4);
			const osTabsA = tabs.nth(5);
			const osTabsB = tabs.nth(6);

			// Select the pnpm tab in the set of tabs synced with the 'pkg' key.
			await pkgTabsA.getByRole('tab').filter({ hasText: 'pnpm' }).click();

			await expectSelectedTab(pkgTabsA, 'pnpm', 'pnpm command');
			await expectSelectedTab(pkgTabsB, 'pnpm', 'another pnpm command');
			await expectSelectedTab(pkgTabsC, 'pnpm', 'another pnpm command');

			// Select the windows tab in the set of tabs synced with the 'os' key.
			await osTabsB.getByRole('tab').filter({ hasText: 'windows' }).click();

			await page.reload();

			// The synced tabs with a persisted state for the `pkg` sync key should be restored.
			await expectSelectedTab(pkgTabsA, 'pnpm', 'pnpm command');
			await expectSelectedTab(pkgTabsB, 'pnpm', 'another pnpm command');
			await expectSelectedTab(pkgTabsC, 'pnpm', 'another pnpm command');

			// The synced tabs with a persisted state for the `os` sync key should be restored.
			await expectSelectedTab(osTabsA, 'windows', 'Windows');
			await expectSelectedTab(osTabsB, 'windows', 'Get-ChildItem');
		});

		test('includes the `<starlight-tabs-restore>` element only for synced tabs', async ({
			page,
			getProdServer,
		}) => {
			const starlight = await getProdServer();
			await starlight.goto('/tabs');

			// The page includes 7 sets of tabs.
			await expect(page.locator('starlight-tabs')).toHaveCount(7);
			// Only 6 sets of tabs are synced.
			await expect(page.locator('starlight-tabs-restore')).toHaveCount(6);
		});

		test('includes the synced tabs restore script only when needed and at most once', async ({
			page,
			getProdServer,
		}) => {
			const starlight = await getProdServer();
			const syncedTabsRestoreScriptRegex = /customElements\.define\('starlight-tabs-restore',/g;

			await starlight.goto('/tabs');

			// The page includes at least one set of synced tabs.
			expect((await page.content()).match(syncedTabsRestoreScriptRegex)?.length).toBe(1);

			await starlight.goto('/tabs-unsynced');

			// The page includes no set of synced tabs.
			expect((await page.content()).match(syncedTabsRestoreScriptRegex)).toBeNull();
		});

		test('gracefully handles invalid persisted state for synced tabs', async ({
			page,
			getProdServer,
		}) => {
			const starlight = await getProdServer();
			await starlight.goto('/tabs');

			const tabs = page.locator('starlight-tabs');
			const pkgTabsA = tabs.nth(0);

			// Select the pnpm tab in the set of tabs synced with the 'pkg' key.
			await pkgTabsA.getByRole('tab').filter({ hasText: 'pnpm' }).click();

			await expectSelectedTab(pkgTabsA, 'pnpm', 'pnpm command');

			// Replace the persisted state with a new invalid value.
			await page.evaluate(
				(value) => localStorage.setItem('starlight-synced-tabs__pkg', value),
				'invalid-value'
			);

			await page.reload();

			// The synced tabs should not be restored due to the invalid persisted state.
			await expectSelectedTab(pkgTabsA, 'npm', 'npm command');

			// Select the pnpm tab in the set of tabs synced with the 'pkg' key.
			await pkgTabsA.getByRole('tab').filter({ hasText: 'pnpm' }).click();

			await expectSelectedTab(pkgTabsA, 'pnpm', 'pnpm command');

			// The synced tabs should be restored with the new valid persisted state.
			expect(await page.evaluate(() => localStorage.getItem('starlight-synced-tabs__pkg'))).toBe(
				'pnpm'
			);
		});

		test('syncs and restores nested tabs', async ({ page, getProdServer }) => {
			const starlight = await getProdServer();
			await starlight.goto('/tabs-nested');

			const tabs = page.locator('starlight-tabs');
			const pkgTabs = tabs.nth(0);
			const osTabsA = tabs.nth(1);
			const osTabsB = tabs.nth(2);

			// Select the linux tab in the npm tab.
			await osTabsA.getByRole('tab').filter({ hasText: 'linux' }).click();

			await expectSelectedTab(osTabsA, 'linux', 'npm GNU/Linux');

			// Select the pnpm tab.
			await pkgTabs.getByRole('tab').filter({ hasText: 'pnpm' }).click();

			await expectSelectedTab(pkgTabs, 'pnpm');
			await expectSelectedTab(osTabsB, 'linux', 'pnpm GNU/Linux');

			await page.reload();

			// The synced tabs should be restored.
			await expectSelectedTab(pkgTabs, 'pnpm');
			await expectSelectedTab(osTabsB, 'linux', 'pnpm GNU/Linux');
		});
	});

	test.describe('whitespaces', () => {
		/**
		 * Components including styles include a trailing whitespace which can be problematic when used
		 * inline, e.g.:
		 *
		 * ```mdx
		 * Badge (<Badge text="test" />)
		 * ```
		 *
		 * The example above would render as:
		 *
		 * ```
		 * Badge (test )
		 * ```
		 *
		 * Having a component being responsible for its own spacing is not ideal and should be avoided
		 * especially when used inline.
		 * To work around this issue, such components can be wrapped in a fragment.
		 *
		 * @see https://github.com/withastro/compiler/issues/1003
		 */
		test('does not include components having trailing whitespaces when used inline', async ({
			page,
			getProdServer,
		}) => {
			const starlight = await getProdServer();
			await starlight.goto('/whitespaces');

			expect(await page.getByTestId('badge').textContent()).toContain('Badge (Note)');
			expect(await page.getByTestId('icon').textContent()).toContain('Icon ()');
		});
	});

	test.describe('anchor headings', () => {
		test('renders the same content for Markdown headings and Astro component', async ({
			getProdServer,
			page,
		}) => {
			const starlight = await getProdServer();

			await starlight.goto('/anchor-heading');
			const markdownContent = page.locator('.sl-markdown-content');
			const markdownHtml = await markdownContent.innerHTML();

			await starlight.goto('/anchor-heading-component');
			const componentContent = page.locator('.sl-markdown-content');
			const componentHtml = await componentContent.innerHTML();

			expect(markdownHtml).toEqual(componentHtml);
		});

		test('does not render headings anchor links for individual Markdown pages and entries not part of the `docs` collection', async ({
			getProdServer,
			page,
		}) => {
			const starlight = await getProdServer();

			// Individual Markdown page
			await starlight.goto('/markdown-page');
			await expect(page.locator('.sl-anchor-link')).not.toBeAttached();

			// Content entry from the `reviews` content collection
			await starlight.goto('/reviews/alice');
			await expect(page.locator('.sl-anchor-link')).not.toBeAttached();
		});

		test('renders headings anchor links for entries not part of the `docs` collection matching the `markdown.processedDirs` option', async ({
			getProdServer,
			page,
		}) => {
			const starlight = await getProdServer();

			// Content entry from the `comments` content collection
			await starlight.goto('/comments/bob');
			await expect(page.locator('.sl-anchor-link').first()).toBeAttached();
		});
	});

	test.describe('asides', () => {
		test('does not render Markdown asides for individual Markdown pages and entries not part of the `docs` collection', async ({
			getProdServer,
			page,
		}) => {
			const starlight = await getProdServer();

			// Individual Markdown page
			await starlight.goto('/markdown-page');
			await expect(page.locator('.starlight-aside')).not.toBeAttached();

			// Content entry from the `reviews` content collection
			await starlight.goto('/reviews/alice');
			await expect(page.locator('.starlight-aside')).not.toBeAttached();
		});

		test('renders Markdown asides for entries not part of the `docs` collection matching the `markdown.processedDirs` option', async ({
			getProdServer,
			page,
		}) => {
			const starlight = await getProdServer();

			// Content entry from the `comments` content collection
			await starlight.goto('/comments/bob');
			await expect(page.locator('.starlight-aside')).toBeAttached();
		});
	});

	test.describe('RTL support', () => {
		test('does not add RTL support to code and preformatted text elements for individual Markdown pages and entries not part of the `docs` collection', async ({
			getProdServer,
			page,
		}) => {
			const starlight = await getProdServer();

			// Individual Markdown page
			await starlight.goto('/markdown-page');
			await expect(page.locator('code[dir="auto"]')).not.toBeAttached();

			// Content entry from the `reviews` content collection
			await starlight.goto('/reviews/alice');
			await expect(page.locator('code[dir="auto"]')).not.toBeAttached();
		});

		test('adds RTL support to code and preformatted text elements for entries not part of the `docs` collection matching the `markdown.processedDirs` option', async ({
			getProdServer,
			page,
		}) => {
			const starlight = await getProdServer();

			// Content entry from the `comments` content collection
			await starlight.goto('/comments/bob');
			await expect(page.locator('code[dir="auto"]').first()).toBeAttached();
		});
	});

	test.describe('head propagation', () => {
		/**
		 * Due to a head propagation issue in development mode, dynamic routes alphabetically sorted
		 * before Starlight route (`[...slug]`) rendering the `<StarlightPage>` component can result in
		 * missing styles. The issue is workaround by having our call to `render` from `astro:content` to
		 * be in a specific file.
		 *
		 * @see https://github.com/withastro/astro/issues/13724
		 */
		test('does not prevent head propagation in dev mode when rendering a dynamic route using the `<StarlightPage>` component', async ({
			page,
			makeServer,
		}) => {
			const starlight = await makeServer('dev', { mode: 'dev' });
			await starlight.goto('/head-propagation');

			await expect(page.getByTestId('purple-card')).toHaveCSS(
				'background-color',
				'rgb(128, 0, 128)'
			);
		});
	});

	test.describe('css layer order', () => {
		test('ensures that the StarlightPage component is always imported first to ensure a predictable CSS layer order in custom pages', async ({
			page,
			makeServer,
		}) => {
			const starlight = await makeServer('dev', { mode: 'dev' });
			await starlight.goto('/starlight-page-css-layer-order');

			const firstStyleContent = await page.evaluate(
				() => document.head.querySelector('style')?.textContent ?? ''
			);

			const expectedLayersOrder = await fs.readFile(
				new URL('../style/layers.css', import.meta.url),
				'utf-8'
			);

			// Ensure that the first style block in the head contains the expected layers order rather
			// the styles of the link button wrapped in a `@layer` block at-rule automatically declaring
			// a new layer and thus potentially breaking the intended layers order as the initial order
			// in which layers are declared indicates which layer has precedence.
			expect(firstStyleContent).toBe(expectedLayersOrder);
		});
	});

	async function expectSelectedTab(tabs: Locator, label: string, panel?: string) {
		expect(
			(
				await tabs.locator(':scope > div:first-child [role=tab][aria-selected=true]').textContent()
			)?.trim()
		).toBe(label);

		if (panel) {
			const tabPanel = tabs.locator(':scope > [role=tabpanel]:not([hidden])');
			await expect(tabPanel).toBeVisible();
			expect((await tabPanel.textContent())?.trim()).toBe(panel);
		}
	}
});

test.describe('param normalization', () => {
	test('renders the correct content for a file with Arabic diacritics', async ({
		page,
		getProdServer,
	}) => {
		const starlight = await getProdServer();
		await starlight.goto('/اللُّغَةُ-الْعَرَبِيَّةُ');
		const content = page.locator('main');
		await expect(content).toHaveText(/This file contains Arabic diacritics in the file name./);
	});
});

test.describe('ToC highlighting', () => {
	test.describe('highlights overview', () => {
		test(
			'desktop viewport (1280×720)',
			testTOCHighlighting({
				width: 1280,
				height: 720,
				path: '/headings',
				pattern: /Overview/,
			})
		);
		test(
			'tablet viewport (810×1080)',
			testTOCHighlighting({
				width: 810,
				height: 1080,
				path: '/headings',
				pattern: /Overview/,
			})
		);
		test(
			'mobile viewport (375×667)',
			testTOCHighlighting({
				width: 375,
				height: 667,
				path: '/headings',
				pattern: /Overview/,
			})
		);
	});

	test.describe('highlights overview when scrolled to opening paragraph', () => {
		test(
			'desktop viewport (1280×720)',
			testTOCHighlighting({
				width: 1280,
				height: 720,
				path: '/headings',
				pattern: /Overview/,
				scrollBy: 200,
			})
		);
		test(
			'tablet viewport (810×1080)',
			testTOCHighlighting({
				width: 810,
				height: 1080,
				path: '/headings',
				pattern: /Overview/,
				scrollBy: 200,
			})
		);
		test(
			'mobile viewport (375×667)',
			testTOCHighlighting({
				width: 375,
				height: 667,
				path: '/headings',
				pattern: /Overview/,
				scrollBy: 200,
			})
		);
	});

	test.describe('highlights overview when a high banner is present', () => {
		test(
			'desktop viewport (1280×720)',
			testTOCHighlighting({
				width: 1280,
				height: 720,
				path: '/headings-banner',
				pattern: /Overview/,
			})
		);
		test(
			'tablet viewport (810×1080)',
			testTOCHighlighting({
				width: 810,
				height: 1080,
				path: '/headings-banner',
				pattern: /Overview/,
			})
		);
		test(
			'mobile viewport (375×667)',
			testTOCHighlighting({
				width: 375,
				height: 667,
				path: '/headings-banner',
				pattern: /Overview/,
			})
		);
	});

	test.describe('highlights heading 1', () => {
		test(
			'desktop viewport (1280×720)',
			testTOCHighlighting({
				width: 1280,
				height: 720,
				path: '/headings#heading-1',
				pattern: /Heading 1/,
			})
		);
		test(
			'tablet viewport (810×1080)',
			testTOCHighlighting({
				width: 810,
				height: 1080,
				path: '/headings#heading-1',
				pattern: /Heading 1/,
			})
		);
		test(
			'mobile viewport (375×667)',
			testTOCHighlighting({
				width: 375,
				height: 667,
				path: '/headings#heading-1',
				pattern: /Heading 1/,
			})
		);
	});

	test.describe('highlights heading 1 when scrolled to paragraph below', () => {
		test(
			'desktop viewport (1280×720)',
			testTOCHighlighting({
				width: 1280,
				height: 720,
				path: '/headings#heading-1',
				pattern: /Heading 1/,
				scrollBy: 250,
			})
		);
		test(
			'tablet viewport (810×1080)',
			testTOCHighlighting({
				width: 810,
				height: 1080,
				path: '/headings#heading-1',
				pattern: /Heading 1/,
				scrollBy: 250,
			})
		);
		test(
			'mobile viewport (375×667)',
			testTOCHighlighting({
				width: 375,
				height: 667,
				path: '/headings#heading-1',
				pattern: /Heading 1/,
				scrollBy: 250,
			})
		);
	});

	test.describe('highlights heading 3', () => {
		test(
			'desktop viewport (1280×720)',
			testTOCHighlighting({
				width: 1280,
				height: 720,
				path: '/headings#heading-3',
				pattern: /Heading 3/,
			})
		);
		test(
			'tablet viewport (810×1080)',
			testTOCHighlighting({
				width: 810,
				height: 1080,
				path: '/headings#heading-3',
				pattern: /Heading 3/,
			})
		);
		test(
			'mobile viewport (375×667)',
			testTOCHighlighting({
				width: 375,
				height: 667,
				path: '/headings#heading-3',
				pattern: /Heading 3/,
			})
		);
	});

	test.describe('highlights heading 3 from focusing on a list item', () => {
		test(
			'desktop viewport (1280×720)',
			testTOCHighlighting({
				width: 1280,
				height: 720,
				path: '/headings#non-heading-id',
				pattern: /Heading 3/,
			})
		);
		test(
			'tablet viewport (810×1080)',
			testTOCHighlighting({
				width: 810,
				height: 1080,
				path: '/headings#non-heading-id',
				pattern: /Heading 3/,
			})
		);
		test(
			'mobile viewport (375×667)',
			testTOCHighlighting({
				width: 375,
				height: 667,
				path: '/headings#non-heading-id',
				pattern: /Heading 3/,
			})
		);
	});

	test.describe('highlights h3 above an h4', () => {
		test(
			'desktop viewport (1280×720)',
			testTOCHighlighting({
				width: 1280,
				height: 720,
				path: '/headings#heading-4',
				pattern: /Heading 3/,
			})
		);
		test(
			'tablet viewport (810×1080)',
			testTOCHighlighting({
				width: 810,
				height: 1080,
				path: '/headings#heading-4',
				pattern: /Heading 3/,
			})
		);
		test(
			'mobile viewport (375×667)',
			testTOCHighlighting({
				width: 375,
				height: 667,
				path: '/headings#heading-4',
				pattern: /Heading 3/,
			})
		);
	});
});

/**
 * Loads the given `path` in a window of the specified `width` and `height` and checks that the
 * Starlight table of contents is highlighting an item with contents matching `pattern`.
 * The optional `scrollBy` parameter scrolls the page by that number of pixels before testing.
 */
function testTOCHighlighting({
	width,
	height,
	path,
	pattern,
	scrollBy,
}: {
	width: number;
	height: number;
	path: string;
	pattern: RegExp;
	scrollBy?: number;
}) {
	return async ({
		page,
		getProdServer,
	}: {
		page: Page;
		getProdServer: () => Promise<StarlightPage>;
	}) => {
		const test = async () => {
			if (width > 1150) {
				// On “desktop” viewports check the correct link is set as aria-current in the page sidebar.
				const overviewLink = page.locator('starlight-toc [aria-current="true"]');
				await expect(overviewLink).toHaveText(pattern);
			} else {
				// On smaller viewports, check the <MobileTableOfContents> component.
				// The table of contents bar should display the current heading.
				const currentSectionLabel = page.locator('mobile-starlight-toc .display-current');
				await expect(currentSectionLabel).toHaveText(pattern);
				// Within the table of contents drop down, the highlighted link should be correct.
				const overviewLink = page.locator('mobile-starlight-toc [aria-current="true"]');
				await expect(overviewLink).toHaveText(pattern);
			}
		};

		await page.setViewportSize({ width, height });
		const starlight = await getProdServer();
		await starlight.goto(path);
		if (scrollBy) {
			await page.mouse.wheel(0, scrollBy);
		}

		// Test highlighting on initial load
		await test();

		// Test highlighting on page refresh (which maintains scroll position)
		await page.reload();
		await test();
	};
}
