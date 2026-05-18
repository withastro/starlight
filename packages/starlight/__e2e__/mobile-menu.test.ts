import { expect, testFactory } from './test-utils';

const test = testFactory('./fixtures/basics/');

const mobileViewport = { width: 600, height: 900 };

test.describe('mobile menu', () => {
	test('traps Tab focus inside the menu while it is expanded', async ({
		page,
		getProdServer,
	}) => {
		await page.setViewportSize(mobileViewport);
		const starlight = await getProdServer();
		await starlight.goto('/headings');

		const wrapper = page.locator('starlight-menu-button');
		const toggle = wrapper.locator('button');
		await toggle.click();
		await expect(wrapper).toHaveAttribute('aria-expanded', 'true');

		// Collect the first and last visible focusable in the header `<nav>` using the
		// same selector and visibility filter as the runtime focus-trap.
		const [firstSelector, lastSelector] = await page.evaluate(() => {
			const nav = document.querySelector<HTMLElement>('nav:has(starlight-menu-button)');
			if (!nav) throw new Error('Could not find the header <nav>.');
			const focusables = Array.from(
				nav.querySelectorAll<HTMLElement>(
					'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
				)
			).filter((el) => el.offsetParent !== null);
			if (focusables.length < 2) {
				throw new Error('Expected at least two focusable elements in the header nav.');
			}
			const tagId = (el: HTMLElement) => {
				if (!el.id) el.id = `_focus_test_${Math.random().toString(36).slice(2)}`;
				return `#${CSS.escape(el.id)}`;
			};
			return [tagId(focusables[0]!), tagId(focusables[focusables.length - 1]!)] as const;
		});

		// Tab from the last focusable should wrap to the first.
		await page.locator(lastSelector).focus();
		await page.keyboard.press('Tab');
		await expect(page.locator(firstSelector)).toBeFocused();

		// Shift+Tab from the first focusable should wrap to the last.
		await page.locator(firstSelector).focus();
		await page.keyboard.press('Shift+Tab');
		await expect(page.locator(lastSelector)).toBeFocused();
	});

	test('does not trap Tab focus when the menu is closed', async ({ page, getProdServer }) => {
		await page.setViewportSize(mobileViewport);
		const starlight = await getProdServer();
		await starlight.goto('/headings');

		// Menu is closed by default — Tab from the toggle button should proceed
		// to the page content rather than wrap back inside the nav.
		const menuOpen = await page.evaluate(() =>
			document.body.hasAttribute('data-mobile-menu-expanded')
		);
		expect(menuOpen).toBe(false);

		await page.locator('starlight-menu-button button').focus();
		await page.keyboard.press('Tab');

		const stillInsideNav = await page.evaluate(() =>
			Boolean(document.activeElement?.closest('nav:has(starlight-menu-button)'))
		);
		expect(stillInsideNav).toBe(false);
	});

	test('closes on Escape and restores focus to the toggle button', async ({
		page,
		getProdServer,
	}) => {
		await page.setViewportSize(mobileViewport);
		const starlight = await getProdServer();
		await starlight.goto('/headings');

		const wrapper = page.locator('starlight-menu-button');
		const toggle = wrapper.locator('button');
		await toggle.click();
		await expect(wrapper).toHaveAttribute('aria-expanded', 'true');

		await page.keyboard.press('Escape');
		await expect(wrapper).toHaveAttribute('aria-expanded', 'false');
		await expect(toggle).toBeFocused();
	});
});
