import { writeDefinitionsAndSVGs } from './utils/file';
import { getIconSvgPaths } from './utils/font';
import { deleteRepo, parseMapping, setupRepo } from './utils/seti';

/**
 * Script generating definitions used by the Starlight `<FileTree>` component and associated SVGs.
 *
 * To do so, it clones the Seti UI repository, installs dependencies, generates icons, parses the
 * mapping to generate the definitions and a list of icons to extract as SVGs, and finally extracts
 * the SVGs from the font and writes the definitions and SVGs to the Starlight package in a file
 * ready to be consumed by Starlight.
 *
 * @see {@link file://./config.ts} for the configuration used by this script.
 * @see {@link file://../starlight/user-components/file-tree-icons.ts} for the generated file.
 * @see {@link https://opentype.js.org/glyph-inspector.html} for a font glyph inspector.
 */

const repoPath = await setupRepo();

try {
	const { definitions, icons } = await parseMapping(repoPath);

	const svgPaths = await getIconSvgPaths(repoPath, icons, definitions);

	await writeDefinitionsAndSVGs(definitions, svgPaths);
} finally {
	await deleteRepo(repoPath);
}
