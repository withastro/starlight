import type { Element, Text } from 'hast';
import { type Child, h } from 'hastscript';
import { toString } from 'hast-util-to-string';
import { rehype } from 'rehype';
import { CONTINUE, SKIP, visit } from 'unist-util-visit';

declare module 'vfile' {
	interface DataMap {
		directoryLabel: string;
	}
}

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

			const fileExtension = isDirectory
				? 'dir'
				: firstChildTextContent.trim().split('.').pop() || '';

			// Create an icon for the file or directory (placeholder do not have icons).
			// TODO(HiDeoo)
			// const icon = h('span', isDirectory ? FolderIcon : FileIcon(firstChildTextContent));
			const icon = h('span', isDirectory ? makeText('DIR ICON') : makeText('FILE ICON'));
			if (isDirectory) {
				// Add a screen reader only label for directories before the icon so that it is announced
				// as such before reading the directory name.
				icon.children.unshift(h('span', { class: 'sr-only' }, directoryLabel));
			}

			// Add classes and data attributes to the list item node.
			node.properties.class = isDirectory ? 'directory' : 'file';
			if (isPlaceholder) node.properties.class += ' empty';
			node.properties['data-filetype'] = fileExtension;

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
