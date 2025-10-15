import type { StarlightPagefindSearchResult } from './starlight-pagefind';

/**
 * Component rendering a single Pagefind search result with potential sub-results.
 *
 * @see {@link https://github.com/Pagefind/pagefind/blob/d7d0b3a0f0eb12661cd2eb894ad02f10687a4ca0/pagefind_ui/default/svelte/result_with_subs.svelte}
 */
export class StarlightPagefindResult extends HTMLElement {
	/** Starlight Pagefind search result ready to be rendered. */
	#searchResult?: StarlightPagefindSearchResult;

	/** Various references to elements commonly used in this component. */
	#link = this.querySelector('a')!;

	/** Set the Starlight Pagefind search result and render it. */
	set pagefindResult(pagefindResult: StarlightPagefindSearchResult) {
		this.#searchResult = pagefindResult;

		this.#render();
	}

	/** Get the Pagefind ID of a search result. */
	get resultId() {
		if (!this.#searchResult) {
			throw new Error('Trying to access the pagefind ID of a result that has not been set yet.');
		}

		return this.#searchResult?.id;
	}

	/** Mark this result as selected, e.g. when navigating with the keyboard. */
	set selected(selected: boolean) {
		if (!selected) {
			this.#link.removeAttribute('aria-selected');
			return;
		}

		this.#link.setAttribute('aria-selected', 'true');
	}

	/** Render the search result. */
	#render() {
		if (!this.#searchResult) throw new Error('Trying to render a search result that is not set.');

		if (this.#searchResult.isSubResult) this.dataset.slPagefindSubResult = 'true';
		else this.dataset.slPagefindRootResult = 'true';

		this.#link.id = this.#searchResult.id;
		this.#link.href = this.#searchResult.href;

		this.#link.querySelector('.sl-pagefind-result-title')!.textContent = this.#searchResult.title;

		if (this.#searchResult.excerpt) {
			this.#link.querySelector('.sl-pagefind-result-excerpt')!.innerHTML =
				this.#searchResult.excerpt;
		}
	}
}

customElements.define('starlight-pagefind-result', StarlightPagefindResult);
