import { expect, test } from './test-utils';

test('does not report accessibility violations on the docs site', async ({ docsSite }) => {
	let violationsCount = 0;

	const urls = await docsSite.getAllUrls();

	for (const url of urls) {
		const violations = await docsSite.testPage(url);

		if (violations.length > 0) {
			violationsCount += violations.length;
		}

		await docsSite.reportPageViolations(violations);
	}

	expect(
		violationsCount,
		`Found ${violationsCount} accessibility violations. Check the errors above for more details.`
	).toBe(0);
});
