/**
 * Git module to be used from the dev server and from the integration.
 */

import { basename, dirname, relative, resolve, sep } from 'node:path';
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
			// In each entry include the name of each modified file
			'--name-only',
			// Separate entries and file names with NUL characters and print file names verbatim instead
			// of quoting and escaping them, e.g. `café.md` instead of `"caf\303\251.md"`.
			'-z',
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

	// With `-z`, the output is a list of NUL-separated entries: each commit is a `t:<seconds since
	// epoch>` entry followed by the entries for the files modified in that commit. For renamed and
	// copied files, `--name-only` only lists the name of the file as of the commit being processed.
	for (const rawEntry of gitLog.stdout.split('\0')) {
		// Git separates the commit entry from its first file name with a newline, in addition to the NUL.
		const entry = rawEntry.replace(/^\n/, '');
		if (entry === '') continue;

		if (/^t:\d+$/.test(entry)) {
			// t:<seconds since epoch>
			runningDate = Number.parseInt(entry.slice(2)) * 1000;
			continue;
		}

		const currentLatest = latestDates.get(entry) || 0;
		latestDates.set(entry, Math.max(currentLatest, runningDate));
	}

	return Array.from(latestDates.entries()).map(([file, date]) => {
		const fileFullPath = resolve(repoRoot, file);
		let fileInDirectory = relative(rootPath, fileFullPath);
		// Format path to unix style path. Only on Windows, as a backslash is a valid file name character
		// on other platforms.
		if (sep === '\\') fileInDirectory = fileInDirectory.replace(/\\/g, '/');

		return [fileInDirectory, date];
	});
}
