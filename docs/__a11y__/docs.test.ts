import { expect, getDocsSiteUrls, test } from './test-utils';

const urls = await getDocsSiteUrls();

for (const url of urls) {
	const { pathname } = new URL(url);

	test(`does not report accessibility violations: ${pathname}`, async ({ docsSite }, testInfo) => {
		const violations = await docsSite.testPage(url);

		await docsSite.reportPageViolations(violations, testInfo);

		expect(
			violations,
			`Found ${violations.length} accessibility violations on '${pathname}'. Check the errors above for more details.`
		).toHaveLength(0);
	});
}
