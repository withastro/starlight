import type { Definitions } from '../starlight/user-components/rehype-file-tree';

export const seti = {
	/** The GitHub repository containing the Seti UI theme using the `username/repo` format. */
	repo: 'jesseweed/seti-ui',
	/** The path to the icon mapping file in the repository. */
	mapping: 'styles/components/icons/mapping.less',
	/** The path to the icon font file in the repository. */
	font: 'styles/_fonts/seti/seti.woff',
	/**
	 * Some Seti UI icons share identical SVG for multiple icons. When converted to a font, identical
	 * SVGs will be saved as one unique glyph with its name being the first icon encountered. The
	 * other names are lost in the process and only their associated unicode character will be kept.
	 * As we want to access icons by their name, we need to manually map the names of identical SVGs
	 * to the icon name that is embedded in the font glyph.
	 * Note that when this happens, an error will be thrown indicating which icon is affected.
	 */
	aliases: {
		coffee: 'cjsx',
		html_erb: 'html',
		less: 'json',
	},
	/**
	 * Seti UI icons can be overriden to use either a built-in Starlight icon or another Seti UI icon.
	 * The key is the icon name to override and the value is an object defining the override.
	 *
	 * The reason to support aliasing to a built-in Starlight icon is that some Seti UI icons can
	 * have the same meaning as a built-in Starlight icon, e.g. the `info` Seti UI icon which is
	 * the equivalent of the built-in Starlight `information` icon.
	 * In such cases, we do not want to include two icons with the same meaning.
	 *
	 * The reason to support aliasing to another Seti UI icon is that some Seti UI icons can be
	 * almost identical. For example, the `npm_ignored` icon used for `npm-debug.log` files is
	 * identical to the `npm` icon except the npm logo is shifted 1px to the right. There is no need
	 * to provide a separate icon for this case and we can just use the `npm` icon instead.
	 *
	 * @see Override
	 */
	overrides: {
		'code-search': { name: 'magnifier', type: 'built-in' },
		config: { name: 'settings', type: 'built-in' },
		default: { name: 'document', type: 'built-in' },
		ejs: { name: 'html', type: 'seti' },
		favicon: { name: 'star', type: 'built-in' },
		info: { name: 'information', type: 'built-in' },
		go: { name: 'go2', type: 'seti' },
		npm_ignored: { name: 'npm', type: 'seti' },
		xml: { name: 'rss', type: 'built-in' },
	} satisfies Record<string, Override>,
	/**
	 * Allows for renaming Seti UI icons to another name.
	 * For example, the Visual Studio Code icon used for Go is named `go2` and this is not the name
	 * we want to expose to the user.
	 * Note that renaming an icon happens after overrides are applied.
	 */
	renames: {
		go2: 'go',
	},
	/**
	 * A list of Seti UI icons to ignore.
	 * Each entry should be commented with the reason why the icon is ignored.
	 */
	ignores: [
		// The ReasonML SVG icon contains a path issue that makes it render a plain square instead of a
		// square with the "RE" letters when converted to a font.
		// This is also an issue in Visual Studio Code but considering that in Starlight, all the icons
		// are also available with the `<Icon>` component, it's better to ignore it for now instead of
		// providing an icon with no meaning.
		'reasonml',
	],
};

export const starlight = {
	/** The path of the generated file in the Starlight package directory. */
	output: 'user-components/file-tree-icons.ts',
	/**
	 * The Starlight `<Icon>` component viewBox size.
	 * @see {@link file://../starlight/user-components/Icon.astro}
	 */
	iconViewBoxSize: 24,
	/**
	 * Extra definitions for the `<FileTree>` component that add mappings using built-in Starlight
	 * icons.
	 */
	definitions: {
		files: {
			'astro.config.js': 'astro',
			'astro.config.mjs': 'astro',
			'astro.config.cjs': 'astro',
			'astro.config.ts': 'astro',
			'pnpm-debug.log': 'pnpm',
			'pnpm-lock.yaml': 'pnpm',
			'pnpm-workspace.yaml': 'pnpm',
			'biome.json': 'biome',
			'bun.lockb': 'bun',
		},
		extensions: {
			'.astro': 'astro',
		},
		partials: {},
	} satisfies Definitions,
};

/**
 * An object defining an icon override.
 * An icon can be overriden to either use a built-in Starlight icon or another Seti UI icon.
 */
export interface Override {
	name: string;
	type: 'built-in' | 'seti';
}
