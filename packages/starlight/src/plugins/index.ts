import type { StarlightPlugin } from '../utils/plugins';
import { starlightPluginFavicon } from './favicon';

/** Internal plugins built into Starlight. */
export const builtinPlugins: StarlightPlugin[] = [starlightPluginFavicon];
