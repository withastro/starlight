/**
 * @typedef {object} TranslationFile
 * @property {string} path
 * @property {string} url
 * @property {boolean} isOutdated
 * @property {number} updatedAt
 * @property {number} sourceUpdatedAt
 */

/**
 * @typedef {object} LocaleData
 * @property {string} lang
 * @property {string} label
 * @property {TranslationFile[]} files
 */

/**
 * @typedef {object} LocaleFreshness
 * @property {string} lang
 * @property {string} label
 * @property {TranslationFile[]} outdatedFiles
 * @property {number} oldOutdatedCount
 * @property {number} recentUpdateCount
 * @property {number} translatedCount
 */

class TranslationFreshness extends HTMLElement {
	#dateFormat = new Intl.DateTimeFormat('en', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	});
	#relativeTime = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

	constructor() {
		super();

		this.addEventListener('submit', (event) => {
			if (!(event.target instanceof HTMLFormElement)) return;
			event.preventDefault();

			const values = new FormData(event.target);
			const oldUpdateAge = Number(values.get('oldUpdateAge'));
			const recentUpdateAge = Number(values.get('recentUpdateAge'));

			const script = this.#getElement('script[type="application/json"]');
			if (!(script instanceof HTMLScriptElement)) throw new Error('Missing data script.');

			/** @type {{ locales: LocaleData[] }} */
			const data = JSON.parse(script.text);

			const freshness = this.#computeFreshness(data.locales, oldUpdateAge, recentUpdateAge);

			this.#renderFreshness(freshness, oldUpdateAge, recentUpdateAge);
		});
	}

	/**
	 * @param {LocaleData[]} locales
	 * @param {number} oldUpdateAge
	 * @param {number} recentUpdateAge
	 * @returns {LocaleFreshness[]}
	 */
	#computeFreshness(locales, oldUpdateAge, recentUpdateAge) {
		const now = new Date();

		const oldUpdateThreshold = this.#getTimestampMonthsAgo(now, oldUpdateAge);
		const recentUpdateThreshold = this.#getTimestampMonthsAgo(now, recentUpdateAge);

		return locales
			.map(({ files, label, lang }) => {
				const outdatedFiles = files.filter((file) => file.isOutdated);

				return {
					lang,
					label,
					outdatedFiles,
					oldOutdatedCount: outdatedFiles.filter((file) => file.updatedAt < oldUpdateThreshold)
						.length,
					recentUpdateCount: files.filter(
						(file) => file.updatedAt >= recentUpdateThreshold && file.updatedAt <= now.getTime()
					).length,
					translatedCount: files.length,
				};
			})
			.filter((locale) => locale.oldOutdatedCount > 0);
	}

	/**
	 * @param {LocaleFreshness[]} locales
	 * @param {number} oldUpdateAge
	 * @param {number} recentUpdateAge
	 */
	#renderFreshness(locales, oldUpdateAge, recentUpdateAge) {
		const fragment = document.createDocumentFragment();
		const template = this.#getElement('#freshness-locale-template');
		if (!(template instanceof HTMLTemplateElement)) throw new Error('Missing locale template.');

		const now = Date.now();

		for (const locale of locales) {
			const content = document.importNode(template.content, true);

			const heading = this.#getElement('h3', content);
			heading.id = `freshness-${locale.lang}`;
			heading.textContent = `${locale.label} (${locale.lang})`;

			this.#renderOutdatedFiles(content, locale, now);

			fragment.append(content);
		}

		this.#renderOverview(locales, oldUpdateAge, recentUpdateAge);

		this.#getElement('#freshness-details').replaceChildren(fragment);
		this.#getElement('#freshness-results').hidden = locales.length === 0;

		const status = this.#getElement('#freshness-status');

		status.classList.toggle('sr-only', locales.length > 0);
		status.textContent =
			locales.length > 0
				? `Showing freshness for ${locales.length} ${this.#pluralize('locale', locales.length)}.`
				: 'No outdated translations match the configured threshold. Try fewer months.';
	}

	/**
	 * @param {LocaleFreshness[]} locales
	 * @param {number} oldUpdateAge
	 * @param {number} recentUpdateAge
	 */
	#renderOverview(locales, oldUpdateAge, recentUpdateAge) {
		const fragment = document.createDocumentFragment();
		const template = this.#getElement('#freshness-chart-row-template');
		if (!(template instanceof HTMLTemplateElement)) throw new Error('Missing chart row template.');

		const oldUnit = this.#pluralize('month', oldUpdateAge);
		const recentUnit = this.#pluralize('month', recentUpdateAge);

		this.#getElement('#freshness-outdated-within-label').textContent =
			`Outdated ≤ ${oldUpdateAge} ${oldUnit}`;
		this.#getElement('#freshness-outdated-beyond-label').textContent =
			`Outdated > ${oldUpdateAge} ${oldUnit}`;
		this.#getElement('#freshness-activity-heading').textContent =
			`Updated in last ${recentUpdateAge} ${recentUnit}`;

		for (const locale of locales) {
			const content = document.importNode(template.content, true);

			const total = locale.translatedCount;
			const outdated = locale.outdatedFiles.length;
			const upToDate = total - outdated;
			const within = outdated - locale.oldOutdatedCount;
			const beyond = locale.oldOutdatedCount;

			this.#getElement('[data-chart-summary]', content).textContent =
				`Up to date: ${upToDate}. ` +
				`Outdated and last updated within ${oldUpdateAge} ${oldUnit}: ${within}. ` +
				`Outdated and last updated more than ${oldUpdateAge} ${oldUnit} ago: ${beyond}. ` +
				`Updated in the last ${recentUpdateAge} ${recentUnit}: ${locale.recentUpdateCount} of ${total}.`;

			const link = this.#getElement('[data-locale-link]', content);
			if (!(link instanceof HTMLAnchorElement)) throw new Error('Missing locale link element.');

			link.textContent = `${locale.label} (${locale.lang})`;
			link.href = `#freshness-${locale.lang}`;

			this.#getElement('[data-chart-coverage]', content).textContent =
				`${total} translated ${this.#pluralize('page', total)}`;

			this.#renderBar(this.#getElement('[data-up-to-date-bar]', content), upToDate, total);
			this.#renderBar(this.#getElement('[data-outdated-within-bar]', content), within, total);
			this.#renderBar(this.#getElement('[data-outdated-beyond-bar]', content), beyond, total);

			this.#getElement('[data-activity-bar]', content).style.width =
				`${(locale.recentUpdateCount / total) * 100}%`;

			this.#getElement('[data-activity-count]', content).textContent = this.#renderCount(
				locale.recentUpdateCount,
				total
			);

			fragment.append(content);
		}

		this.#getElement('.freshness-chart-rows').replaceChildren(fragment);
	}

	/**
	 * @param {DocumentFragment} content
	 * @param {LocaleFreshness} locale
	 * @param {number} now
	 */
	#renderOutdatedFiles(content, locale, now) {
		const table = this.#getElement('[data-outdated-files]', content);
		table.setAttribute('aria-labelledby', `freshness-${locale.lang}`);

		const template = this.#getElement('#freshness-file-template');
		if (!(template instanceof HTMLTemplateElement)) throw new Error('Missing file template.');

		const body = this.#getElement('tbody', table);

		for (const file of locale.outdatedFiles) {
			const row = document.importNode(template.content, true);

			const link = this.#getElement('[data-file]', row);
			if (!(link instanceof HTMLAnchorElement)) throw new Error('Missing file link element.');

			link.textContent = file.path;
			link.href = file.url;

			this.#renderUpdateTime(
				this.#getElement('[data-translation-update]', row),
				file.updatedAt,
				now
			);
			this.#renderUpdateTime(
				this.#getElement('[data-source-update]', row),
				file.sourceUpdatedAt,
				now
			);

			body.append(row);
		}
	}

	/**
	 * @param {HTMLElement} element
	 * @param {number} count
	 * @param {number} total
	 */
	#renderBar(element, count, total) {
		element.style.width = `${(count / total) * 100}%`;
		element.textContent = count === 0 ? '' : String(count);
	}

	/**
	 * @param {number} count
	 * @param {number} total
	 * @returns {string}
	 */
	#renderCount(count, total) {
		const percentage = Math.round((count / total) * 100);

		return `${count} / ${total} (${percentage}%)`;
	}

	/**
	 * @param {HTMLElement} element
	 * @param {number} timestamp
	 * @param {number} now
	 */
	#renderUpdateTime(element, timestamp, now) {
		if (!(element instanceof HTMLTimeElement)) throw new Error('Invalid time element.');

		const date = new Date(timestamp);
		const days = Math.floor(timestamp / 86_400_000) - Math.floor(now / 86_400_000);

		element.dateTime = date.toISOString();
		this.#getElement('[data-relative-date]', element).textContent = this.#relativeTime.format(
			days,
			'day'
		);
		this.#getElement('[data-calendar-date]', element).textContent = this.#dateFormat.format(date);
	}

	/**
	 * @param {Date} now
	 * @param {number} months
	 * @returns {number}
	 */
	#getTimestampMonthsAgo(now, months) {
		const date = new Date(now);
		date.setUTCMonth(date.getUTCMonth() - months);

		// If the day doesn't exist in this month, use the last day of the month.
		if (date.getUTCDate() !== now.getUTCDate()) {
			date.setUTCDate(0);
		}

		return date.getTime();
	}

	/**
	 * @param {string} word
	 * @param {number} count
	 * @returns {string}
	 */
	#pluralize(word, count) {
		return count === 1 ? word : `${word}s`;
	}

	/**
	 * @param {string} selector
	 * @param {ParentNode} [root]
	 * @returns {HTMLElement}
	 */
	#getElement(selector, root = this) {
		const element = root.querySelector(selector);

		if (!(element instanceof HTMLElement)) {
			throw new Error(`Missing or invalid element: '${selector}'.`);
		}

		return element;
	}
}

customElements.define('translation-freshness', TranslationFreshness);
