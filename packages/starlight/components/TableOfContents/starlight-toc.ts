export class StarlightTOC extends HTMLElement {
  private _current = this.querySelector(
    'a[aria-current="true"]'
  ) as HTMLAnchorElement | null;
  private minH = parseInt(this.dataset.minH || '2', 10);
  private maxH = parseInt(this.dataset.maxH || '3', 10);

  protected set current(link: HTMLAnchorElement) {
    if (link === this._current) return;
    if (this._current) this._current.removeAttribute('aria-current');
    link.setAttribute('aria-current', 'true');
    this._current = link;
  }

  constructor({ smallViewport = false } = {}) {
    super();

    /** All the links in the table of contents. */
    const links = [...this.querySelectorAll('a')];

    /** Test if an element is a table-of-contents heading. */
    const isHeading = (el: Element): el is HTMLHeadingElement => {
      if (el instanceof HTMLHeadingElement) {
        // Special case for page title h1
        if (el.id === 'starlight__overview') return true;
        // Check the heading level is within the user-configured limits for the ToC
        const level = el.tagName[1];
        if (level) {
          const int = parseInt(level, 10);
          if (int >= this.minH && int <= this.maxH) return true;
        }
      }
      return false;
    };

    /** Walk up the DOM to find the nearest heading. */
    const getElementHeading = (
      el: Element | null
    ): HTMLHeadingElement | null => {
      if (!el) return null;
      const origin = el;
      while (el) {
        if (isHeading(el)) return el;
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
        const link = links.find((link) => link.hash === '#' + heading.id);
        if (link) {
          this.current = link;
          break;
        }
      }
    };

    // Observe elements with an `id` (most likely headings) and their siblings.
    // Also observe direct children of `.content` to include elements before
    // the first heading.
    const toObserve = document.querySelectorAll(
      'main [id], main [id] ~ *, main .content > *'
    );
    /** Start intersections at nav height + 2rem padding. */
    const top = (smallViewport ? 104 : 64) + 32;
    /** End intersections 1.5rem later. */
    const bottom = top + 24;

    let observer: IntersectionObserver | undefined;
    function observe() {
      if (observer) observer.disconnect();
      const height = document.documentElement.clientHeight;
      const rootMargin = `-${top}px 0% ${bottom - height}px`;
      observer = new IntersectionObserver(setCurrent, { rootMargin });
      toObserve.forEach((h) => observer!.observe(h));
    }
    observe();

    const onIdle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
    let timeout: NodeJS.Timeout;
    window.addEventListener('resize', () => {
      // Disable intersection observer while window is resizing.
      if (observer) observer.disconnect();
      clearTimeout(timeout);
      timeout = setTimeout(() => onIdle(observe), 200);
    });
  }
}

customElements.define('starlight-toc', StarlightTOC);
