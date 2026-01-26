import { builtinI18nSchema } from '../schemas/i18n';
import en from './en.json';
import ar from './ar.json';
import ca from './ca.json';
import cs from './cs.json';
import da from './da.json';
import de from './de.json';
import el from './el.json';
import es from './es.json';
import fa from './fa.json';
import fi from './fi.json';
import fr from './fr.json';
import gl from './gl.json';
import he from './he.json';
import hi from './hi.json';
import hu from './hu.json';
import id from './id.json';
import it from './it.json';
import ja from './ja.json';
import ko from './ko.json';
import lv from './lv.json';
import nb from './nb.json';
import nl from './nl.json';
import pl from './pl.json';
import pt from './pt.json';
import ro from './ro.json';
import ru from './ru.json';
import sk from './sk.json';
import sv from './sv.json';
import th from './th.json';
import tr from './tr.json';
import uk from './uk.json';
import vi from './vi.json';
import zhCN from './zh-CN.json';
import zhTW from './zh-TW.json';

const { parse } = builtinI18nSchema();

// English is loaded eagerly for type inference and as the fallback language.
const parsedEn = parse(en);

export type BuiltInStrings = typeof parsedEn;

/**
 * A map of language codes to functions that eagerly load the built-in translations.
 * All built-in translations are loaded eagerly to ensure robustness during the build process,
 * especially in Vite 6/Astro 5 environments where dynamic imports during configuration can fail.
 */
const builtinTranslations: Record<string, () => Promise<BuiltInStrings>> = {
	en: () => Promise.resolve(parsedEn),
	ar: () => Promise.resolve(parse(ar)),
	ca: () => Promise.resolve(parse(ca)),
	cs: () => Promise.resolve(parse(cs)),
	da: () => Promise.resolve(parse(da)),
	de: () => Promise.resolve(parse(de)),
	el: () => Promise.resolve(parse(el)),
	es: () => Promise.resolve(parse(es)),
	fa: () => Promise.resolve(parse(fa)),
	fi: () => Promise.resolve(parse(fi)),
	fr: () => Promise.resolve(parse(fr)),
	gl: () => Promise.resolve(parse(gl)),
	he: () => Promise.resolve(parse(he)),
	hi: () => Promise.resolve(parse(hi)),
	hu: () => Promise.resolve(parse(hu)),
	id: () => Promise.resolve(parse(id)),
	it: () => Promise.resolve(parse(it)),
	ja: () => Promise.resolve(parse(ja)),
	ko: () => Promise.resolve(parse(ko)),
	lv: () => Promise.resolve(parse(lv)),
	nb: () => Promise.resolve(parse(nb)),
	nl: () => Promise.resolve(parse(nl)),
	pl: () => Promise.resolve(parse(pl)),
	pt: () => Promise.resolve(parse(pt)),
	ro: () => Promise.resolve(parse(ro)),
	ru: () => Promise.resolve(parse(ru)),
	sk: () => Promise.resolve(parse(sk)),
	sv: () => Promise.resolve(parse(sv)),
	th: () => Promise.resolve(parse(th)),
	tr: () => Promise.resolve(parse(tr)),
	uk: () => Promise.resolve(parse(uk)),
	vi: () => Promise.resolve(parse(vi)),
	zh: () => Promise.resolve(parse(zhCN)),
	'zh-TW': () => Promise.resolve(parse(zhTW)),
};

export default builtinTranslations;
