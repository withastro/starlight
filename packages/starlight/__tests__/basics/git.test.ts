import { assert, describe, expect, test } from 'vitest';
import {
	getAllNewestCommitDate,
	getNewestCommitDate,
	makeAPI as makeLiveGitAPI,
} from '../../utils/git';
import { makeAPI as makeInlineGitAPI } from '../../utils/gitInlined';
import { makeTestRepo, type ISODate } from '../git-utils';

describe('getNewestCommitDate', () => {
	const { commitAllChanges, getFilePath, writeFile } = makeTestRepo();

	test('returns the newest commit date', () => {
		const file = 'updated.md';
		const lastCommitDate = '2023-06-25';

		writeFile(file, 'content 0');
		commitAllChanges('add updated.md', '2023-06-21');
		writeFile(file, 'content 1');
		commitAllChanges('update updated.md', lastCommitDate);

		expectCommitDateToEqual(getNewestCommitDate(getFilePath(file)), lastCommitDate);
	});

	test('returns the newest commit date from the wrapped API', () => {
		const api = makeLiveGitAPI(getFilePath(''));

		const file = 'updated.md';
		const lastCommitDate = '2023-06-25';

		writeFile(file, 'content 0');
		commitAllChanges('add updated.md', '2023-06-21');
		writeFile(file, 'content 1');
		commitAllChanges('update updated.md', lastCommitDate);

		expectCommitDateToEqual(api.getNewestCommitDate(file), lastCommitDate);
	});

	test('returns the initial commit date for a file never updated', () => {
		const file = 'added.md';
		const commitDate = '2022-09-18';

		writeFile(file, 'content');
		commitAllChanges('add added.md', commitDate);

		expectCommitDateToEqual(getNewestCommitDate(getFilePath(file)), commitDate);
	});

	test('returns the newest commit date for a file with a name that contains a space', () => {
		const file = 'updated with space.md';
		const lastCommitDate = '2021-01-02';

		writeFile(file, 'content 0');
		commitAllChanges('add updated.md', '2021-01-01');
		writeFile(file, 'content 1');
		commitAllChanges('update updated.md', lastCommitDate);

		expectCommitDateToEqual(getNewestCommitDate(getFilePath(file)), lastCommitDate);
	});

	test('returns the newest commit date for a file updated the same day', () => {
		const file = 'updated-same-day.md';
		const lastCommitDate = '2023-06-25T14:22:35Z';

		writeFile(file, 'content 0');
		commitAllChanges('add updated.md', '2023-06-25T12:34:56Z');
		writeFile(file, 'content 1');
		commitAllChanges('update updated.md', lastCommitDate);

		expectCommitDateToEqual(getNewestCommitDate(getFilePath(file)), lastCommitDate);
	});

	test('throws when failing to retrieve the git history for a file', () => {
		expect(() => getNewestCommitDate(getFilePath('../not-a-starlight-test-repo/test.md'))).toThrow(
			/^Failed to retrieve the git history for file "[/\\:-\w ]+[/\\]test\.md"/
		);
	});

	test('throws when trying to get the history of a non-existing or untracked file', () => {
		const expectedError =
			/^Failed to validate the timestamp for file "[/\\:-\w ]+[/\\](?:unknown|untracked)\.md"$/;
		writeFile('untracked.md', 'content');

		expect(() => getNewestCommitDate(getFilePath('unknown.md'))).toThrow(expectedError);
		expect(() => getNewestCommitDate(getFilePath('untracked.md'))).toThrow(expectedError);
	});
});

describe('getAllNewestCommitDate', () => {
	const { commitAllChanges, getFilePath, writeFile } = makeTestRepo();

	test('returns the newest commit date', () => {
		writeFile('added.md', 'content');
		commitAllChanges('add added.md', '2022-09-18');

		writeFile('updated.md', 'content 0');
		commitAllChanges('add updated.md', '2023-06-21');
		writeFile('updated.md', 'content 1');
		commitAllChanges('update updated.md', '2023-06-25');

		writeFile('updated with space.md', 'content 0');
		commitAllChanges('add updated.md', '2021-01-01');
		writeFile('updated with space.md', 'content 1');
		commitAllChanges('update updated.md', '2021-01-02');

		writeFile('updated-same-day.md', 'content 0');
		commitAllChanges('add updated.md', '2023-06-25T12:34:56Z');
		writeFile('updated-same-day.md', 'content 1');
		commitAllChanges('update updated.md', '2023-06-25T14:22:35Z');

		const latestDates = new Map(getAllNewestCommitDate(getFilePath('')));

		const expectedDates = new Map<string, ISODate>([
			['added.md', '2022-09-18'],
			['updated.md', '2023-06-25'],
			['updated with space.md', '2021-01-02'],
			['updated-same-day.md', '2023-06-25T14:22:35Z'],
		]);

		for (const [file, date] of latestDates.entries()) {
			const expectedDate = expectedDates.get(file);
			assert.ok(expectedDate, `Unexpected tracked file: ${file}`);
			expectCommitDateToEqual(new Date(date), expectedDate!);
		}

		for (const file of expectedDates.keys()) {
			const latestDate = latestDates.get(file);
			assert.ok(latestDate, `Missing tracked file: ${file}`);
		}
	});

	test('returns the newest commit date from inlined API', () => {
		const api = makeInlineGitAPI(getAllNewestCommitDate(getFilePath('')));

		const expectedDates = new Map<string, ISODate>([
			['added.md', '2022-09-18'],
			['updated.md', '2023-06-25'],
			['updated with space.md', '2021-01-02'],
			['updated-same-day.md', '2023-06-25T14:22:35Z'],
		]);

		for (const [file, expectedDate] of expectedDates.entries()) {
			const latestDate = api.getNewestCommitDate(file);
			expectCommitDateToEqual(latestDate, expectedDate);
		}
	});

	test('returns an empty list when the git history for the directory cannot be retrieved', () => {
		expect(getAllNewestCommitDate(getFilePath('../not-a-starlight-test-repo'))).toStrictEqual([]);
	});
});

function expectCommitDateToEqual(commitDate: CommitDate, expectedDateStr: ISODate) {
	const expectedDate = new Date(expectedDateStr);
	expect(commitDate).toStrictEqual(expectedDate);
}

type CommitDate = ReturnType<typeof getNewestCommitDate>;
