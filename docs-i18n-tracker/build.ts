import { TranslationStatusBuilder } from './lib/translation-status/builder';
import { locales } from '../docs/astro.config.mjs';

const translationStatusBuilder = new TranslationStatusBuilder({
	pageSourceDir: '../docs/src/content/docs',
	htmlOutputFilePath: './dist/index.html',
	sourceLanguage: 'en',
	targetLanguages: Object.values(locales)
		.reduce((acc, { lang }) => (lang !== 'en' ? [lang, ...acc] : acc), [])
		.sort(),
	languageLabels: Object.values(locales)
		.filter((loc) => loc.lang !== 'en')
		.reduce((acc, curr) => ({ [curr.lang]: curr.label, ...acc }), {}),
	githubRepo: process.env.GITHUB_REPOSITORY || 'withastro/starlight',
	githubToken: process.env.GITHUB_TOKEN,
});

await translationStatusBuilder.run();
