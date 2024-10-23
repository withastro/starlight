/**
 * Git module to be used from the dev server and from the integration.
 */

import { basename, dirname, relative, resolve } from 'node:path';
import { realpathSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

export type GitAPI = {
	getNewestCommitDate: (file: string) => Date;
};

export const makeAPI = (directory: string): GitAPI => {
	return {
		getNewestCommitDate: (file) => getNewestCommitDate(resolve(directory, file)),
	};
};

export function getNewestCommitDate(file: string): Date {
	const result = spawnSync('git', ['log', '--format=%ct', '--max-count=1', basename(file)], {
		cwd: dirname(file),
		encoding: 'utf-8',
	});

	if (result.error) {
		throw new Error(`Failed to retrieve the git history for file "${file}"`);
	}
	const output = result.stdout.trim();
	const regex = /^(?<timestamp>\d+)$/;
	const match = output.match(regex);

	if (!match?.groups?.timestamp) {
		throw new Error(`Failed to validate the timestamp for file "${file}"`);
	}

	const timestamp = Number(match.groups.timestamp);
	const date = new Date(timestamp * 1000);
	return date;
}

function getRepoRoot(directory: string): string {
	const result = spawnSync('git', ['rev-parse', '--show-toplevel'], {
		cwd: directory,
		encoding: 'utf-8',
	});

	if (result.error) {
		return directory;
	}

	try {
		return realpathSync(result.stdout.trim());
	} catch {
		return directory;
	}
}

export function getAllNewestCommitDate(directory: string): [string, number][] {
	const repoRoot = getRepoRoot(directory);

	const gitLog = spawnSync(
		'git',
		[
			'log',
			// Format each history entry as t:<seconds since epoch>
			'--format=t:%ct',
			// In each entry include the name and status for each modified file
			'--name-status',
			'--',
			directory,
		],
		{
			cwd: repoRoot,
			encoding: 'utf-8',
		}
	);

	if (gitLog.error) {
		return [];
	}

	let runningDate = Date.now();
	const latestDates = new Map<string, number>();

	for (const logLine of gitLog.stdout.split('\n')) {
		if (logLine.startsWith('t:')) {
			// t:<seconds since epoch>
			runningDate = Number.parseInt(logLine.slice(2)) * 1000;
		}

		// - Added files take the format `A\t<file>`
		// - Modified files take the format `M\t<file>`
		// - Deleted files take the format `D\t<file>`
		// - Renamed files take the format `R<count>\t<old>\t<new>`
		// - Copied files take the format `C<count>\t<old>\t<new>`
		// The name of the file as of the commit being processed is always
		// the last part of the log line.
		const tabSplit = logLine.lastIndexOf('\t');
		if (tabSplit === -1) continue;
		const fileName = logLine.slice(tabSplit + 1);

		const currentLatest = latestDates.get(fileName) || 0;
		latestDates.set(fileName, Math.max(currentLatest, runningDate));
	}

	return Array.from(latestDates.entries()).map(([file, date]) => {
		const fileFullPath = resolve(repoRoot, file);
		const fileInDirectory = relative(directory, fileFullPath);

		return [fileInDirectory, date];
	});
}
