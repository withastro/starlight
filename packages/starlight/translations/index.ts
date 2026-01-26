import { builtinI18nSchema } from '../schemas/i18n';
import en from './en.json';

const { parse } = builtinI18nSchema();

// English is loaded eagerly for type inference and as the fallback language.
const parsedEn = parse(en);

export type BuiltInStrings = typeof parsedEn;

/**
 * A map of language codes to functions that lazily load the built-in translations.
 * Only the languages that are actually used in the project will be loaded.
 */
const builtinTranslations: Record<string, () => Promise<BuiltInStrings>> = {
	en: () => Promise.resolve(parsedEn),
	cs: () => import('./cs.json').then((m) => parse(m.default)),
	es: () => import('./es.json').then((m) => parse(m.default)),
	ca: () => import('./ca.json').then((m) => parse(m.default)),
	de: () => import('./de.json').then((m) => parse(m.default)),
	ja: () => import('./ja.json').then((m) => parse(m.default)),
	pt: () => import('./pt.json').then((m) => parse(m.default)),
	fa: () => import('./fa.json').then((m) => parse(m.default)),
	fi: () => import('./fi.json').then((m) => parse(m.default)),
	fr: () => import('./fr.json').then((m) => parse(m.default)),
	gl: () => import('./gl.json').then((m) => parse(m.default)),
	he: () => import('./he.json').then((m) => parse(m.default)),
	id: () => import('./id.json').then((m) => parse(m.default)),
	it: () => import('./it.json').then((m) => parse(m.default)),
	nl: () => import('./nl.json').then((m) => parse(m.default)),
	da: () => import('./da.json').then((m) => parse(m.default)),
	th: () => import('./th.json').then((m) => parse(m.default)),
	tr: () => import('./tr.json').then((m) => parse(m.default)),
	ar: () => import('./ar.json').then((m) => parse(m.default)),
	nb: () => import('./nb.json').then((m) => parse(m.default)),
	zh: () => import('./zh-CN.json').then((m) => parse(m.default)),
	ko: () => import('./ko.json').then((m) => parse(m.default)),
	sv: () => import('./sv.json').then((m) => parse(m.default)),
	ro: () => import('./ro.json').then((m) => parse(m.default)),
	ru: () => import('./ru.json').then((m) => parse(m.default)),
	vi: () => import('./vi.json').then((m) => parse(m.default)),
	uk: () => import('./uk.json').then((m) => parse(m.default)),
	hi: () => import('./hi.json').then((m) => parse(m.default)),
	'zh-TW': () => import('./zh-TW.json').then((m) => parse(m.default)),
	pl: () => import('./pl.json').then((m) => parse(m.default)),
	sk: () => import('./sk.json').then((m) => parse(m.default)),
	lv: () => import('./lv.json').then((m) => parse(m.default)),
	hu: () => import('./hu.json').then((m) => parse(m.default)),
	el: () => import('./el.json').then((m) => parse(m.default)),
};

export default builtinTranslations;
