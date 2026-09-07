/**
 * Vitest runs benchmarks in Node.js using Vite's module runner which transforms all module exports
 * into getters. With many repeated cross-module calls, this makes results unreliable because
 * export getters add overhead.
 *
 * To avoid the issue, we re-export every function we want to benchmark from this module and bundle
 * it as recommended in the Vitest documentation. During benchmarks, we reference the bundled
 * functions using an alias.
 *
 * @see https://vitest.dev/guide/benchmarking#module-runner-overhead
 */

export { getSidebar } from '../src/utils/navigation';
export { getRouteBySlugParam } from '../src/utils/routing';
export { generateRouteData } from '../src/utils/routing/data';
