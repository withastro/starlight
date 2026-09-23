import { readFileSync } from 'node:fs';
import { html, type Locale, type LunariaConfig, type LunariaStatus } from '@lunariajs/core';
import { StatusByFile } from '@lunariajs/core/components';
import { defineConfig } from '@lunariajs/core/config';

export const locales = [
	{ label: 'Dansk', lang: 'da' },
	{ label: 'Deutsch', lang: 'de' },
	{ label: 'Español', lang: 'es' },
	{ label: 'فارسی', lang: 'fa' },
	{ label: 'Français', lang: 'fr' },
	{ label: 'हिंदी', lang: 'hi' },
	{ label: 'Bahasa Indonesia', lang: 'id' },
	{ label: 'Italiano', lang: 'it' },
	{ label: '日本語', lang: 'ja' },
	{ label: '한국어', lang: 'ko' },
	{ label: 'Português do Brasil', lang: 'pt-br' },
	{ label: 'Português', lang: 'pt-pt' },
	{ label: 'Русский', lang: 'ru' },
	{ label: 'Türkçe', lang: 'tr' },
	{ label: 'Українська', lang: 'uk' },
	{ label: '简体中文', lang: 'zh-cn' },
] satisfies [Locale, ...Locale[]];

export default defineConfig({
	repository: {
		name: 'withastro/starlight',
		rootDir: 'docs',
	},
	sourceLocale: {
		label: 'English',
		lang: 'en',
	},
	locales,
	files: [
		{
			include: ['src/content/docs/**/*.{md,mdx}'],
			exclude: locales.map((locale) => `src/content/docs/${locale.lang}/**`),
			pattern: {
				source: 'src/content/docs/@path',
				locales: 'src/content/docs/@lang/@path',
			},
			type: 'universal',
		},
	],
	tracking: {
		ignoredKeywords: [
			'lunaria-ignore',
			'typo',
			'en-only',
			'broken link',
			'i18nReady',
			'i18nIgnore',
		],
	},
	dashboard: {
		title: 'Starlight Docs Translation Status',
		description:
			'Translation progress tracker for the Starlight Docs site. See how much has been translated in your language and get involved!',
		site: 'https://i18n.starlight.astro.build/',
		basesToHide: ['src/content/docs/'],
		customCss: ['./lunaria/styles.css'],
		favicon: {
			external: [{ link: 'https://starlight.astro.build/favicon.svg', type: 'image/svg+xml' }],
		},
		ui: {
			'statusByLocale.heading': 'Translation progress by locale',
			'statusByLocale.incompleteLocalizationLink': 'incomplete translation',
			'statusByLocale.outdatedLocalizationLink': 'outdated translation',
			'statusByLocale.completeLocalization': 'This translation is complete, amazing job! 🎉',
			'statusByFile.heading': 'Translation status by file',
		},
	},
	renderer: {
		overrides: {
			statusByFile: (config, status) => StatusByFile(config, status) + Freshness(config, status),
		},
		slots: {
			head: () => html`
				<script type="module">
					${readFileSync(new URL('./lunaria/freshness.mjs', import.meta.url), 'utf8')};
				</script>
			`,
			afterTitle: () => html`
				<p>
					If you're interested in helping us translate
					<a href="https://starlight.astro.build/">starlight.astro.build</a> into one of the
					languages listed below, you've come to the right place! This auto-updating page always
					lists all the content that could use your help right now.
				</p>
				<p>
					Before starting a new translation, please read our
					<a
						href="https://github.com/withastro/starlight/blob/main/CONTRIBUTING.md#translating-starlights-docs"
						>translation guide</a
					>
					to learn about our translation process and how you can get involved.
				</p>
			`,
		},
	},
});

const Freshness = (config: LunariaConfig, status: LunariaStatus) => {
	const { name, branch, rootDir } = config.repository;

	const data = {
		locales: config.locales.map(({ lang, label }) => ({
			lang,
			label,
			files: status
				.flatMap((entry) => {
					const translation = entry.localizations.find((translation) => translation.lang === lang);
					if (!translation || translation.status === 'missing') return [];

					const base = config.dashboard.basesToHide?.find(
						(base) => base !== '' && entry.source.path.includes(base)
					);

					const updatedAt = translation.git.latestTrackedCommit.date.getTime();
					const sourceUpdatedAt = entry.source.git.latestTrackedCommit.date.getTime();

					return [
						{
							path: entry.source.path.replace(base ?? '', ''),
							url: `https://github.com/${name}/blob/${branch}/${rootDir}/${translation.path}`,
							isOutdated: translation.status === 'outdated',
							updatedAt,
							sourceUpdatedAt,
						},
					];
				})
				.sort((a, b) => a.updatedAt - b.updatedAt || a.path.localeCompare(b.path)),
		})),
	};

	return html`
		<translation-freshness>
			<script type="application/json">
				${JSON.stringify(data)}
			</script>
			<h2 id="freshness">
				<a href="#freshness">Translation freshness</a>
			</h2>
			<form>
				<p>
					<label for="freshness-old-update-age">Old translation threshold (months)</label>
					<input
						id="freshness-old-update-age"
						aria-describedby="freshness-old-update-age-desc"
						type="number"
						min="1"
						max="120"
						step="1"
						value="12"
						name="oldUpdateAge"
						required
					/>
					<small id="freshness-old-update-age-desc">
						Show locales with outdated translations last updated more than this many months ago.
					</small>
				</p>
				<p>
					<label for="freshness-recent-update-age">Recent activity window (months)</label>
					<input
						id="freshness-recent-update-age"
						aria-describedby="freshness-recent-update-age-desc"
						type="number"
						min="1"
						max="120"
						step="1"
						value="3"
						name="recentUpdateAge"
						required
					/>
					<small id="freshness-recent-update-age-desc">
						Show how many translation files were updated within this many months.
					</small>
				</p>
				<button type="submit">Compute freshness</button>
			</form>
			<p id="freshness-status" role="status"></p>
			<div id="freshness-results" hidden>
				<div id="freshness-overview">
					<ul class="freshness-legend">
						<li>
							<span class="freshness-up-to-date" aria-hidden="true"></span>
							Up to date
						</li>
						<li>
							<span class="freshness-outdated-within" aria-hidden="true"></span>
							<span id="freshness-outdated-within-label"></span>
						</li>
						<li>
							<span class="freshness-outdated-beyond" aria-hidden="true"></span>
							<span id="freshness-outdated-beyond-label"></span>
						</li>
						<li>
							<span class="freshness-recent" aria-hidden="true"></span>
							<span id="freshness-recent-label"></span>
						</li>
					</ul>
					<div class="freshness-chart-header" aria-hidden="true">
						<span>Locale</span>
						<span>Translation status</span>
					</div>
					<ul class="freshness-chart-rows"></ul>
				</div>
				<div id="freshness-details"></div>
			</div>
			<template id="freshness-locale-template">
				<h3></h3>
				<table data-outdated-files>
					<thead>
						<tr>
							<th>Translation</th>
							<th>Last translation update</th>
							<th>Last source update</th>
						</tr>
					</thead>
					<tbody></tbody>
				</table>
			</template>
			<template id="freshness-file-template">
				<tr>
					<th><a data-file></a></th>
					<td>
						<time data-translation-update>
							<span data-relative-date></span>
							<span data-calendar-date></span>
						</time>
					</td>
					<td>
						<time data-source-update>
							<span data-relative-date></span>
							<span data-calendar-date></span>
						</time>
					</td>
				</tr>
			</template>
			<template id="freshness-chart-row-template">
				<li class="freshness-chart-row">
					<div>
						<a data-locale-link></a>
						<p data-chart-coverage></p>
						<p class="sr-only" data-chart-summary></p>
					</div>
					<div>
						<div class="freshness-bar" aria-hidden="true">
							<span class="freshness-up-to-date" data-up-to-date-bar></span>
							<span class="freshness-outdated-within" data-outdated-within-bar></span>
							<span class="freshness-outdated-beyond" data-outdated-beyond-bar></span>
						</div>
						<div class="freshness-bar freshness-activity" aria-hidden="true">
							<span class="freshness-recent" data-activity-bar></span>
							<p data-activity-percentage></p>
						</div>
					</div>
				</li>
			</template>
		</translation-freshness>
	`;
};
