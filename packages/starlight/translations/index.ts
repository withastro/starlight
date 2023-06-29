import { builtinI18nSchema } from '../schemas/i18n';
import cs from './cs.json';
import en from './en.json';
import es from './es.json';
import de from './de.json';
import ja from './ja.json';
import pt from './pt.json';
import fr from './fr.json';
import it from './it.json';
import nl from './nl.json';
import da from './da.json';
import tr from './tr.json';

const { parse } = builtinI18nSchema();

export default Object.fromEntries(
  Object.entries({ cs, en, es, de, ja, pt, fr, it, nl, da, tr }).map(([key, dict]) => [
    key,
    parse(dict),
  ])
);
