export function addTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}
