import type { PagefindConfig } from '../../schemas/pagefind';
import type {
	Pagefind,
	PagefindFilterCounts,
	PagefindIndexOptions,
	PagefindSearchFragment,
	PagefindSearchResult,
	PagefindSubResult,
} from './starlight-pagefind-js';
import type { StarlightPagefindResult } from './starlight-pagefind-result';
import type { StarlightPagefindMeta } from './starlight-pagefind-meta';
import type { StarlightPagefindFilter } from './starlight-pagefind-filter';
import type { StarlightPagefindPublicApi } from './starlight-pagefind-public';

/**
 * Various configuration options for the Starlight Pagefind component that are either not
 * user-configurable in Starlight or hardcoded values extracted from the original Pagefind UI.
 */
const starlightPagefindConfig = {
	/** Amount of milliseconds to wait before performing a search after the user stops typing. */
	debounceTimeoutMs: 300,
	/** Length of excerpts to show in search results. */
	excerptLength: 12,
	/** Number of root results to show per page. */
	resultsPerPage: 5,
	/**
	 * A list of meta keys to skip when processing results.
	 * @see {@link https://github.com/Pagefind/pagefind/blob/d7d0b3a0f0eb12661cd2eb894ad02f10687a4ca0/pagefind_ui/default/svelte/result_with_subs.svelte#L6}
	 */
	skipMeta: new Set(['title', 'image', 'image_alt', 'url']),
	/** Number of sub-results to show per root result. */
	subResultsPerResult: 3,
};

/**
 * A Starlight-specific rewrite of the original Pagefind UI.
 * Currently, only features and options that can be used or overridden in Starlight are implemented.
 *
 * @see {@link https://github.com/Pagefind/pagefind/tree/main/pagefind_ui/default}
 * @see {@link https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/}
 * @see {@link https://www.makethingsaccessible.com/guides/accessible-site-search-with-combobox-suggestions/}
 */
export class StarlightPagefind extends HTMLElement implements StarlightPagefindPublicApi {
	/** Options for the Starlight Pagefind component. */
	#options: StarlightPagefindOptions = { bundlePath: '/pagefind/' };
	/** Pagefind options. */
	#pagefindOptions?: PagefindOptions;

	/** Various references to elements commonly used in this component. */
	#dialog = this.closest('dialog')!;
	#form = this.querySelector('form')!;
	#queryInput = this.querySelector<HTMLInputElement>('input[type="search"]')!;
	#status = this.querySelector('.sl-pagefind-status')!;
	#filters = this.querySelector('.sl-pagefind-filters')!;
	#filterTemplate = this.querySelector<HTMLTemplateElement>('#sl-pagefind-filter-tpl')!;
	#listbox = this.querySelector('ul')!;
	#metaTemplate = this.querySelector<HTMLTemplateElement>('#sl-pagefind-meta-tpl')!;
	#resultTemplate = this.querySelector<HTMLTemplateElement>('#sl-pagefind-result-tpl')!;
	#clearButton = this.querySelector('button.sl-pagefind-clear')!;
	#showMoreButton = this.querySelector('button.sl-pagefind-show-more')!;
	#selectedResult?: StarlightPagefindResult | null;

	/** Pagefind instance and search results. */
	#pagefind?: Pagefind;
	#pagefindResults: PagefindSearchResult[] = [];
	#pagefindQuery = '';
	#pagefindFilters: PagefindFilters = { initial: {}, available: {}, opened: {}, selected: {} };
	#starlightPagefindResults: StarlightPagefindSearchResult[] = [];

	/** A match media query to check if getting a specific result into view should be animated or not. */
	#prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

	/** Number formatter used to format numbers in translations. */
	#numberFormatter = new Intl.NumberFormat(document.documentElement.lang || 'en');

	/**
	 * An abort controller and timeout reference used to orchestrate searches.
	 * @see {@link StarlightPagefind.#search} for more details.
	 */
	#seachAbortController?: AbortController | undefined;
	#searchTimeout?: ReturnType<typeof setTimeout>;

	/**
	 * Various state variables used to track the state of the component.
	 * These states are not mutually exclusive, so multiple states can be true at the same time.
	 */
	#didTryLoadingPagefind = false;
	#isPerformingSearch = false;

	/** Callback called when the component is added to the document. */
	connectedCallback() {
		this.#attachEventListeners();
	}

	/* ------------ Event listeners ----------- */

	/** Attach all required event listeners. */
	#attachEventListeners() {
		this.#form.addEventListener('change', this.#onFormChange);

		this.#queryInput.addEventListener('focus', this.#loadPagefind);
		this.#queryInput.addEventListener('keydown', this.#onQueryInputKeyDown);
		this.#queryInput.addEventListener('input', this.#onQueryInputChange);

		this.#showMoreButton.addEventListener('click', this.#onShowMoreButtonClick);

		this.#clearButton.addEventListener('click', this.#onClearButtonClick);
	}

	/** Handle form changes, specifically checkbox inputs for filters. */
	#onFormChange = (event: Event) => {
		if (!(event.target instanceof HTMLInputElement) || event.target.type !== 'checkbox') return;

		const filters: PagefindFilters['selected'] = {};

		// Collect all checked filters and immediately transform them into the expected format.
		// This is a different approach than the original Pagefind UI which transforms them
		// for each search.
		for (const filter of this.#filters.querySelectorAll<HTMLInputElement>(
			'input[type="checkbox"]:checked'
		)) {
			const name = filter.dataset.slPagefindFilterName;
			const value = filter.dataset.slPagefindFilterValue;
			if (!name || !value) continue;

			filters[name] ??= [];
			filters[name].push(value);
		}

		this.#pagefindFilters.selected = filters;
		this.#search();
	};

	/** Handle keydown events on the query input. */
	#onQueryInputKeyDown = (event: KeyboardEvent) => {
		if (!(event.target instanceof HTMLInputElement)) return;

		// https://www.w3.org/WAI/ARIA/apg/patterns/combobox/#keyboardinteraction
		switch (event.key) {
			case 'ArrowDown': {
				event.preventDefault();
				this.#updateSelectedResult('next');
				break;
			}
			case 'ArrowUp': {
				event.preventDefault();
				this.#updateSelectedResult('prev');
				break;
			}
			case 'Enter': {
				event.preventDefault();
				this.#openSelection();
				break;
			}
		}
	};

	/** Handle query input changes. */
	#onQueryInputChange = (event: Event) => {
		if (!(event.target instanceof HTMLInputElement)) return;
		this.#pagefindQuery = event.target.value;
		this.#renderClearButton();
		this.#search();
	};

	/** Handle clicks on the button to show more results. */
	#onShowMoreButtonClick = async (event: Event) => {
		event.preventDefault();
		await this.#transformPagefindResults();
		this.#render();
	};

	/** Handle clicks on the button to clear the query input. */
	#onClearButtonClick = () => {
		this.#queryInput.value = '';
		this.#queryInput.focus();
		this.#clearPagefindResults();
		this.#renderClearButton();
	};

	/* --------------- Pagefind --------------- */

	/** Set the options for the Starlight Pagefind component and the Pagefind library. */
	init(starlightPagefindOptions: StarlightPagefindOptions, pagefindOptions: PagefindOptions) {
		this.#options = { ...this.#options, ...starlightPagefindOptions };
		this.#pagefindOptions = pagefindOptions;
	}

	/** Load Pagefind, set its options, merge indexes, and load filters. */
	#loadPagefind = async () => {
		if (this.#didTryLoadingPagefind) return;
		this.#didTryLoadingPagefind = true;
		if (this.#pagefind) return;
		if (!this.#pagefindOptions) throw new Error('Trying to load Pagefind with no options.');

		// We only assign pagefind to `this.#pagefind` after potentially merging indexes.
		let pagefind: Pagefind | undefined;

		const pagefindPath = `${this.#options.bundlePath}pagefind.js`;

		try {
			pagefind = await import(pagefindPath);
		} catch (error) {
			console.error(`Failed to load Pagefind from ${pagefindPath}`);
		}

		await pagefind?.options({
			excerptLength: starlightPagefindConfig.excerptLength,
			...this.#pagefindOptions,
		});

		for (const index of this.#options.mergeIndex ?? []) {
			const { bundlePath, ...indexOptions } = index;
			await pagefind?.mergeIndex(bundlePath, indexOptions);
		}

		if (pagefind) this.#pagefind = pagefind;

		await this.#loadFilters();
	};

	/** Return a fully initialized Pagefind instance, waiting for it to be ready if necessary. */
	#getOrWaitForPagefind() {
		if (this.#pagefind) return this.#pagefind;

		return new Promise<Pagefind>((resolve) => {
			const interval = setInterval(() => {
				if (this.#pagefind) {
					clearInterval(interval);
					resolve(this.#pagefind);
				}
			}, 50);
		});
	}

	/** Load Pagefind initial filters, if any. */
	async #loadFilters() {
		if (!this.#pagefind) return;

		this.#pagefindFilters.initial = await this.#pagefind.filters();

		if (Object.keys(this.#pagefindFilters.available).length === 0) {
			this.#pagefindFilters.available = this.#pagefindFilters.initial;
		}
	}

	/** Start a search for a given query, debounced by a timeout. */
	async #search() {
		if (this.#searchTimeout) clearTimeout(this.#searchTimeout);

		if (!this.#pagefindQuery) {
			this.#clearPagefindResults();
			return;
		}

		this.#searchTimeout = setTimeout(async () => {
			this.#seachAbortController?.abort();
			this.#seachAbortController = new AbortController();
			const signal = this.#seachAbortController.signal;

			try {
				await this.#performSearch(this.#pagefindQuery, this.#pagefindFilters.selected, signal);
			} catch (error) {
				if (error instanceof DOMException && error.name === 'AbortError') {
					// Skip aborted searches.
					return;
				}
				// Re-throw other errors.
				throw error;
			}
		}, starlightPagefindConfig.debounceTimeoutMs);

		// Even if the search is debounced, preload results for the query.
		const pagefind = await this.#getOrWaitForPagefind();
		pagefind.preload(this.#pagefindQuery, { filters: this.#pagefindFilters.selected });
	}

	/**
	 * Perform a search for a given query and select filters, if any. Each query is attached to a
	 * signal which can be used to abort a search if a new search is started.
	 *
	 * This approach is different from the original Pagefind UI which manually increments a counter
	 * to attach an ID to each search, and then only renders results for the latest search.
	 * The approach used here allows to abort a search in progress if a new search is started rather
	 * than having all of them completing and then only rendering the latest one.
	 */
	async #performSearch(query: string, filters: PagefindFilters['selected'], signal: AbortSignal) {
		this.#isPerformingSearch = true;
		this.#renderStatus();

		const pagefind = await this.#getOrWaitForPagefind();
		signal.throwIfAborted();

		const { results, filters: newFilters } = await pagefind.search(query, { filters });
		signal.throwIfAborted();

		if (Object.keys(newFilters).length > 0) this.#pagefindFilters.available = newFilters;

		this.#setPagefindResults(results);
		await this.#transformPagefindResults();
		signal.throwIfAborted();

		this.#isPerformingSearch = false;

		this.#render(true);
	}

	/** Reset results and render the component with no results. */
	#clearPagefindResults() {
		this.#setPagefindResults([]);
		this.#render(true);
	}

	/** Set the results of a search, clearing the previous selection and results. */
	#setPagefindResults(results: PagefindSearchResult[]) {
		this.#selectedResult = null;
		this.#starlightPagefindResults = [];
		this.#pagefindResults = results;
	}

	/**
	 * Transform multiple `PagefindSearchResult` into `StarlightPagefindSearchResult` which are ready
	 * to be rendered by the Starlight Pagefind component and contain all the necessary data.
	 * Only results that have not been rendered yet and results that should be rendered on the next
	 * page are transformed.
	 *
	 * This approach is different from the original Pagefind UI which loads the data for each
	 * result in the component rendering a result when it is needed. Such approach can lead to
	 * results with data being intertwined with results still loading their data, which can be
	 * confusing, especially on slow machines or connections.
	 * The approach used here still follows the Pagefind recommendation of not loading all results at
	 * once, but instead loads a limited number of results at a time, and only when data for all of
	 * them is ready, they are rendered at once.
	 */
	async #transformPagefindResults() {
		this.#starlightPagefindResults.push(
			...(await Promise.all(
				this.#pagefindResults
					// Only transform results that have not been rendered yet and that should be rendered on
					// the next page.
					.slice(
						this.#starlightPagefindResults.length,
						this.#starlightPagefindResults.length + starlightPagefindConfig.resultsPerPage
					)
					.map(this.#transformPagefindResult)
			))
		);
	}

	/**
	 * Transform a single `PagefindSearchResult` into a `StarlightPagefindSearchResult` ready to be
	 * rendered by the Starlight Pagefind component and containing all the necessary data.
	 * Sub-results are also transformed so they can be rendered as well.
	 * @see {@link StarlightPagefind.#transformPagefindResults} for more details.
	 */
	#transformPagefindResult = async (
		pagefindResult: PagefindSearchResult
	): Promise<StarlightPagefindSearchResult> => {
		let data = await pagefindResult.data();

		if (this.#options.processResult) data = this.#options.processResult(data);

		const id = pagefindResult.id;
		const hasRootSubResult = data.sub_results.at(0)?.url === (data.meta?.url || data.url);

		const result: StarlightPagefindSearchResult = {
			id,
			isSubResult: false,
			href: data.meta.url || data.url,
			meta: Object.entries(data.meta).filter(([key]) => !starlightPagefindConfig.skipMeta.has(key)),
			subResults: this.#getPagefindSubResults(
				id,
				hasRootSubResult ? data.sub_results.slice(1) : data.sub_results
			),
			title: data.meta.title || '',
		};

		if (hasRootSubResult) result.excerpt = data.excerpt;

		return result;
	};

	/**
	 * Returns the sorted sub-results for a given result ID, limited to
	 * {@link starlightPagefindConfig.subResultsPerResult}.
	 *
	 * @see {@link https://github.com/Pagefind/pagefind/blob/d7d0b3a0f0eb12661cd2eb894ad02f10687a4ca0/pagefind_ui/default/svelte/result_with_subs.svelte#L13-L24 | original implementation}
	 */
	#getPagefindSubResults(resultId: string, subResults: PagefindSubResult[]) {
		return subResults
			.toSorted((a, b) => b.locations.length - a.locations.length)
			.slice(0, starlightPagefindConfig.subResultsPerResult)
			.map((subResult, index) => {
				return {
					excerpt: subResult.excerpt,
					href: subResult.url,
					id: `${resultId}-${index}`,
					isSubResult: true,
					meta: [],
					title: subResult.title,
				};
			});
	}

	/* ------ Starlight Pagefind results ------ */

	/** Update the selected result based on s specified type of selection change. */
	#updateSelectedResult(type: 'first' | 'prev' | 'next') {
		switch (type) {
			case 'prev':
			case 'next': {
				if (!this.#selectedResult) {
					this.#selectedResult =
						type === 'prev' ? this.#results.item(this.#results.length - 1) : this.#results.item(0);
					break;
				}

				const currentIndex = Array.from(this.#results).findIndex(
					(result) => result.resultId === this.#selectedResult?.resultId
				);

				let newIndex = currentIndex + (type === 'prev' ? -1 : 1);
				if (type === 'prev' && newIndex < 0) newIndex = this.#results.length - 1;
				else if (type === 'next' && newIndex >= this.#results.length) newIndex = 0;

				this.#selectedResult = this.#results.item(newIndex);
				break;
			}
			// Select the first result by default.
			default: {
				this.#selectedResult = this.#results.item(0);
				break;
			}
		}

		this.#renderSelection();
	}

	/** A collection of all rendered root results, excluding sub-results. */
	get #rootResults() {
		return this.#listbox.querySelectorAll<StarlightPagefindResult>(
			'starlight-pagefind-result[data-sl-pagefind-root-result]'
		);
	}

	/** A collection of all rendered results, including sub-results. */
	get #results() {
		return this.#listbox.querySelectorAll<StarlightPagefindResult>('starlight-pagefind-result');
	}

	/**
	 * Append a result to the listbox, creating a new `starlight-pagefind-result` element.
	 * This can be a root result or a sub-result.
	 */
	#appendResult(starlightPagefindResult: StarlightPagefindSearchResult) {
		const [node, result] = this.#cloneComponentTemplate<StarlightPagefindResult>(
			this.#resultTemplate,
			'starlight-pagefind-result'
		);

		this.#listbox.appendChild(node);
		result.pagefindResult = starlightPagefindResult;
	}

	/**
	 * Append metadatas to the listbox, creating a new `starlight-pagefind-meta` element.
	 */
	#appendMeta(starlightPagefindResultMeta: StarlightPagefindSearchResult['meta']) {
		const [node, meta] = this.#cloneComponentTemplate<StarlightPagefindMeta>(
			this.#metaTemplate,
			'starlight-pagefind-meta'
		);

		this.#listbox.appendChild(node);
		meta.pagefindMeta = starlightPagefindResultMeta;
	}

	/* --------------- Rendering -------------- */

	/**
	 * Really basic i18n function matching i18next's interpolation syntax with support for plurals.
	 *
	 * @see {@link https://www.i18next.com/translation-function/interpolation}
	 * @see {@link https://www.i18next.com/translation-function/plurals}
	 */
	#t(
		key: keyof NonNullable<StarlightPagefindOptions['translations']>,
		interpolations?: Record<string, string | number>
	): string {
		let result = this.#options.translations?.[key] ?? key;
		if (interpolations) {
			for (const [name, value] of Object.entries(interpolations)) {
				if (typeof value === 'number') {
					// Only the `zero`, `one`, and `other` forms are supported which match the original
					// Pagefind UI implementation. Based on feedback, we can add more forms later if needed.
					const suffix = value === 1 ? 'one' : value === 0 ? 'zero' : 'other';
					const { [name]: omittedName, ...rest } = interpolations;
					return this.#t(`${key}_${suffix}`, {
						...rest,
						[name]: this.#numberFormatter.format(value),
					});
				} else {
					result = result.replace(new RegExp(`{{${name}}}`, 'g'), value);
				}
			}
		}
		return result;
	}

	/** Clone a Starlight Pagefind component template and return the cloned node and the component itself. */
	#cloneComponentTemplate<T extends HTMLElement>(
		template: HTMLTemplateElement,
		conponent: `starlight-pagefind-${string}`
	): [DocumentFragment, T] {
		const node = template.content.cloneNode(true) as DocumentFragment;
		const component = node.querySelector<T>(conponent)!;
		return [node, component];
	}

	/** Render the entire component, optionally clearing the listbox for new searches. */
	#render(isNewSearch = false) {
		if (isNewSearch) this.#listbox.textContent = '';

		this.#renderStatus();
		this.#renderFilters();
		this.#renderResults();
		this.#renderShowMoreButton();
	}

	/** Render a status message based on the current state of the search. */
	#renderStatus() {
		if (!this.#queryInput.value) {
			this.#status.textContent = '';
			return;
		} else if (this.#isPerformingSearch) {
			this.#status.textContent = this.#t('search.pagefind.client.searching', {
				query: this.#queryInput.value,
			});
			return;
		}

		this.#status.textContent = this.#t('search.pagefind.client.results', {
			count: this.#pagefindResults.length,
			query: this.#queryInput.value,
		});
	}

	/** Render the filters UI based on the available filters and the selected ones. */
	#renderFilters() {
		const filters = Object.entries(this.#pagefindFilters.available);

		if (filters.length === 0 || !this.#queryInput.value) {
			this.#filters.classList.add('sl-hidden');
			return;
		}

		const focusedValue = Array.from(this.#filters.querySelectorAll('input')).findIndex(
			(input) => input === document.activeElement
		);

		const legend = this.#filters.firstElementChild!;
		this.#filters.textContent = '';
		this.#filters.appendChild(legend);

		for (const [name, values] of filters) {
			const [node, filter] = this.#cloneComponentTemplate<StarlightPagefindFilter>(
				this.#filterTemplate,
				'starlight-pagefind-filter'
			);

			this.#filters.appendChild(node);
			filter.pagefindFilter = {
				name,
				values,
				selectedValues: this.#pagefindFilters.selected[name] ?? [],
				// Open by default if there is only one filter or if the filter was previously opened.
				defaultOpen: filters.length === 1 || (this.#pagefindFilters.opened[name] ?? false),
				onToggleOpen: (opened) => {
					this.#pagefindFilters.opened[name] = opened;
				},
			};
		}

		this.#filters.classList.remove('sl-hidden');

		if (focusedValue !== -1) {
			this.#filters.querySelectorAll('input')[focusedValue]?.focus();
		}
	}

	/** Render results which are not already rendered. */
	#renderResults() {
		// Skip root results that have already been rendered.
		for (let i = this.#rootResults.length; i < this.#starlightPagefindResults.length; i++) {
			const pagefindResult = this.#starlightPagefindResults[i]!;
			this.#renderRootResult(pagefindResult);
		}

		this.#queryInput.setAttribute(
			'aria-expanded',
			String(this.#starlightPagefindResults.length > 0)
		);
	}

	/** Render a root result, which may or may also render sub-results. */
	async #renderRootResult(starlightPagefindResult: StarlightPagefindSearchResult) {
		this.#appendResult(starlightPagefindResult);

		if (!starlightPagefindResult.subResults) return;

		for (const subResult of starlightPagefindResult.subResults) {
			this.#appendResult(subResult);
		}

		if (starlightPagefindResult.meta.length > 0) {
			this.#appendMeta(starlightPagefindResult.meta);
		}
	}

	/** Render the "Show More" button if there are more results to show. */
	#renderShowMoreButton() {
		if (this.#pagefindResults.length > this.#starlightPagefindResults.length) {
			this.#showMoreButton.classList.remove('sl-hidden');
		} else {
			this.#showMoreButton.classList.add('sl-hidden');
		}
	}

	/**
	 * Render the selection based on the currently selected result, and optionally scroll it into
	 * view.
	 */
	#renderSelection() {
		for (const result of this.#results) {
			result.selected = result.resultId === this.#selectedResult?.resultId;
		}

		if (!this.#selectedResult) {
			this.#queryInput.removeAttribute('aria-activedescendant');
			return;
		}

		this.#queryInput.setAttribute('aria-activedescendant', this.#selectedResult.resultId);

		this.#scrollSelectionIntoView();
	}

	/** Render the button to clear the query input if there is a value in it. */
	#renderClearButton() {
		if (this.#queryInput.value) {
			this.#clearButton.classList.remove('sl-hidden');
			this.#clearButton.classList.add('sl-flex');
		} else {
			this.#clearButton.classList.add('sl-hidden');
			this.#clearButton.classList.remove('sl-flex');
		}
	}

	/* --------------- Selection -------------- */

	/**
	 * Open the currently selected result, if any.
	 * This is usually triggered when accepting a combobox result selection, e.g. by pressing the
	 * Enter key when the combobox input is focused.
	 * Clicking on the result itself will not trigger this method, as results are links.
	 */
	#openSelection() {
		if (!this.#selectedResult) return;
		this.#selectedResult.querySelector('a')?.click();
	}

	/** Scroll the currently selected result into view if it is not already visible. */
	#scrollSelectionIntoView() {
		if (!this.#selectedResult) return;

		const scrollable = this.#dialog.querySelector('.sl-pagefind-content')!;

		const selectionRect = this.#selectedResult.getBoundingClientRect();
		const scrollableRect = scrollable.getBoundingClientRect();

		const isSelectionVisible =
			selectionRect.top >= scrollableRect.top && selectionRect.bottom <= scrollableRect.bottom;

		if (isSelectionVisible) return;

		let newScrollTop = scrollable.scrollTop;
		const scrollOffset = 16; // 1rem

		if (selectionRect.top < scrollableRect.top) {
			// Element above the visible area → scrolling up
			newScrollTop += selectionRect.top - scrollableRect.top - scrollOffset;
		} else if (selectionRect.bottom > scrollableRect.bottom) {
			// Element below the visible area → scrolling down
			newScrollTop += selectionRect.bottom - scrollableRect.bottom + scrollOffset;
		}

		scrollable.scrollTo({
			top: newScrollTop,
			behavior: this.#prefersReducedMotion.matches ? 'instant' : 'smooth',
		});
	}

	/* -------------- Public API -------------- */

	/** Set Pagefind selected filters. */
	async triggerFilters(filters: PagefindSearchFragment['filters']) {
		const selected: PagefindFilters['selected'] = {};

		for (const [name, values] of Object.entries(filters)) {
			for (const value of values) {
				selected[name] ??= [];
				selected[name].push(value);
			}
		}

		this.#pagefindFilters.selected = selected;
	}
}

customElements.define('starlight-pagefind', StarlightPagefind);

/** Options specific to the Starlight Pagefind component. */
export type StarlightPagefindOptions = Pick<PagefindConfig, 'mergeIndex'> & {
	/**
	 * The Pagefind bundle directory path.
	 * @see {@link https://pagefind.app/docs/ui/#bundle-path | the Pagefind documentation} for more
	 * details.
	 */
	bundlePath?: string;
	/**
	 * A function to process results before they are rendered.
	 * @see {@link https://pagefind.app/docs/ui/#process-result | the Pagefind documentation} for more
	 * details.
	 */
	processResult?: (result: PagefindSearchFragment) => PagefindSearchFragment;
	/** Translations for the Starlight Pagefind client UI. */
	translations?: Record<`search.pagefind.client.${string}`, string>;
};

/** Pagefind specific options that can be overridden in Starlight. */
type PagefindOptions = Partial<Omit<PagefindConfig, 'mergeIndex'>> &
	Pick<PagefindIndexOptions, 'baseUrl'>;

/**
 * A result ready to be rendered by the Starlight Pagefind component and containing all the
 * necessary data.
 * Sub-results are also included so they can be rendered as well.
 * @see {@link StarlightPagefind.#transformPagefindResults} for more details.
 */
export interface StarlightPagefindSearchResult {
	excerpt?: string;
	href: string;
	id: string;
	isSubResult: boolean;
	meta: [key: string, value: string][];
	subResults?: StarlightPagefindSearchResult[];
	title: string;
}

/** Various Pagefind filters which can be used to filter search results. */
export interface PagefindFilters {
	initial: PagefindFilterCounts;
	available: PagefindFilterCounts;
	opened: Record<string, boolean>;
	selected: PagefindSearchFragment['filters'];
}
