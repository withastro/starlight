/**
 * Heavily inspired by
 * https://github.com/facebook/docusaurus/blob/46d2aa231ddb18ed67311b6195260af46d7e8bdc/packages/docusaurus-utils/src/gitUtils.ts
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { basename, dirname } from 'node:path';
import { execaSync } from 'execa';

/** Custom error thrown when the current file is not tracked by git. */
class FileNotTrackedError extends Error {}

/**
 * Fetches the git history of a file and returns a relevant commit date.
 * It gets the commit date instead of author date so that amended commits
 * can have their dates updated.
 *
 * @throws {FileNotTrackedError} If the current file is not tracked by git.
 * @throws Also throws when `git log` exited with non-zero, or when it outputs
 * unexpected text.
 */
export function getFileCommitDate(
	file: string,
	age: 'oldest' | 'newest' = 'oldest'
): {
	date: Date;
	timestamp: number;
} {
	const result = execaSync(
		'git',
		[
			'log',
			`--format=%ct`,
			'--max-count=1',
			...(age === 'oldest' ? ['--follow', '--diff-filter=A'] : []),
			'--',
			basename(file),
		],
		{
			cwd: dirname(file),
		}
	);
	if (result.exitCode !== 0) {
		throw new Error(
			`Failed to retrieve the git history for file "${file}" with exit code ${result.exitCode}: ${result.stderr}`
		);
	}

	const output = result.stdout.trim();

	if (!output) {
		throw new FileNotTrackedError(
			`Failed to retrieve the git history for file "${file}" because the file is not tracked by git.`
		);
	}

	const regex = /^(?<timestamp>\d+)$/;
	const match = output.match(regex);

	if (!match) {
		throw new Error(
			`Failed to retrieve the git history for file "${file}" with unexpected output: ${output}`
		);
	}

	const timestamp = Number(match.groups!.timestamp);
	const date = new Date(timestamp * 1000);

	return { date, timestamp };
}
