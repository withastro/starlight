// @ts-check

// This script fetches the latest Starlight stats from various APIs and updates the
// `src/content/stats.json` file accordingly.
// https://github.com/withastro/astro.build/blob/9dd646289b87e0298ac4f513a0aef98f5a8260b8/scripts/update-stats.mjs

import { writeFile } from 'node:fs/promises';
import { z } from 'astro/zod';
import data from '../src/content/stats.json' with { type: 'json' };

console.log('‣ Fetching latest stats...');

// Fetch the latest Starlight download stats from the NPM registry.
const npm = z
	.object({ downloads: z.number() })
	.parse(
		await fetch('https://api.npmjs.org/downloads/point/last-month/@astrojs/starlight').then((res) =>
			res.json()
		)
	);
console.log(`✔︎ npm downloads: ${npm.downloads}`);

// Fetch the latest Starlight GitHub stars count from the GitHub API.
const repo = z
	.object({ contributors_url: z.string(), stargazers_count: z.number() })
	.parse(await fetch('https://api.github.com/repos/withastro/starlight').then((res) => res.json()));
console.log(`✔︎ GitHub stars: ${repo.stargazers_count}`);

// Fetch the latest Starlight GitHub contributor count from the GitHub API.
const contributors = z.coerce.number().parse(
	await fetch(`${repo.contributors_url}?per_page=1`).then(
		// <https://api.github.com/repositories/614933136/contributors?per_page=1&page=322>; rel="last"
		(res) => res.headers.get('link')?.match(/[?&]page=(?<page>\d+)>; rel="last"/)?.groups?.page
	)
);
console.log(`✔︎ GitHub contributors: ${contributors}`);

// https://github.com/HTTPArchive/tech-report-apis/blob/main/apps/report-api/README.md#get-cwv-core-web-vitals
const httpArchive = z
	.array(
		z.object({
			vitals: z.array(
				z.object({
					name: z.string(),
					mobile: z.object({ good_number: z.number(), tested: z.number() }),
				})
			),
		})
	)
	.parse(
		await fetch(
			'https://cdn.httparchive.org/v1/cwv?technology=Starlight&geo=ALL&rank=ALL&start=latest'
		).then((res) => res.json())
	);

const overall = httpArchive[0]?.vitals.find(({ name }) => name === 'overall');
if (!overall || overall.mobile.tested <= 0) throw new Error('Missing Core Web Vitals data.');
const coreWebVitals = overall.mobile.good_number / overall.mobile.tested;
console.log(
	`✔︎ Core Web Vitals: ${Math.floor((overall.mobile.good_number / overall.mobile.tested) * 100)}%`
);

// Update dynamic stats data.
data.downloads = npm.downloads;
data.stars = repo.stargazers_count;
data.contributors = contributors;
data.cwv = coreWebVitals;
data.lastUpdated = new Date().toISOString();

// Note that we are not updating the carbon rating automatically as the Website Carbon API
// (https://api.websitecarbon.com/) no longer offer public access to the site endpoint. As this is
// a value that is unlikely to change often, we will update it manually in `src/content/stats.json`.

// Write updated stats back to `src/content/stats.json`.
console.log('‣ Writing updated stats to src/content/stats.json...');
await writeFile('src/content/stats.json', `${JSON.stringify(data, null, '\t')}\n`);
console.log('✔︎ Stats updated successfully!');
