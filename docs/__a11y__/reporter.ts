import { styleText } from 'node:util';
import type {
	FullResult,
	Reporter,
	TestCase,
	TestError,
	TestResult,
} from '@playwright/test/reporter';
import { DefaultTerminalReporter, reportViolations } from 'axe-playwright';
import { A11yReportAttachmentName } from './constants';
import type { Violations } from './test-utils';

const terminalReporter = new DefaultTerminalReporter(true, true, false);

export default class A11yReporter implements Reporter {
	#errors: ErrorReport[] = [];
	#reports: A11yReport[] = [];

	onTestEnd(test: TestCase, result: TestResult) {
		logResult(test, result);

		const reports: A11yReport[] = [];

		for (const attachment of result.attachments) {
			if (attachment.name !== A11yReportAttachmentName || !attachment.body) continue;

			reports.push({
				...(JSON.parse(attachment.body.toString()) as A11yReport),
				title: getTestTitle(test),
			});
		}

		this.#reports.push(...reports);

		if (reports.length === 0 && result.status !== 'passed' && result.status !== 'skipped') {
			this.#errors.push({
				title: getTestTitle(test),
				errors: result.errors.length > 0 ? result.errors : result.error ? [result.error] : [],
			});
		}
	}

	onError(error: TestError) {
		this.#errors.push({ title: 'Error', errors: [error] });
	}

	async onEnd(_result: FullResult) {
		logErrors(this.#errors);

		if (this.#reports.length === 0) return;

		const reports = this.#reports.toSorted((a, b) => a.title.localeCompare(b.title));
		const violationsCount = reports.reduce((count, report) => count + report.violations.length, 0);

		console.error(
			styleText(
				['red', 'bold'],
				`\nFound ${violationsCount} violations on ${reports.length} pages.\n`
			)
		);

		for (const report of reports) {
			await logViolation(report);
		}
	}
}

function logErrors(errorReports: ErrorReport[]) {
	if (errorReports.length === 0) return;

	console.error(styleText(['red', 'bold'], `\nEncountered ${errorReports.length} test errors.\n`));

	for (const report of errorReports) {
		console.error(styleText('red', `> ${report.title}\n`));

		if (report.errors.length === 0) {
			console.error('No error provided by Playwright.');
			continue;
		}

		for (const error of report.errors) {
			console.error(error.stack ?? error.message ?? String(error.value ?? 'Unknown error'));
			console.error();
		}
	}
}

function logResult(test: TestCase, result: TestResult) {
	const { marker, style } = getResultStyle(result);
	const logFn = result.status === 'passed' ? console.log : console.error;

	logFn(styleText(style, `${marker} ${getTestTitle(test)}`));
}

async function logViolation(report: A11yReport) {
	console.error(styleText('red', `> ${report.title}\n`));
	await reportViolations(report.violations, terminalReporter);
	console.error('\n');
}

function getTestTitle(test: TestCase) {
	return test.titlePath().filter(Boolean).join(' > ');
}

function getResultStyle(result: TestResult): {
	marker: string;
	style: Parameters<typeof styleText>[0];
} {
	// https://playwright.dev/docs/api/class-testresult#test-result-status
	switch (result.status) {
		case 'passed':
			return { marker: '✓', style: 'green' };
		case 'skipped':
			return { marker: '-', style: 'cyan' };
		default:
			return { marker: '✘', style: 'red' };
	}
}

interface ErrorReport {
	title: string;
	errors: TestResult['errors'];
}

export interface A11yReport {
	title: string;
	violations: Violations;
}
