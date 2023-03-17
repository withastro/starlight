export function slugToParam(slug: string): string | undefined {
  return slug === 'index'
    ? undefined
    : slug.endsWith('/index')
    ? slug.replace('/index', '')
    : slug;
}

export function slugToPathname(slug: string): string {
  const param = slugToParam(slug);
  return param ? '/' + param + '/' : '/';
}
