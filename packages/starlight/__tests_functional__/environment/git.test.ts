import { expect } from 'vitest';
import { longTest, makeTestProject } from '../test-e2e-utils';
import starlight from '../../index';
import * as cheerio from 'cheerio';

longTest('include last updated date from git in the footer', async () => {
	const project = makeTestProject({
		config: {
			integrations: [
				starlight({
					title: 'Test Docs',
					lastUpdated: true,
				}),
			],
		},
	});

	project.writeFile(
		'src/content/docs/index.md',
		`---
title: Home Page
---

Home page content
`
	);
	project.commitAllChanges('Add home page', '2024-02-03');

	await project.build();
	await project.preview();

	const response = await project.fetch('/');
	const $ = cheerio.load(await response.text());

	expect($('footer').text()).toContain('Last updated: Feb 3, 2024');
});
