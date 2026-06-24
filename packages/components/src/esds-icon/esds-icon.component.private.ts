import { IconifyApi } from '../iconify-api/iconify-api.ts';

const _apiCache = new Map<string, IconifyApi>();

export function _clearApiCache(): void {
  _apiCache.clear();
}

export function _getApiCacheSize(): number {
  return _apiCache.size;
}

export function getApi(endpoint: string = 'https://iconify.infomaniak.com'): IconifyApi {
  if (!_apiCache.has(endpoint)) {
    _apiCache.set(endpoint, new IconifyApi({ resources: [endpoint] }));
  }
  return _apiCache.get(endpoint)!;
}
