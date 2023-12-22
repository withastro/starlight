import { AstroError } from 'astro/errors';
import type { Element, Text } from 'hast';
import { type Child, h, s } from 'hastscript';
import { select, selectAll } from 'hast-util-select';
import { fromHtml } from 'hast-util-from-html';
import { toString } from 'hast-util-to-string';
import { rehype } from 'rehype';
import { CONTINUE, SKIP, visit } from 'unist-util-visit';
import { Icons } from '../components/Icons';

declare module 'vfile' {
	interface DataMap {
		directoryLabel: string;
	}
}

const folderIcon = makeSVGIcon(Icons['folder']);
const defaultFileIcon = makeSVGIcon(Icons['file']);

/**
 * Process the HTML for a file tree to create the necessary markup for each file and directory
 * including icons.
 * @param html Inner HTML passed to the `<FileTree>` component.
 * @param directoryLabel The localized label for a directory.
 * @returns The processed HTML for the file tree.
 */
export function processFileTree(html: string, directoryLabel: string) {
	const file = fileTreeProcessor.processSync({ data: { directoryLabel }, value: html });

	return file.toString();
}

/** Rehype processor to extract file tree data and turn each entry into its associated markup. */
const fileTreeProcessor = rehype().use(function fileTree() {
	return (tree: Element, file) => {
		const { directoryLabel } = file.data;

		validateFileTree(tree);

		visit(tree, 'element', (node) => {
			// Strip nodes that only contain newlines.
			node.children = node.children.filter(
				(child) => child.type === 'comment' || child.type !== 'text' || !/^\n+$/.test(child.value)
			);

			// Skip over non-list items.
			if (node.tagName !== 'li') return CONTINUE;

			const [firstChild, ...otherChildren] = node.children;

			// Keep track of comments associated with the current file or directory.
			const comment: Child[] = [];

			// Extract text comment that follows the file name, e.g. `README.md This is a comment`
			if (firstChild?.type === 'text') {
				const [filename, ...fragments] = firstChild.value.split(' ');
				firstChild.value = filename || '';
				const textComment = fragments.join(' ').trim();
				if (textComment.length > 0) {
					comment.push(fragments.join(' '));
				}
			}

			// Comments may not always be entirely part of the first child text node,
			// e.g. `README.md This is an __important__ comment` where the `__important__` and `comment`
			// nodes would also be children of the list item node.
			const subTreeIndex = otherChildren.findIndex(
				(child) => child.type === 'element' && child.tagName === 'ul'
			);
			const commentNodes =
				subTreeIndex > -1 ? otherChildren.slice(0, subTreeIndex) : [...otherChildren];
			otherChildren.splice(0, subTreeIndex > -1 ? subTreeIndex : otherChildren.length);
			comment.push(...commentNodes);

			const firstChildTextContent = firstChild ? toString(firstChild) : '';

			// Decide a node is a directory if it ends in a `/` or contains another list.
			const isDirectory =
				/\/\s*$/.test(firstChildTextContent) ||
				otherChildren.some((child) => child.type === 'element' && child.tagName === 'ul');
			// A placeholder is a node that only contains 3 dots or an ellipsis.
			const isPlaceholder = /^\s*(\.{3}|…)\s*$/.test(firstChildTextContent);
			// A node is highlighted if its first child is bold text, e.g. `**README.md**`.
			const isHighlighted = firstChild?.type === 'element' && firstChild.tagName === 'strong';

			// Create an icon for the file or directory (placeholder do not have icons).
			const icon = h('span', isDirectory ? folderIcon : getFileIcon(firstChildTextContent));
			if (isDirectory) {
				// Add a screen reader only label for directories before the icon so that it is announced
				// as such before reading the directory name.
				icon.children.unshift(h('span', { class: 'sr-only' }, directoryLabel));
			}

			// Add classes and data attributes to the list item node.
			node.properties.class = isDirectory ? 'directory' : 'file';
			if (isPlaceholder) node.properties.class += ' empty';

			// Create the tree entry node that contains the icon, file name and comment which will end up
			// as the list item’s children.
			const treeEntryChildren: Child[] = [
				h('span', { class: isHighlighted ? 'highlight' : '' }, [
					isPlaceholder ? null : icon,
					firstChild,
				]),
			];

			if (comment.length > 0) {
				treeEntryChildren.push(makeText(' '), h('span', { class: 'comment' }, ...comment));
			}

			const treeEntry = h('span', { class: 'tree-entry' }, ...treeEntryChildren);

			if (isDirectory) {
				const hasContents = otherChildren.length > 0;

				node.children = [
					h('details', { open: hasContents }, [
						h('summary', treeEntry),
						...(hasContents ? otherChildren : [h('ul', h('li', '…'))]),
					]),
				];

				// Continue down the tree.
				return CONTINUE;
			}

			node.children = [treeEntry, ...otherChildren];

			// Files can’t contain further files or directories, so skip iterating children.
			return SKIP;
		});
	};
});

/** Make a text node with the pass string as its contents. */
function makeText(value = ''): Text {
	return { type: 'text', value };
}

/** Make a node containing an SVG icon from the passed HTML string. */
function makeSVGIcon(svgString: string) {
	return s(
		'svg',
		{
			width: 16,
			height: 16,
			class: 'tree-icon',
			'aria-hidden': 'true',
			viewBox: '0 0 24 24',
		},
		fromHtml(svgString, { fragment: true })
	);
}

/** Return the icon for a file based on its file name. */
function getFileIcon(fileName: string) {
	const name = getFileIconName(fileName);
	if (!name) return defaultFileIcon;
	if (name in Icons) {
		const path = Icons[name as keyof typeof Icons];
		return makeSVGIcon(path);
	}
	return defaultFileIcon;
}

/** Return the icon name for a file based on its file name. */
function getFileIconName(fileName: string) {
	let icon = definitions.files[fileName];
	if (icon) return icon;
	icon = getFileIconTypeFromExtension(fileName);
	if (icon) return icon;
	for (const [partial, partialIcon] of Object.entries(definitions.partials)) {
		if (fileName.includes(partial)) return partialIcon;
	}
	return icon;
}

/**
 * Get an icon from a file name based on its extension.
 * Note that an extension in Seti is everything after a dot, so `README.md` would be `.md` and
 * `name.with.dots` will try to look for an icon for `.with.dots` and then `.dots` if the first one
 * is not found.
 */
function getFileIconTypeFromExtension(fileName: string) {
	const firstDotIndex = fileName.indexOf('.');
	if (firstDotIndex === -1) return;
	let extension = fileName.slice(firstDotIndex);
	while (extension !== '') {
		const icon = definitions.extensions[extension];
		if (icon) return icon;
		const nextDotIndex = extension.indexOf('.', 1);
		if (nextDotIndex === -1) return;
		extension = extension.slice(nextDotIndex);
	}
	return;
}

/** Validate that the user provided HTML for a file tree is valid. */
function validateFileTree(tree: Element) {
	const rootElements = selectAll('body > *', tree);
	const [rootElement] = rootElements;

	if (rootElements.length === 0) {
		throwFileTreeValidationError(
			`The <FileTree/> component expects its content to be a unique unordered list but found no elements.`
		);
	}

	if (rootElements.length !== 1) {
		throwFileTreeValidationError(
			`The <FileTree/> component expects its content to be a unique unordered list but found the following elements: ${rootElements
				.map((element) => `<${element.tagName}>`)
				.join(' - ')}.`
		);
	}

	if (!rootElement || rootElement.tagName !== 'ul') {
		throwFileTreeValidationError(
			`The <FileTree/> component expects its content to be a unordered list but found the following element: <${rootElement?.tagName}>.`
		);
	}

	const listItemElement = select('li', rootElement);

	if (!listItemElement) {
		throwFileTreeValidationError(
			`The <FileTree/> component expects its content to be a unordered list with at least one list item.`
		);
	}
}

/** Throw a validation error for a file tree linking to the documentation. */
function throwFileTreeValidationError(message: string): never {
	throw new AstroError(
		message,
		'To learn more about the <FileTree/> component, see https://starlight.astro.build/guides/components/#filetree'
	);
}

/**
 * Based on https://github.com/elviswolcott/seti-icons which
 * is derived from https://github.com/jesseweed/seti-ui/
 *
 * Copyright (c) 2014 Jesse Weed
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
const definitions: Definitions = {
	files: {
		COMMIT_EDITMSG: 'git',
		MERGE_MSG: 'git',
		'karma.conf.js': 'karma',
		'karma.conf.coffee': 'karma',
		'README.md': 'information',
		'README.txt': 'information',
		README: 'information',
		'CHANGELOG.md': 'clock',
		'CHANGELOG.txt': 'clock',
		CHANGELOG: 'clock',
		'CHANGES.md': 'clock',
		'CHANGES.txt': 'clock',
		CHANGES: 'clock',
		'VERSION.md': 'clock',
		'VERSION.txt': 'clock',
		VERSION: 'clock',
		mvnw: 'maven',
		'tsconfig.json': 'typescript',
		'swagger.json': 'json',
		'swagger.yml': 'json',
		'swagger.yaml': 'json',
		'mime.types': 'setting',
		Jenkinsfile: 'jenkins',
		'babel.config.js': 'babel',
		'babel.config.json': 'babel',
		'babel.config.cjs': 'babel',
		BUILD: 'bazel',
		'BUILD.bazel': 'bazel',
		WORKSPACE: 'bazel',
		'WORKSPACE.bazel': 'bazel',
		'bower.json': 'bower',
		'Bower.json': 'bower',
		'firebase.json': 'firebase',
		geckodriver: 'firefox',
		'Gruntfile.js': 'grunt',
		'gruntfile.babel.js': 'grunt',
		'Gruntfile.babel.js': 'grunt',
		'gruntfile.js': 'grunt',
		'Gruntfile.coffee': 'grunt',
		'gruntfile.coffee': 'grunt',
		'ionic.config.json': 'ionic',
		'Ionic.config.json': 'ionic',
		'ionic.project': 'ionic',
		'Ionic.project': 'ionic',
		'platformio.ini': 'platformio',
		'rollup.config.js': 'rollup',
		'sass-lint.yml': 'sass',
		'stylelint.config.js': 'stylelint',
		'stylelint.config.cjs': 'stylelint',
		'yarn.clean': 'yarn',
		'yarn.lock': 'yarn',
		'webpack.config.js': 'webpack',
		'webpack.config.cjs': 'webpack',
		'webpack.config.ts': 'webpack',
		'webpack.config.build.js': 'webpack',
		'webpack.config.build.cjs': 'webpack',
		'webpack.config.build.ts': 'webpack',
		'webpack.common.js': 'webpack',
		'webpack.common.cjs': 'webpack',
		'webpack.common.ts': 'webpack',
		'webpack.dev.js': 'webpack',
		'webpack.dev.cjs': 'webpack',
		'webpack.dev.ts': 'webpack',
		'webpack.prod.js': 'webpack',
		'webpack.prod.cjs': 'webpack',
		'webpack.prod.ts': 'webpack',
		'npm-debug.log': 'npm',
		'biome.json': 'biome',
		'pnpm-debug.log': 'pnpm',
		'pnpm-lock.yaml': 'pnpm',
		'pnpm-workspace.yaml': 'pnpm',
		'tailwind.config.js': 'tailwind',
		'tailwind.config.mjs': 'tailwind',
		'tailwind.config.cjs': 'tailwind',
		'tailwind.config.ts': 'tailwind',
		'tailwind.config.mts': 'tailwind',
		'tailwind.config.cts': 'tailwind',
		'lit-localize.json': 'lit',
		'wrangler.toml': 'cloudflare',
		'netlify.toml': 'netlify',
		'vercel.json': 'vercel',
		'astro.config.js': 'astro',
		'astro.config.mjs': 'astro',
		'astro.config.cjs': 'astro',
		'astro.config.ts': 'astro',
	},
	extensions: {
		'.astro': 'astro',
		'.cls': 'salesforce',
		'.apex': 'salesforce',
		'.bicep': 'bicep',
		'.bzl': 'bazel',
		'.bazel': 'bazel',
		'.BUILD': 'bazel',
		'.WORKSPACE': 'bazel',
		'.bazelignore': 'bazel',
		'.bazelversion': 'bazel',
		'.c': 'c',
		'.h': 'c',
		'.m': 'c',
		'.cs': 'c-sharp',
		'.cshtml': 'html',
		'.aspx': 'html',
		'.ascx': 'html',
		'.asax': 'html',
		'.master': 'html',
		'.cc': 'cpp',
		'.cpp': 'cpp',
		'.cxx': 'cpp',
		'.c++': 'cpp',
		'.hh': 'cpp',
		'.hpp': 'cpp',
		'.hxx': 'cpp',
		'.h++': 'cpp',
		'.mm': 'cpp',
		'.clj': 'clojure',
		'.cljs': 'clojure',
		'.cljc': 'clojure',
		'.edn': 'clojure',
		'.cfc': 'coldfusion',
		'.cfm': 'coldfusion',
		'.coffee': 'coffeescript',
		'.litcoffee': 'coffeescript',
		'.config': 'setting',
		'.cfg': 'setting',
		'.conf': 'setting',
		'.cr': 'crystal',
		'.ecr': 'crystal',
		'.slang': 'crystal',
		'.cson': 'json',
		'.css': 'css',
		'.css.map': 'css',
		'.sss': 'css',
		'.csv': 'csv',
		'.xls': 'xls',
		'.xlsx': 'xls',
		'.doc': 'word',
		'.docx': 'word',
		'.ejs': 'ejs',
		'.ex': 'elixir',
		'.exs': 'elixir',
		'.elm': 'elm',
		'.ico': 'star',
		'.fs': 'f-sharp',
		'.fsx': 'f-sharp',
		'.gitignore': 'git',
		'.gitconfig': 'git',
		'.gitkeep': 'git',
		'.gitattributes': 'git',
		'.gitmodules': 'git',
		'.go': 'go',
		'.gd': 'godot',
		'.godot': 'godot',
		'.tres': 'godot',
		'.tscn': 'godot',
		'.gradle': 'gradle',
		'.gql': 'graphql',
		'.graphql': 'graphql',
		'.graphqls': 'graphql',
		'.haml': 'haml',
		'.handlebars': 'mustache',
		'.hbs': 'mustache',
		'.hjs': 'mustache',
		'.hs': 'haskell',
		'.lhs': 'haskell',
		'.hx': 'haxe',
		'.hxs': 'haxe',
		'.hxp': 'haxe',
		'.hxml': 'haxe',
		'.html': 'html',
		'.java': 'java',
		'.class': 'java',
		'.classpath': 'java',
		'.properties': 'java',
		'.js': 'javascript',
		'.js.map': 'javascript',
		'.spec.js': 'javascript',
		'.test.js': 'javascript',
		'.es': 'javascript',
		'.es5': 'javascript',
		'.es6': 'javascript',
		'.es7': 'javascript',
		'.cjs': 'javascript',
		'.mjs': 'javascript',
		'.jinja': 'jinja',
		'.jinja2': 'jinja',
		'.json': 'json',
		'.jl': 'julia',
		'.kt': 'kotlin',
		'.kts': 'kotlin',
		'.dart': 'dart',
		'.less': 'less',
		'.liquid': 'liquid',
		'.ls': 'livescript',
		'.lua': 'lua',
		'.markdown': 'markdown',
		'.md': 'markdown',
		'.mdx': 'mdx',
		'.mustache': 'mustache',
		'.stache': 'mustache',
		'.nim': 'nim',
		'.nims': 'nim',
		'.github-issues': 'github',
		'.ipynb': 'jupyter',
		'.njk': 'nunjucks',
		'.nunjucks': 'nunjucks',
		'.nunjs': 'nunjucks',
		'.nunj': 'nunjucks',
		'.njs': 'nunjucks',
		'.nj': 'nunjucks',
		'.npm-debug.log': 'npm',
		'.npmignore': 'npm',
		'.npmrc': 'npm',
		'.ml': 'ocaml',
		'.mli': 'ocaml',
		'.cmx': 'ocaml',
		'.cmxa': 'ocaml',
		'.pl': 'perl',
		'.php': 'php',
		'.php.inc': 'php',
		'.pipeline': 'pipeline',
		'.ps1': 'powershell',
		'.psd1': 'powershell',
		'.psm1': 'powershell',
		'.prisma': 'prisma',
		'.pug': 'pug',
		'.pp': 'puppet',
		'.epp': 'puppet',
		'.purs': 'purescript',
		'.py': 'python',
		'.jsx': 'react',
		'.spec.jsx': 'react',
		'.test.jsx': 'react',
		'.cjsx': 'react',
		'.spec.tsx': 'react',
		'.test.tsx': 'react',
		'.re': 'reasonml',
		'.R': 'r',
		'.rmd': 'r',
		'.rb': 'ruby',
		'.erb': 'html-erb',
		'.erb.html': 'html-erb',
		'.html.erb': 'html-erb',
		'.rs': 'rust',
		'.sass': 'sass',
		'.scss': 'sass',
		'.sbt': 'sbt',
		'.scala': 'scala',
		'.sol': 'ethereum',
		'.svelte': 'svelte',
		'.swift': 'swift',
		'.sql': 'database',
		'.soql': 'database',
		'.tf': 'terraform',
		'.tf.json': 'terraform',
		'.tfvars': 'terraform',
		'.tfvars.json': 'terraform',
		'.tex': 'latex',
		'.sty': 'latex',
		'.dtx': 'latex',
		'.ins': 'latex',
		'.toml': 'setting',
		'.ts': 'typescript',
		'.tsx': 'typescript',
		'.spec.ts': 'typescript',
		'.test.ts': 'typescript',
		'.vala': 'vala',
		'.vapi': 'vala',
		'.component': 'html',
		'.vue': 'vue',
		'.wasm': 'wasm',
		'.xml': 'xml',
		'.yml': 'yml',
		'.yaml': 'yml',
		'.zig': 'zig',
		'.jar': 'archive',
		'.zip': 'archive',
		'.ai': 'image',
		'.psd': 'image',
		'.pdf': 'pdf',
		'.eot': 'font',
		'.ttf': 'font',
		'.woff': 'font',
		'.woff2': 'font',
		'.avif': 'image',
		'.gif': 'image',
		'.jpg': 'image',
		'.jpeg': 'image',
		'.png': 'image',
		'.pxm': 'image',
		'.svg': 'image',
		'.svgx': 'image',
		'.tiff': 'image',
		'.webp': 'image',
		'.sh': 'shell',
		'.zsh': 'shell',
		'.fish': 'shell',
		'.zshrc': 'shell',
		'.bashrc': 'shell',
		'.mov': 'video',
		'.ogv': 'video',
		'.webm': 'video',
		'.avi': 'video',
		'.mpg': 'video',
		'.mp4': 'video',
		'.mp3': 'volume',
		'.ogg': 'volume',
		'.wav': 'volume',
		'.flac': 'volume',
		'.3ds': 'image',
		'.3dm': 'image',
		'.stl': 'image',
		'.obj': 'image',
		'.dae': 'image',
		'.bat': 'shell',
		'.cmd': 'shell',
		'.babelrc': 'babel',
		'.babelrc.js': 'babel',
		'.babelrc.cjs': 'babel',
		'.bazelrc': 'bazel',
		'.bowerrc': 'bower',
		'.codeclimate.yml': 'code-climate',
		'.eslintrc': 'eslint',
		'.eslintrc.js': 'eslint',
		'.eslintrc.cjs': 'eslint',
		'.eslintrc.yaml': 'eslint',
		'.eslintrc.yml': 'eslint',
		'.eslintrc.json': 'eslint',
		'.eslintignore': 'eslint',
		'.firebaserc': 'firebase',
		'.gitlab-ci.yml': 'gitlab',
		'.jshintrc': 'javascript',
		'.jscsrc': 'javascript',
		'.stylelintrc': 'stylelint',
		'.stylelintrc.json': 'stylelint',
		'.stylelintrc.yaml': 'stylelint',
		'.stylelintrc.yml': 'stylelint',
		'.stylelintrc.js': 'stylelint',
		'.stylelintignore': 'stylelint',
		'.direnv': 'setting',
		'.env': 'setting',
		'.static': 'setting',
		'.editorconfig': 'setting',
		'.slugignore': 'setting',
		'.tmp': 'clock',
		'.htaccess': 'setting',
		'.key': 'lock',
		'.cert': 'lock',
		'.cer': 'lock',
		'.crt': 'lock',
		'.pem': 'lock',
		'.DS_Store': 'eye-slash',
		'.cloudflared': 'cloudflare',
	},
	partials: {
		'TODO.md': 'approve-check-square',
		'TODO.txt': 'approve-check-square',
		TODO: 'approve-check-square',
		Procfile: 'heroku',
		'CONTRIBUTING.md': 'approve-check-file',
		'CONTRIBUTING.txt': 'approve-check-file',
		CONTRIBUTING: 'approve-check-file',
		'COMPILING.md': 'approve-check-file',
		'COMPILING.txt': 'approve-check-file',
		COMPILING: 'approve-check-file',
		'COPYING.md': 'approve-check-file',
		'COPYING.txt': 'approve-check-file',
		COPYING: 'approve-check-file',
		'LICENCE.md': 'approve-check-file',
		'LICENSE.md': 'approve-check-file',
		'LICENCE.txt': 'approve-check-file',
		'LICENSE.txt': 'approve-check-file',
		LICENCE: 'approve-check-file',
		LICENSE: 'approve-check-file',
		'gulpfile.js': 'gulp',
		gulpfile: 'gulp',
		Gulpfile: 'gulp',
		GULPFILE: 'gulp',
		'docker-compose.override.yaml': 'docker',
		'docker-compose.override.yml': 'docker',
		'docker-compose.yaml': 'docker',
		'docker-compose.yml': 'docker',
		'docker-healthcheck': 'docker',
		'.dockerignore': 'docker',
		DOCKERFILE: 'docker',
		Dockerfile: 'docker',
		dockerfile: 'docker',
		gemfile: 'ruby',
		Gemfile: 'ruby',
	},
};

interface Definitions {
	files: Record<string, string>;
	extensions: Record<string, string>;
	partials: Record<string, string>;
}
