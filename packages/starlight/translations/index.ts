import { builtinI18nSchema } from '../schemas/i18n';
import cs from './cs.json';
import en from './en.json';
import es from './es.json';
import de from './de.json';
import ja from './ja.json';
import pt from './pt.json';
import fa from './fa.json';
import fr from './fr.json';
import it from './it.json';
import nl from './nl.json';
import da from './da.json';
import tr from './tr.json';
import ar from './ar.json';
import nb from './nb.json';
import zh from './zh.json';
import ko from './ko.json';
import sv from './sv.json';

const { parse } = builtinI18nSchema();

export default Object.fromEntries(
	Object.entries({ cs, en, es, de, ja, pt, fa, fr, it, nl, da, tr, ar, nb, zh, ko, sv }).map(
		([key, dict]) => [key, parse(dict)]
	)
);
