import { z } from 'astro/zod';

export interface LocaleUserConfig {
	/** The label for this language to show in UI, e.g. `"English"`, `"العربية"`, or `"简体中文"`. */
	label: string;
	/** The BCP-47 tag for this language, e.g. `"en"`, `"ar"`, or `"zh-CN"`. */
	lang?: string | undefined;
	/** The writing direction of this language; `"ltr"` for left-to-right (the default) or `"rtl"` for right-to-left. */
	dir?: 'rtl' | 'ltr' | undefined;
}

export function LocaleConfigSchema() {
	return z.object({
		label: z
			.string()
			.describe(
				'The label for this language to show in UI, e.g. `"English"`, `"العربية"`, or `"简体中文"`.'
			),
		lang: z
			.string()
			.optional()
			.describe('The BCP-47 tag for this language, e.g. `"en"`, `"ar"`, or `"zh-CN"`.'),
		dir: z
			.enum(['rtl', 'ltr'])
			.optional()
			.default('ltr')
			.describe(
				'The writing direction of this language; `"ltr"` for left-to-right (the default) or `"rtl"` for right-to-left.'
			),
	});
}
