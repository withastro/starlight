import { afterEach, beforeEach, expect, test, vi } from 'vitest';

const addEventListener = vi.fn();

beforeEach(() => {
	vi.resetModules();
	addEventListener.mockReset();
	vi.stubGlobal('addEventListener', addEventListener);
	vi.stubGlobal('document', {
		getElementById: vi.fn(),
		visibilityState: 'visible',
	});
});

afterEach(() => {
	vi.unstubAllGlobals();
});

test('stores sidebar state on the pagehide event', async () => {
	// @ts-expect-error The client script intentionally has no exports.
	await import('../../components-internals/SidebarPersistState');

	expect(addEventListener).toHaveBeenCalledWith('pagehide', expect.any(Function));
	expect(addEventListener).not.toHaveBeenCalledWith('pageHide', expect.any(Function));
});
