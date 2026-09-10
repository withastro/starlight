import { defineRendererConfig } from '@lunariajs/core';
import { StatusByFile } from '@lunariajs/core/components';
import { Freshness, Head, TitleParagraph } from './components';

export default defineRendererConfig({
	overrides: {
		statusByFile: (config, status) => StatusByFile(config, status) + Freshness(config, status),
	},
	slots: {
		afterTitle: TitleParagraph,
		head: Head,
	},
});
