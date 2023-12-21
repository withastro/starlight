import type { Element, Text } from 'hast';
import { type Child, h, s } from 'hastscript';
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

// TODO(HiDeoo)
const folderIcon = makeSVGIcon(
	'<path d="M14.77 6.45H9.8v-.47A.97.97 0 0 0 8.83 5H3.75v10H15.7V7.42a.91.91 0 0 0-.93-.97Z"/>'
);

// TODO(HiDeoo)
const defaultFileIcon = makeSVGIcon(
	'<path d="M14.77 6.45H9.8v-.47A.97.97 0 0 0 8.83 5H3.75v10H15.7V7.42a.91.91 0 0 0-.93-.97Z"/>'
);

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

		visit(tree, 'element', (node) => {
			// Strip nodes that only contain newlines.
			// TODO(HiDeoo) Test empty lines not only containing a newline character.
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
				comment.push(fragments.join(' '));
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
			const treeEntry = h(
				'span',
				{ class: 'tree-entry' },
				h('span', { class: isHighlighted ? 'highlight' : '' }, [
					isPlaceholder ? null : icon,
					firstChild,
				]),
				makeText(comment.length > 0 ? ' ' : ''),
				comment.length > 0 ? h('span', { class: 'comment' }, ...comment) : makeText()
			);

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

function getFileIcon(fileName: string) {
	const type = getFileIconType(fileName);
	console.log('🚨 [rehype-file-tree.ts:156] fileName, type:', fileName, type);
	if (!type) return defaultFileIcon;
	// FIXME(HiDeoo)
	// const iconName = `file-${type}`;
	const iconName = `matrix`;
	if (iconName in Icons) {
		const path = Icons[iconName as keyof typeof Icons];
		return makeSVGIcon(path);
	}
	return defaultFileIcon;
}

/** Return the icon type for a file based on its name. */
function getFileIconType(fileName: string) {
	let icon = definitions.files[fileName];
	if (icon) return icon;
	icon = getFileIconTypeFromExtension(fileName);
	if (icon) return icon;
	for (const partial of definitions.partials) {
		if (fileName.includes(partial[0])) return partial[1];
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
		'README.md': 'info',
		'README.txt': 'info',
		README: 'info',
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
		'tsconfig.json': 'tsconfig',
		'swagger.json': 'json',
		'swagger.yml': 'json',
		'swagger.yaml': 'json',
		'mime.types': 'config',
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
		'npm-debug.log': 'npm_ignored',
	},
	extensions: {
		'.astro': 'astro',
		'.bsl': 'bsl',
		'.mdo': 'mdo',
		'.cls': 'salesforce',
		'.apex': 'salesforce',
		'.asm': 'asm',
		'.s': 'asm',
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
		'.coffee': 'coffee',
		'.litcoffee': 'coffee',
		'.config': 'config',
		'.cfg': 'config',
		'.conf': 'config',
		'.cr': 'crystal',
		'.ecr': 'crystal_embedded',
		'.slang': 'crystal_embedded',
		'.cson': 'json',
		'.css': 'css',
		'.css.map': 'css',
		'.sss': 'css',
		'.csv': 'csv',
		'.xls': 'xls',
		'.xlsx': 'xls',
		'.cu': 'cu',
		'.cuh': 'cu',
		'.hu': 'cu',
		'.cake': 'cake',
		'.ctp': 'cake_php',
		'.d': 'd',
		'.doc': 'word',
		'.docx': 'word',
		'.ejs': 'ejs',
		'.ex': 'elixir',
		'.exs': 'elixir_script',
		'.elm': 'elm',
		'.ico': 'favicon',
		'.fs': 'f-sharp',
		'.fsx': 'f-sharp',
		'.gitignore': 'git',
		'.gitconfig': 'git',
		'.gitkeep': 'git',
		'.gitattributes': 'git',
		'.gitmodules': 'git',
		'.go': 'go2',
		'.slide': 'go',
		'.article': 'go',
		'.gd': 'godot',
		'.godot': 'godot',
		'.tres': 'godot',
		'.tscn': 'godot',
		'.gradle': 'gradle',
		'.groovy': 'grails',
		'.gsp': 'grails',
		'.gql': 'graphql',
		'.graphql': 'graphql',
		'.graphqls': 'graphql',
		'.hack': 'hacklang',
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
		'.jade': 'jade',
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
		'.mdx': 'markdown',
		'.argdown': 'argdown',
		'.ad': 'argdown',
		'.mustache': 'mustache',
		'.stache': 'mustache',
		'.nim': 'nim',
		'.nims': 'nim',
		'.github-issues': 'github',
		'.ipynb': 'notebook',
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
		'.odata': 'odata',
		'.pl': 'perl',
		'.php': 'php',
		'.php.inc': 'php',
		'.pipeline': 'pipeline',
		'.pddl': 'pddl',
		'.plan': 'plan',
		'.happenings': 'happenings',
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
		'.res': 'rescript',
		'.resi': 'rescript',
		'.R': 'R',
		'.rmd': 'R',
		'.rb': 'ruby',
		'.erb': 'html_erb',
		'.erb.html': 'html_erb',
		'.html.erb': 'html_erb',
		'.rs': 'rust',
		'.sass': 'sass',
		'.scss': 'sass',
		'.springBeans': 'spring',
		'.slim': 'slim',
		'.smarty.tpl': 'smarty',
		'.tpl': 'smarty',
		'.sbt': 'sbt',
		'.scala': 'scala',
		'.sol': 'ethereum',
		'.styl': 'stylus',
		'.svelte': 'svelte',
		'.swift': 'swift',
		'.sql': 'db',
		'.soql': 'db',
		'.tf': 'terraform',
		'.tf.json': 'terraform',
		'.tfvars': 'terraform',
		'.tfvars.json': 'terraform',
		'.tex': 'tex',
		'.sty': 'tex',
		'.dtx': 'tex',
		'.ins': 'tex',
		'.txt': 'default',
		'.toml': 'config',
		'.twig': 'twig',
		'.ts': 'typescript',
		'.tsx': 'typescript',
		'.spec.ts': 'typescript',
		'.test.ts': 'typescript',
		'.vala': 'vala',
		'.vapi': 'vala',
		'.component': 'html',
		'.vue': 'vue',
		'.wasm': 'wasm',
		'.wat': 'wat',
		'.xml': 'xml',
		'.yml': 'yml',
		'.yaml': 'yml',
		'.pro': 'prolog',
		'.zig': 'zig',
		'.jar': 'zip',
		'.zip': 'zip',
		'.wgt': 'wgt',
		'.ai': 'illustrator',
		'.psd': 'photoshop',
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
		'.svg': 'svg',
		'.svgx': 'image',
		'.tiff': 'image',
		'.webp': 'image',
		'.sublime-project': 'sublime',
		'.sublime-workspace': 'sublime',
		'.code-search': 'code-search',
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
		'.mp3': 'audio',
		'.ogg': 'audio',
		'.wav': 'audio',
		'.flac': 'audio',
		'.3ds': 'svg',
		'.3dm': 'svg',
		'.stl': 'svg',
		'.obj': 'svg',
		'.dae': 'svg',
		'.bat': 'windows',
		'.cmd': 'windows',
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
		'.direnv': 'config',
		'.env': 'config',
		'.static': 'config',
		'.editorconfig': 'config',
		'.slugignore': 'config',
		'.tmp': 'clock',
		'.htaccess': 'config',
		'.key': 'lock',
		'.cert': 'lock',
		'.cer': 'lock',
		'.crt': 'lock',
		'.pem': 'lock',
		'.DS_Store': 'ignored',
	},
	partials: [
		['TODO.md', 'todo'],
		['TODO.txt', 'todo'],
		['TODO', 'todo'],
		['Procfile', 'heroku'],
		['cmakelists.txt', 'makefile'],
		['CMakeLists.txt', 'makefile'],
		['CMAKELISTS.txt', 'makefile'],
		['CMAKELISTS.TXT', 'makefile'],
		['omakefile', 'makefile'],
		['OMakefile', 'makefile'],
		['OMAKEFILE', 'makefile'],
		['qmakefile', 'makefile'],
		['QMakefile', 'makefile'],
		['QMAKEFILE', 'makefile'],
		['makefile', 'makefile'],
		['Makefile', 'makefile'],
		['MAKEFILE', 'makefile'],
		['CONTRIBUTING.md', 'license'],
		['CONTRIBUTING.txt', 'license'],
		['CONTRIBUTING', 'license'],
		['COMPILING.md', 'license'],
		['COMPILING.txt', 'license'],
		['COMPILING', 'license'],
		['COPYING.md', 'license'],
		['COPYING.txt', 'license'],
		['COPYING', 'license'],
		['LICENCE.md', 'license'],
		['LICENSE.md', 'license'],
		['LICENCE.txt', 'license'],
		['LICENSE.txt', 'license'],
		['LICENCE', 'license'],
		['LICENSE', 'license'],
		['gulpfile.js', 'gulp'],
		['gulpfile', 'gulp'],
		['Gulpfile', 'gulp'],
		['GULPFILE', 'gulp'],
		['docker-compose.override.yaml', 'docker'],
		['docker-compose.override.yml', 'docker'],
		['docker-compose.yaml', 'docker'],
		['docker-compose.yml', 'docker'],
		['docker-healthcheck', 'docker'],
		['.dockerignore', 'docker'],
		['DOCKERFILE', 'docker'],
		['Dockerfile', 'docker'],
		['dockerfile', 'docker'],
		['gemfile', 'ruby'],
		['Gemfile', 'ruby'],
		['mix', 'hex'],
	],
};

interface Definitions {
	files: Record<string, string>;
	extensions: Record<string, string>;
	partials: [string, string][];
}
