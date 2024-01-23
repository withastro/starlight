import { pluginFramesTexts } from 'astro-expressive-code';
import type { StarlightConfig } from '../../types';
import type { createTranslationSystemFromFs } from '../../utils/translations-fs';

export function addTranslations(
	locales: StarlightConfig['locales'],
	useTranslations: ReturnType<typeof createTranslationSystemFromFs>
) {
	for (const locale in locales) {
		const lang = locales[locale]?.lang;
		if (!lang) continue;

		const t = useTranslations(locale);
		const translationKeys = [
			'expressiveCode.copyButtonCopied',
			'expressiveCode.copyButtonTooltip',
			'expressiveCode.terminalWindowFallbackTitle',
		] as const;
		translationKeys.forEach((key) => {
			const translation = t(key);
			if (!translation) return;
			const ecId = key.replace(/^expressiveCode\./, '');
			pluginFramesTexts.overrideTexts(lang, { [ecId]: translation });
		});
	}
}
