import { basename, dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

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

export function listGitTrackedFiles(directory: string): string[] {
	const result = spawnSync('git', ['ls-files'], {
		cwd: directory,
		encoding: 'utf-8',
	});

	if (result.error) {
		// If git is not installed, the project is not a git repository
		// or any other reason for there to be no git information retrievable,
		// proceed without any git information.
		return [];
	}

	const output = result.stdout.trim();
	return output.split('\n').map((file) => join(directory, file));
}
