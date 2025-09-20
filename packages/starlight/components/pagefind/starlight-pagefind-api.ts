import type { StarlightPagefind } from './starlight-pagefind';
import type { PagefindSearchFragment } from './starlight-pagefind-js';

export type { PagefindUserConfig as StarlightPagefindOptions } from '../../schemas/pagefind';

/** Starlight Pagefind API. */
export interface StarlightPagefindApi {
	/**
	 * Set Pagefind selected filters to use in the search results.
	 * Filter names and values supplied are case-sensitive.
	 */
	triggerFilters: (filters: PagefindSearchFragment['filters']) => void;
	/** Perform a search with the given query. */
	triggerSearch: (query: string) => void;
}

/**
 * Returns the Starlight Pagefind API, waiting for the Starlight Pagefind component to be defined
 * if necessary.
 */
export async function getPagefindApi(): Promise<StarlightPagefindApi> {
	const instance = await getOrWaitForStarlightPagefind();

	return {
		triggerFilters: (...args) => instance.triggerFilters(...args),
		triggerSearch: (...args) => instance.triggerSearch(...args),
	};
}

/** Starlight Pagefind instance. */
let starlightPagefind: StarlightPagefind | null = null;

/** Return a fully initialized Starlight Pagefind instance, waiting for it to be ready if necessary. */
async function getOrWaitForStarlightPagefind(): Promise<StarlightPagefind> {
	if (starlightPagefind) return starlightPagefind;

	await customElements.whenDefined('starlight-pagefind');
	starlightPagefind = document.querySelector<StarlightPagefind>('starlight-pagefind')!;

	return starlightPagefind;
}
