import { join } from 'node:path';
import { mkdtempSync, mkdirSync, writeFileSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

export function makeTestRepo(onPath?: string) {
	const repoPath = realpathSync(onPath ?? mkdtempSync(join(tmpdir(), 'starlight-test-git-')));

	function runInRepo(command: string, args: string[], env: NodeJS.ProcessEnv = process.env) {
		// Format arguments to be shell-friendly for Windows.
		const formattedArgs = process.platform === 'win32' ? args.map((arg) => `"${arg}"`) : args;
		const result = spawnSync(command, formattedArgs, {
			cwd: repoPath,
			env,
			encoding: 'utf8',
			// Run commands using shell on Windows to ensure proper path resolution.
			shell: process.platform === 'win32',
			windowsVerbatimArguments: true,
		});

		if (result.status !== 0) {
			console.log(result.stdout);
			console.error(result.stderr);
			console.error(result.error);
			throw new Error(`Failed to execute test repository command: '${command} ${args.join(' ')}'`);
		}
	}

	// Configure git specifically for this test repository.
	runInRepo('git', ['init']);
	runInRepo('git', ['config', 'user.name', 'starlight-test']);
	runInRepo('git', ['config', 'user.email', 'starlight-test@example.com']);
	runInRepo('git', ['config', 'commit.gpgsign', 'false']);

	return {
		runInRepo,
		// The `dateStr` argument should be in the `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ` format.
		commitAllChanges(message: string, dateStr: ISODate) {
			const date = dateStr.endsWith('Z') ? dateStr : `${dateStr}T00:00:00Z`;

			runInRepo('git', ['add', '-A']);
			// This sets both the author and committer dates to the provided date.
			runInRepo('git', ['commit', '-m', message, '--date', date], { GIT_COMMITTER_DATE: date });
		},
		getFilePath(name: string) {
			return join(repoPath, name);
		},
		writeFile(name: string, content: string) {
			writeFileSync(join(repoPath, name), content);
		},
		writeFileTree(fileTree: FileTree) {
			writeFileTree(repoPath, fileTree);
		},
	};
}

export type ISODate =
	| `${number}-${number}-${number}`
	| `${number}-${number}-${number}T${number}:${number}:${number}Z`;

// Receive a file tree instead of a flattened list of files so it better works on Windows.
export type FileTree = { [name in string]: TreeEntry };
type TreeEntry = string | FileTree;

function writeFileTree(root: string, fileTree: FileTree) {
	for (const [name, entry] of Object.entries(fileTree)) {
		const path = join(root, name);

		if (typeof entry === 'string') {
			writeFileSync(path, entry);
		} else {
			mkdirSync(path, { recursive: true });
			writeFileTree(path, entry);
		}
	}
}
