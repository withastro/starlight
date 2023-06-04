import { i18nSchema } from '../schemas/i18n';
import en from './en.json';
import es from './es.json';
import de from './de.json';
import ja from './ja.json';
import pt from './pt.json';

const parse = i18nSchema().required().strict().parse;

export default Object.fromEntries(
  Object.entries({ en, es, de, ja, pt }).map(([key, dict]) => [key, parse(dict)])
);
