import type { StarlightPagefindSearchResult } from './starlight-pagefind';

/** Component rendering metadata of a Pagefind search result. */
export class StarlightPagefindMeta extends HTMLElement {
	/** Search result metadata to render. */
	#meta: StarlightPagefindSearchResult['meta'] = [];

	/** Various references to elements commonly used in this component. */
	#listitem = this.querySelector('li')!;

	/** Set the Pagefind metadata and render them. */
	set pagefindMeta(pagefindMeta: StarlightPagefindSearchResult['meta']) {
		this.#meta = pagefindMeta;

		this.#render();
	}

	/** Render the metadata of a search result. */
	#render() {
		for (const [key, value] of this.#meta) {
			const div = document.createElement('div');
			div.textContent = `${key}: ${value}`;
			this.#listitem.appendChild(div);
		}
	}
}

customElements.define('starlight-pagefind-meta', StarlightPagefindMeta);
