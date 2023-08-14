import jiti from 'jiti';
import { URL } from 'url';

jiti(new URL('', import.meta.url).pathname)('./runner.ts');
