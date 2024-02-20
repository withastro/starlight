import { seti, type Override, starlight } from '../config';
import { BuiltInIcons } from '../../starlight/components/Icons.ts';
import type { Definitions } from '../../starlight/user-components/rehype-file-tree.ts';

// https://github.com/jesseweed/seti-ui/blob/master/styles/components/icons/mapping.less
// .icon-set(".bsl", "bsl", @red);
// .icon-partial("mix", "hex", @red);
const mappingRegex =
	/^\.icon-(?<type>(set|partial))\((?<quote>['"])(?<identifier>.+)\k<quote>, \k<quote>(?<lang>.+)\k<quote>, @.+\);$/;

/** Fetch the Seti UI icon mapping file from GitHub. */
export async function fetchMapping() {
	try {
		const result = await fetch(getGitHubDownloadLink(seti.repo, seti.mapping));
		return await result.text();
	} catch (error) {
		throw new Error(
			'Failed to download Seti UI icon mapping file. Make sure the repository URL and mapping path are correct.',
			{ cause: error }
		);
	}
}

/**
 * Fetch the Seti UI icon font from GitHub.
 * Note that the `woff` font format is used and not `woff2` as we would manually need to decompress
 * it and we do not need the compression benefits for this use case.
 */
export async function fetchFont() {
	try {
		const result = await fetch(getGitHubDownloadLink(seti.repo, seti.font));
		return await result.arrayBuffer();
	} catch (error) {
		throw new Error(
			'Failed to download Seti UI font. Make sure the repository URL and font path are correct.',
			{ cause: error }
		);
	}
}

/**
 * Parse the Seti UI icon mapping file to generate the definitions used by the `<FileTree>`
 * component and a list of Seti UI icons to extract as SVGs.
 * @see https://github.com/elviswolcott/seti-icons/blob/master/build/extract.ts
 */
export function parseMapping(mapping: string) {
	const lines = mapping.split('\n');
	const conflicts = new Set<string>();
	const icons = new Set<string>();
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

		const maybeOverride: Override | undefined = seti.overrides[lang as keyof typeof seti.overrides];

		if (!maybeOverride && isBuiltInIcon(lang)) {
			// If the language is not overriden and the language matches a built-in icon, we skip
			// generating the associated icon and we warn the user.
			conflicts.add(lang);
		} else if (!maybeOverride) {
			// If the icon is not overriden and does not conflict with a built-in icon, we can safely
			// generate the icon.
			icons.add(lang);
		} else if (maybeOverride.type === 'seti') {
			// If the icon is overriden to use another Seti UI icon, we need to generate the alias icon.
			icons.add(maybeOverride.name);
		}

		const icon = getSetiIconName(maybeOverride?.name ?? lang);

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

	if (conflicts.size > 0) {
		console.warn(
			`The following languages match built-in icons and will be skipped:\n\n${[...conflicts]
				.map((lang) => `  - ${lang}`)
				.join('\n')}\n`
		);
	}

	return { definitions, icons: [...icons] };
}

/** Return the name of an icon by taking rename configuration into account. */
export function getSetiIconName(icon: string) {
	return seti.renames[icon as keyof typeof seti.renames] ?? icon;
}

function getGitHubDownloadLink(repo: string, path: string) {
	return `https://raw.githubusercontent.com/${repo}/master/${path}`;
}

function isBuiltInIcon(iconName: string) {
	return (BuiltInIcons as Record<string, string>)[iconName] !== undefined;
}
