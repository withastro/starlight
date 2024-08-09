import type { StarlightPlugin } from '@astrojs/starlight/types';
import { UIStrings } from './i18n';

export default function starlightCustomPlugin(): StarlightPlugin {
	return {
		name: 'custom-plugin',
		hooks: {
			setup({ injectTranslations, updateConfig }) {
				injectTranslations(UIStrings);

				updateConfig({
					components: {
						MarkdownContent: 'starlight-custom-plugin/MarkdownContent.astro',
					},
				});
			},
		},
	};
}
