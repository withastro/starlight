import type { Page } from '@playwright/test';
import { expect, testFactory, type Locator } from './test-utils';

const test = testFactory('./fixtures/basics/');

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

	test('syncs tabs with the same sync key if they do not consistenly use icons', async ({
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

		page.reload();

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

		page.reload();

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

		page.reload();

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

		page.reload();

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

		page.reload();

		// The synced tabs should be restored.
		await expectSelectedTab(pkgTabs, 'pnpm');
		await expectSelectedTab(osTabsB, 'linux', 'pnpm GNU/Linux');
	});
});

test.describe('custom icons', () => {
	test('renders Iconify icons', async ({ page, getProdServer }) => {
		const starlight = await getProdServer();
		await starlight.goto('/icons');

		const expectedPath =
			'<path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"></path>';
		const expectedSymbol = `<symbol id="ai:mdi:checkbox-blank-circle" viewBox="0 0 24 24">${expectedPath}</symbol>`;
		const expectedUse = '<use href="#ai:mdi:checkbox-blank-circle"></use>';

		// First Iconify icon: symbol with path + use
		const iconComponentIcon = await getSvgByTestid(page, 'iconify-icon-component');
		expect(iconComponentIcon).toBe(expectedSymbol + expectedUse);

		// Second Iconify icon: use only
		const cardComponentIcon = await getSvgByTestid(page, 'iconify-card-component');
		expect(cardComponentIcon).toBe(expectedUse);

		// Third Iconify icon: use only
		const asideComponentIcon = await getSvgByTestid(page, 'iconify-aside-component');
		expect(asideComponentIcon).toBe(expectedUse);

		// Fourth Iconify icon from a directive: path only
		const asideDirectiveIcon = await getSvgByTestid(page, 'iconify-aside-directive');
		expect(asideDirectiveIcon).toBe(expectedPath);
	});

	test('renders local icons', async ({ page, getProdServer }) => {
		const starlight = await getProdServer();
		await starlight.goto('/icons');

		const expectedPaths =
			'<g fill="currentColor"><path d="M11.84 22.52a7.35 7.35 0 0 1-3.2-14 .75.75 0 0 1 .65 1.35 5.83 5.83 0 1 0 4.85-.13.75.75 0 1 1 .59-1.37 7.35 7.35 0 0 1-2.89 14.11z"></path><path d="M9 10a.74.74 0 0 1-.75-.75V5.38A.75.75 0 0 1 9 4.63h5.46a.75.75 0 0 1 .75.75V9.1a.75.75 0 1 1-1.5 0v-3h-4v3.1A.75.75 0 0 1 9 10m1.78 7.76a29 29 0 0 1-5.55-.56.75.75 0 0 1-.62-.73.76.76 0 0 1 .91-.74c.37.08 9.06 1.85 12.36-1.56a.76.76 0 0 1 1.06 0 .73.73 0 0 1 0 1v.05c-1.94 2.02-5.27 2.54-8.16 2.54"></path><path d="M13.58 6.13H10a.74.74 0 0 1-.75-.75V2.53a.75.75 0 0 1 .75-.75h3.63a.75.75 0 0 1 .75.75v2.85a.74.74 0 0 1-.8.75m-2.88-1.5h2.13V3.28H10.7z"></path></g>';
		const expectedSymbol = `<symbol id="ai:local:test" viewBox="0 0 24 24">${expectedPaths}</symbol>`;
		const expectedUse = '<use href="#ai:local:test"></use>';

		// First local icon: symbol with path + use
		const iconComponentIcon = await getSvgByTestid(page, 'local-icon-component');
		expect(iconComponentIcon).toBe(expectedSymbol + expectedUse);

		// Second local icon: use only
		const cardComponentIcon = await getSvgByTestid(page, 'local-card-component');
		expect(cardComponentIcon).toBe(expectedUse);

		// Third local icon: use only
		const asideComponentIcon = await getSvgByTestid(page, 'local-aside-component');
		expect(asideComponentIcon).toBe(expectedUse);

		// Fourth local icon from a directive: path only
		const asideDirectiveIcon = await getSvgByTestid(page, 'local-aside-directive');
		expect(asideDirectiveIcon).toBe(expectedPaths);
	});

	async function getSvgByTestid(page: Page, testId: string) {
		const html = await page.getByTestId(testId).locator('svg').innerHTML();
		return html.trim();
	}
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
