import { defineVitestConfig } from '../test-config';

export default defineVitestConfig({
	title: 'custom ToC config',
	tableOfContents: {
		minHeadingLevel: 1,
		maxHeadingLevel: 4,
	},
});
