import { TranslationStatusBuilder } from "./lib/translation-status/builder";
import { locales } from "../docs/astro.config.mjs";

const translationStatusBuilder = new TranslationStatusBuilder({
  pageSourceDir: "./docs/src/content/docs",
  htmlOutputFilePath: "./dist/translation-status/index.html",
  sourceLanguage: "en",
  targetLanguages: Object.values(locales)
    .map((el) => el.lang)
    .filter((lang) => lang !== "en")
    .sort(),
  languageLabels: Object.values(locales).reduce((acc, curr) => {
    return {
      [curr.lang]: curr.label,
      ...acc
    };
  }, {}),
  githubRepo: process.env.GITHUB_REPOSITORY || "withastro/starlight",
  githubToken: process.env.GITHUB_TOKEN
});

await translationStatusBuilder.run();
