// @ts-check

import fs from 'node:fs/promises';

const markdown = {
	repo: 'shikijs/textmate-grammars-themes',
	tmLanguagePath: 'packages/tm-grammars/grammars/markdown.json',
};

const markdoc = {
	repo: 'markdoc/language-server',
	// We don't need the Markdoc grammar, only the Markdoc Markdown grammar.
	// tmLanguagePath: 'syntaxes/markdoc.tmLanguage.json',
	markdownTmLanguagePath: 'syntaxes/markdoc.markdown.tmLanguage.json',
};

/**
 * Download a TextMate grammar file from a GitHub repository.
 * @param {string} repo
 * @param {string} path
 */
async function fetchTmLanguage(repo, path) {
	const url = `https://raw.githubusercontent.com/${repo}/main/${path}`;
	const response = await fetch(url);
	const data = await response.json();
	return data;
}

// Download the TextMate grammar files for Markdown.
const markdownTmLanguage = await fetchTmLanguage(markdown.repo, markdown.tmLanguagePath);

// Download the TextMate grammar files for Markdoc Markdown.
const markdocMarkdownTmLanguage = await fetchTmLanguage(
	markdoc.repo,
	markdoc.markdownTmLanguagePath
);

// Reference: https://macromates.com/manual/en/language_grammars

// Update the name and scope name for the Markdoc grammar.
markdownTmLanguage.name = 'markdoc';
markdownTmLanguage.scopeName = 'text.html.markdoc';

// Merge the Markdown and Markdoc Markdown grammar repositories.
markdownTmLanguage.repository = {
	...markdownTmLanguage.repository,
	...markdocMarkdownTmLanguage.repository,
};

// Include the Markdoc Markdown grammar rules at the beginning of the Markdown grammar.
for (const rule of Object.keys(markdocMarkdownTmLanguage.repository)) {
	// Skip shortcut rules as they break syntax highlighting of child content that includes dots in
	// words and we don't ever use them.
	if (rule === 'shortcut') continue;

	markdownTmLanguage.repository.block.patterns.unshift({ include: `#${rule}` });
	markdownTmLanguage.repository.inline.patterns.unshift({ include: `#${rule}` });
}

// Write the grammar to a file.
await fs.writeFile(
	'./grammars/markdoc.tmLanguage.json',
	JSON.stringify(
		markdownTmLanguage,
		(key, value) => {
			// The `applyEndPatternLast` property should be a boolean and not a number.
			if (key === 'applyEndPatternLast') return Boolean(value);
			return value;
		},
		2
	)
);

console.log('Markdoc grammar generated successfully.');
