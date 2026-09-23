import type { StarlightRouteData } from './utils/routing/types';
export type { StarlightPageProps } from './utils/starlight-page';

/**
 * @deprecated The `Props` type is deprecated. If updating an override to use
 * `Astro.locals.starlightRoute` instead of `Astro.props`, import the new `StarlightRouteData`
 * type instead:
 * ```astro
 * ---
 * import type { StarlightRouteData } from '@astrojs/starlight/route-data';
 * ---
 * ```
 */
export type Props = StarlightRouteData;
