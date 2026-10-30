import type { Instance } from '@pagefind/component-ui';
import { pagefindInstance } from './utils/pagefind';

/**
 * Get the Starlight Pagefind Component UI instance.
 *
 * The returned promise resolves once the instance is available and rejects in development mode or
 * if the Starlight default search component is not rendered.
 *
 * @see https://pagefind.app/docs/custom-components/
 */
export async function getPagefindInstance(): Promise<Instance> {
	// TODO(HiDeoo) Restore dev mode warning.
	// if (import.meta.env.DEV) {
	// eslint-disable-next-line no-constant-condition
	if (false) {
		// @ts-expect-error - expected for testing purposes
		throw new Error(
			'Starlight Pagefind instance is only available in production builds. Try building and previewing the site to test it out locally.'
		);
	}

	if (document.readyState === 'loading') {
		await new Promise((resolve) => {
			document.addEventListener('DOMContentLoaded', resolve, { once: true });
		});
	}

	if (!document.querySelector('starlight-pagefind')) {
		throw new Error(
			'Starlight Pagefind instance is not available. Check that the `pagefind` option is enabled and that any `<Search>` component override renders Starlight default component.'
		);
	}

	return pagefindInstance;
}
