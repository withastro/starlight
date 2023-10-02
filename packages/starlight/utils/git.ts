/**
 * Heavily inspired by
 * https://github.com/facebook/docusaurus/blob/46d2aa231ddb18ed67311b6195260af46d7e8bdc/packages/docusaurus-utils/src/gitUtils.ts
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'node:path';
import { execaSync } from 'execa';

/** Custom error thrown when git is not found in `PATH`. */
class GitNotFoundError extends Error {}

/** Custom error thrown when the current file is not tracked by git. */
class FileNotTrackedError extends Error {}

/**
 * Fetches the git history of a file and returns a relevant commit date.
 * It gets the commit date instead of author date so that amended commits
 * can have their dates updated.
 *
 * @throws {GitNotFoundError} If git is not found in `PATH`.
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
	try {
		const { stdout } = execaSync('which', ['git']);
		if (!stdout) {
			throw new GitNotFoundError(
				`Failed to retrieve git history for "${file}" because git is not installed.`
			);
		}
	} catch {}

	try {
		const { stdout } = execaSync('test', ['-f', file]);
		if (!stdout) {
			throw new Error(
				`Failed to retrieve git history for "${file}" because the file does not exist.`
			);
		}
	} catch {}

	const isShallowRepo = handleShallowRepository(file);
	const shallowRepoPath = path.join(
		process.cwd(),
		'.astro',
		'starlight-history',
		path.dirname(file).replace(process.cwd(), '').replace('src', '')
	);

	const result = execaSync(
		'git',
		[
			'log',
			`--format=%ct`,
			'--max-count=1',
			...(age === 'oldest' ? ['--follow', '--diff-filter=A'] : []),
			'--',
			path.basename(file),
		],
		{
			cwd: isShallowRepo ? shallowRepoPath : path.dirname(file),
		}
	);

	// Comparision between the normal dirname and the shallow repo one
	console.log(
		path.dirname(file),
		path.join(
			process.cwd(),
			'.astro',
			'starlight-history',
			path.dirname(file).replace(process.cwd(), '')
		)
	);

	if (result.exitCode !== 0) {
		throw new Error(
			`Failed to retrieve the git history for file "${file}" with exit code ${result.exitCode}: ${result.stderr}`
		);
	}
	let regex = /^(?<timestamp>\d+)$/;

	const output = result.stdout.trim();

	if (!output) {
		throw new FileNotTrackedError(
			`Failed to retrieve the git history for file "${file}" because the file is not tracked by git.`
		);
	}

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

function handleShallowRepository(file: string) {
	const { stdout: isShallowRepo } = execaSync('git', ['rev-parse', `--is-shallow-repository`], {
		cwd: path.dirname(file),
	});

	if (isShallowRepo === 'true') {
		const { stdout: cloneAddress } = execaSync('git', ['config', '--get', 'remote.origin.url'], {
			cwd: path.dirname(file),
		});

		try {
			const result = execaSync(
				'git',
				['clone', cloneAddress, '--bare', '--filter=blob:none', '--', './.astro/starlight-history'],
				{
					cwd: process.cwd(),
				}
			);
			if (result.exitCode !== 0) {
				throw new Error(
					`Failed to retrieve the git history of shallow repository: ${result.stderr}`
				);
			}
		} catch {}
	}

	return isShallowRepo === 'true' ? true : false;
}
