import { builtinI18nSchema } from '../schemas/i18n';
import ar from './ar.json';
import cs from './cs.json';
import da from './da.json';
import de from './de.json';
import en from './en.json';
import es from './es.json';
import fa from './fa.json';
import fr from './fr.json';
import he from './he.json';
import it from './it.json';
import ja from './ja.json';
import ko from './ko.json';
import nb from './nb.json';
import nl from './nl.json';
import pt from './pt.json';
import sv from './sv.json';
import tr from './tr.json';
import zh from './zh.json';

const { parse } = builtinI18nSchema();

export default Object.fromEntries(
	Object.entries({ ar, cs, da, de, en, es, fa, fr, he, it, ja, ko, nb, nl, pt, sv, tr, zh }).map(
		([key, dict]) => [key, parse(dict)]
	)
);
