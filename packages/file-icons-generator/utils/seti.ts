import { spawnSync, type SpawnSyncOptions } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { seti, starlight } from '../config';
import type { Definitions } from '../../starlight/user-components/rehype-file-tree.ts';

// https://github.com/jesseweed/seti-ui/blob/master/styles/components/icons/mapping.less
// .icon-set(".bsl", "bsl", @red);
// .icon-partial("mix", "hex", @red);
const mappingRegex =
	/^\.icon-(?<type>(set|partial))\((?<quote>['"])(?<identifier>.+)\k<quote>, \k<quote>(?<lang>.+)\k<quote>, @.+\);$/;

/** Clone the Seti UI repository, install dependencies, and generate the Seti UI icons. */
export async function setupRepo() {
	try {
		const repoPath = await fs.mkdtemp(path.join(os.tmpdir(), 'starlight-file-icons-'));

		const spawnOptions: SpawnSyncOptions = {
			cwd: repoPath,
			encoding: 'utf8',
		};

		let result = spawnSync('git', ['clone', `https://github.com/${seti.repo}`, '.'], spawnOptions);
		if (result.error) throw new Error('Failed to clone the Seti UI repository.');

		result = spawnSync('npm', ['install'], spawnOptions);
		if (result.error) throw new Error('Failed to install the Seti UI dependencies.');

		result = spawnSync('npm', ['run', 'createIcons'], spawnOptions);
		if (result.error) throw new Error('Failed to generate the Seti UI icons.');

		return repoPath;
	} catch (error) {
		throw new Error(
			'Failed to setup the Seti UI repo. Make sure the repository URL and font path are correct.',
			{ cause: error }
		);
	}
}

/** Delete the Seti UI repository. */
export async function deleteRepo(repoPath: string) {
	try {
		await fs.rm(repoPath, { force: true, recursive: true });
	} catch (error) {
		throw new Error('Failed to remove the Seti UI repo.', { cause: error });
	}
}

/**
 * Get the Seti UI icon font from a local repository.
 * Note that the `woff` font format is used and not `woff2` as we would manually need to decompress
 * it and we do not need the compression benefits for this use case.
 */
export async function getFont(repoPath: string) {
	try {
		const result = await fs.readFile(path.join(repoPath, seti.font));
		return new Uint8Array(result).buffer;
	} catch (error) {
		throw new Error('Failed to read Seti UI font. Make sure the font path is correct.', {
			cause: error,
		});
	}
}

/**
 * Parse the Seti UI icon mapping file to generate the definitions used by the `<FileTree>`
 * component and a list of Seti UI icons to extract as SVGs.
 * @see https://github.com/elviswolcott/seti-icons/blob/master/build/extract.ts
 */
export async function parseMapping(repoPath: string) {
	const mapping = await getMapping(repoPath);

	const lines = mapping.split('\n');
	// Include the `folder` icon by default as it is not defined in the mapping file.
	const icons = new Set<string>(['folder']);
	const definitions: Definitions = {
		files: { ...starlight.definitions.files },
		extensions: { ...starlight.definitions.extensions },
		partials: { ...starlight.definitions.partials },
	};

	for (const line of lines) {
		const match = line.match(mappingRegex);
		if (!match) continue;
		const { identifier, lang, type } = match.groups!;
		if (!identifier || !lang || !type) continue;
		if (seti.ignores.includes(lang)) continue;

		const maybeOverride: string | undefined = seti.overrides[lang as keyof typeof seti.overrides];

		// Add the icon to the list of icons to extract as SVGs.
		icons.add(maybeOverride ?? lang);

		const icon = getSetiIconName(lang);

		if (type === 'set') {
			if (identifier?.startsWith('.')) {
				definitions.extensions[identifier] = icon;
			} else {
				definitions.files[identifier] = icon;
			}
		} else {
			definitions.partials[identifier] = icon;
		}
	}

	return { definitions, icons: [...icons] };
}

/** Return the name of an icon by taking rename configuration into account. */
export function getSetiIconName(icon: string) {
	const name = seti.renames[icon as keyof typeof seti.renames] ?? icon;

	return `${starlight.prefix}${name}`;
}

/** Get the Seti UI icon mapping file from a local repository. */
async function getMapping(repoPath: string) {
	try {
		return await fs.readFile(path.join(repoPath, seti.mapping), 'utf8');
	} catch (error) {
		throw new Error(
			'Failed to read Seti UI icon mapping file. Make sure the mapping file path is correct.',
			{ cause: error }
		);
	}
}
