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

export function getAllNewestCommitDate(rootPath: string, docsPath: string): [string, number][] {
	const repoRoot = getRepoRoot(docsPath);

	const gitLog = spawnSync(
		'git',
		[
			'log',
			// Format each history entry as t:<seconds since epoch>
			'--format=t:%ct',
			// In each entry include the name and status for each modified file
			'--name-status',
			'--',
			docsPath,
		],
		{
			cwd: repoRoot,
			encoding: 'utf-8',
			// The default `maxBuffer` for `spawnSync` is 1024 * 1024 bytes, a.k.a 1 MB. In big projects,
			// the full git history can be larger than this, so we increase this to ~10 MB. For example,
			// Cloudflare passed 1 MB with ~4,800 pages and ~17,000 commits. If we get reports of others
			// hitting ENOBUFS errors here in the future, we may want to switch to streaming the git log
			// with `spawn` instead.
			// See https://github.com/withastro/starlight/issues/3154
			maxBuffer: 10 * 1024 * 1024,
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
		let fileInDirectory = relative(rootPath, fileFullPath);
		// Format path to unix style path.
		fileInDirectory = fileInDirectory?.replace(/\\/g, '/');

		return [fileInDirectory, date];
	});
}
