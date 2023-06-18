const base = stripTrailingSlash(import.meta.env.BASE_URL);

/** Get the a root-relative URL path with the site’s `base` prefixed. */
export function pathWithBase(path: string) {
  let _path = stripLeadingSlash(stripTrailingSlash(path));
  return _path ? base + '/' + _path + '/' : base + '/';
}

/** Get the a root-relative file URL path with the site’s `base` prefixed. */
export function fileWithBase(path: string) {
  let _path = stripLeadingSlash(stripTrailingSlash(path));
  return _path ? base + '/' + _path : base;
}

function stripLeadingSlash(path: string) {
  return path.replace(/^\//, '');
}
function stripTrailingSlash(path: string) {
  return path.replace(/\/$/, '');
}
