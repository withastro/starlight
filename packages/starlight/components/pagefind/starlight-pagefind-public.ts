import type { PagefindSearchFragment } from './starlight-pagefind-js';

/** Starlight Pagefind public API. */
export interface StarlightPagefindPublicApi {
	/**
	 * Set Pagefind selected filters to use in the search results.
	 * Filter names and values supplied are case-sensitive.
	 */
	triggerFilters: (filters: PagefindSearchFragment['filters']) => Promise<void>;
	/** Perform a search with the given query. */
	triggerSearch: (query: string) => Promise<void>;
}

/** Starlight Pagefind web component, useful when querying the DOM for it with `querySelector`. */
export type StarlightPagefindWebComponent = HTMLElement & StarlightPagefindPublicApi;
