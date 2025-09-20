import type { PagefindFilters } from './starlight-pagefind';
import type { PagefindFilterCounts } from './starlight-pagefind-js';

/**
 * Component rendering a Pagefind filter with its known values.
 *
 * @see {@link https://github.com/Pagefind/pagefind/blob/d7d0b3a0f0eb12661cd2eb894ad02f10687a4ca0/pagefind_ui/default/svelte/filters.svelte}
 */
export class StarlightPagefindFilter extends HTMLElement {
	/** Pagefind filter details. */
	#name?: string;
	#values: PagefindFilterCounts[string] = {};
	#selectedValues: PagefindFilters['selected'][string] = [];
	#defaultOpen?: boolean;
	#onToggleOpen?: (opened: boolean) => void;
	#showEmptyValues?: boolean;

	/** Various references to elements commonly used in this component. */
	#details = this.querySelector('details')!;
	#summary = this.querySelector('summary')!;

	/** Callback called when the component is added to the document. */
	connectedCallback() {
		this.#details.addEventListener('toggle', this.#onDetailsToggle);
	}

	/** Set the Pagefind filter and render it. */
	set pagefindFilter(filter: {
		name: string;
		values: PagefindFilterCounts[string];
		selectedValues: PagefindFilters['selected'][string];
		defaultOpen?: boolean;
		onToggleOpen: (opened: boolean) => void;
		showEmptyValues: boolean;
	}) {
		this.#name = filter.name;
		this.#values = filter.values;
		this.#selectedValues = filter.selectedValues;
		this.#defaultOpen = filter.defaultOpen ?? false;
		this.#onToggleOpen = filter.onToggleOpen;
		this.#showEmptyValues = filter.showEmptyValues;

		this.#render();
	}

	/** Callback called when the details element is toggled. */
	#onDetailsToggle = () => {
		this.#onToggleOpen?.(this.#details.open);
	};

	/** Render a filter with all its values. */
	#render() {
		if (!this.#name) throw new Error('Trying to render a filter without a name.');

		this.#summary.textContent =
			this.#name.charAt(0).toLocaleUpperCase(document.documentElement.lang || 'en') +
			this.#name.slice(1);

		if (this.#defaultOpen) {
			this.#details.setAttribute('open', '');
		}

		for (const [value, count] of Object.entries(this.#values)) {
			if (!this.#showEmptyValues && count === 0) continue;

			const container = document.createElement('div');

			const input = document.createElement('input');
			input.type = 'checkbox';
			input.id = `${this.#name}-${value}`;
			input.name = this.#name;
			input.value = value;
			input.checked = this.#selectedValues.includes(value);
			input.dataset.slPagefindFilterName = this.#name;
			input.dataset.slPagefindFilterValue = value;
			container.appendChild(input);

			const label = document.createElement('label');
			label.setAttribute('for', input.id);
			label.textContent = `${value} (${count})`;
			container.appendChild(label);

			this.#details.appendChild(container);
		}
	}
}

customElements.define('starlight-pagefind-filter', StarlightPagefindFilter);
