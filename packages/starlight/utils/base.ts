const base = stripTrailingSlash(import.meta.env.BASE_URL);

/** Get the a root-relative URL path with the site’s `base` prefixed. */
export function pathWithBase(path: string) {
  path = stripLeadingSlash(stripTrailingSlash(path));
  return path ? base + '/' + path + '/' : base + '/';
}

/** Get the a root-relative file URL path with the site’s `base` prefixed. */
export function fileWithBase(path: string) {
  path = stripLeadingSlash(stripTrailingSlash(path));
  return path ? base + '/' + path : base;
}

function stripLeadingSlash(path: string) {
  return path.replace(/^\//, '');
}
function stripTrailingSlash(path: string) {
  return path.replace(/\/$/, '');
}
