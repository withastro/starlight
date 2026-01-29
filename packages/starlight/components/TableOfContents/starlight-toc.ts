import { PAGE_TITLE_ID } from '../../constants';

export class StarlightTOC extends HTMLElement {
	private _current = this.querySelector<HTMLAnchorElement>('a[aria-current="true"]');
	private minH = parseInt(this.dataset.minH || '2', 10);
	private maxH = parseInt(this.dataset.maxH || '3', 10);

	/**
	 * CSS selector string that matches only headings that can appear in the table of contents.
	 * Generates a selector like `h1#_top,:where(h2,h3)[id]`.
	 */
	private tocHeadingSelector =
		`h1#${PAGE_TITLE_ID},` +
		`:where(${[...Array.from({ length: 1 + this.maxH - this.minH }).map((_, index) => `h${this.minH + index}`)].join()})[id]`;

	protected set current(link: HTMLAnchorElement) {
		if (link === this._current) return;
		if (this._current) this._current.removeAttribute('aria-current');
		link.setAttribute('aria-current', 'true');
		this._current = link;
	}

	private onIdle = (cb: IdleRequestCallback) =>
		(window.requestIdleCallback || ((cb) => setTimeout(cb, 1)))(cb);

	constructor() {
		super();
		this.onIdle(() => this.init());
	}

	private init = (): void => {
		/** All the links in the table of contents. */
		const links = [...this.querySelectorAll('a')];

		/** Test if an element is a table-of-contents heading. */
		const isHeading = (el: Element): el is HTMLHeadingElement =>
			el.matches(this.tocHeadingSelector);

		/** Walk up the DOM to find the nearest heading. */
		const getElementHeading = (el: Element | null): HTMLHeadingElement | null => {
			if (!el) return null;
			const origin = el;
			while (el) {
				// Short circuit if we reach the top-level content container or one of the other containers in main.
				if (el.matches('.sl-markdown-content, main > *')) {
					return document.getElementById(PAGE_TITLE_ID) as HTMLHeadingElement;
				}
				if (isHeading(el)) return el;
				// Find the first heading that is a child of this element, and return it if there is one.
				const childHeading = el.querySelector<HTMLHeadingElement>(this.tocHeadingSelector);
				if (childHeading) return childHeading;
				// Assign the previous sibling’s last, most deeply nested child to el.
				el = el.previousElementSibling;
				while (el?.lastElementChild) {
					el = el.lastElementChild;
				}
				// Look for headings amongst siblings.
				const h = getElementHeading(el);
				if (h) return h;
			}
			// Walk back up the parent.
			return getElementHeading(origin.parentElement);
		};

		/** Handle intersections and set the current link to the heading for the current intersection. */
		const setCurrent: IntersectionObserverCallback = (entries) => {
			for (const { isIntersecting, target } of entries) {
				if (!isIntersecting) continue;
				const heading = getElementHeading(target);
				if (!heading) continue;
				const link = links.find((link) => link.hash === '#' + encodeURIComponent(heading.id));
				if (link) {
					this.current = link;
					break;
				}
			}
		};

		// Observe the following elements:
		// - headings that appear in the table of contents
		// - siblings of those headings or of the `.sl-heading-wrapper` added by Starlight’s anchor links feature
		// - direct children of `.sl-markdown-content` to include elements before the first subheading
		// - direct children of `main` that don’t include headings (mainly to target Starlight’s banner)
		// Ignore any elements that themselves contain a table-of-contents heading, as we are already observing those children.
		const toObserve = document.querySelectorAll(
			[
				`main :where(${this.tocHeadingSelector})`,
				`main :where(${this.tocHeadingSelector}, .sl-heading-wrapper) ~ *:not(:has(${this.tocHeadingSelector}))`,
				`main .sl-markdown-content > *:not(:has(${this.tocHeadingSelector}))`,
				`main > *:not(:has(${this.tocHeadingSelector}))`,
			].join()
		);

		let observer: IntersectionObserver | undefined;
		const observe = () => {
			if (observer) return;
			observer = new IntersectionObserver(setCurrent, { rootMargin: this.getRootMargin() });
			toObserve.forEach((h) => observer!.observe(h));
		};
		observe();

		let timeout: NodeJS.Timeout;
		window.addEventListener('resize', () => {
			// Disable intersection observer while window is resizing.
			if (observer) {
				observer.disconnect();
				observer = undefined;
			}
			clearTimeout(timeout);
			timeout = setTimeout(() => this.onIdle(observe), 200);
		});
	};

	private getRootMargin(): `-${number}px 0% ${number}px` {
		const navBarHeight = document.querySelector('header')?.getBoundingClientRect().height || 0;
		// `<summary>` only exists in mobile ToC, so will fall back to 0 in large viewport component.
		const mobileTocHeight = this.querySelector('summary')?.getBoundingClientRect().height || 0;
		/** Start intersections at nav height + 2rem padding. */
		const top = navBarHeight + mobileTocHeight + 32;
		/** End intersections `53px` later. This is slightly more than the maximum `margin-top` in Markdown content. */
		const bottom = top + 53;
		const height = document.documentElement.clientHeight;
		return `-${top}px 0% ${bottom - height}px`;
	}
}

customElements.define('starlight-toc', StarlightTOC);
