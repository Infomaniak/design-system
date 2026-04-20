import { type ExtendedIconifyIcon, type IconifyJSON } from '@iconify/types';
import type { IconifyApiGetIconsDataOptions } from './types/api/get-icons-data/iconify-api-get-icons-data-options.ts';
import type { IconifyApiGetSVGUrlOptions } from './types/api/get-svg-url/iconify-api-get-svg-url-options.ts';
import type {
  IconifyApiFetchJSONOptions,
  IconifyApiFetchOptions,
} from './types/api/iconify-api-fetch-options.ts';
import type { IconifyApiGetLastModifiedOptions } from './types/api/last-modified/iconify-api-get-last-modified-options.ts';
import type { IconifyApiGetLastModifiedResponse } from './types/api/last-modified/iconify-api-get-last-modified-response.ts';
import type { IconifyApiListIconSetsOptions } from './types/api/list-icon-sets/iconify-api-list-icon-sets-options.ts';
import type { IconifyApiListIconSetsResponse } from './types/api/list-icon-sets/iconify-api-list-icon-sets-response.ts';
import type { IconifyApiListIconsOptions } from './types/api/list-icons/iconify-api-list-icons-options.ts';
import type { IconifyApiListIconsResponse } from './types/api/list-icons/iconify-api-list-icons-response.ts';
import type { IconifyApiSearchIconsOptions } from './types/api/search-icons/iconify-api-search-icons-options.ts';
import type { IconifyApiSearchIconsResponse } from './types/api/search-icons/iconify-api-search-icons-response.ts';
import type { IconifyApiGetSVGOptions } from './types/custom/get-svg/iconify-api-get-svg-options.ts';
import {
  type IconifyApiIconList,
  type IconifyApiIconListIcon,
} from './types/custom/search/icon-list/iconify-api-icon-list.ts';
import { iconifyApiListIconsResponseToIconifyApiIconList } from './types/custom/search/icon-list/iconify-api-list-icons-response-to-iconify-api-icon-list.ts';
import type { IconifyApiSearchOptions } from './types/custom/search/iconify-api-search-options.ts';

export interface IconifyApiOptions {
  readonly resources?: readonly string[];
  readonly rotate?: number;
  readonly timeout?: number;
  readonly bulkDebounce?: number;
}

export class IconifyApi {
  readonly resources: readonly string[];
  readonly rotate: number;
  readonly timeout: number;
  readonly bulkDebounce: number;

  constructor({
    resources = ['https://iconify.infomaniak.com'],
    rotate = 750,
    timeout = 5000,
    bulkDebounce = 10,
  }: IconifyApiOptions = {}) {
    if (resources.length === 0) {
      throw new Error('Expect at least one `resources`.');
    }

    if (rotate <= 0) {
      throw new RangeError('`rotate` must be in range ]0, Infinity[.');
    }

    if (timeout <= 0) {
      throw new RangeError('`timeout` must be in range ]0, Infinity[.');
    }

    this.resources = resources;
    this.rotate = rotate;
    this.timeout = timeout;
    this.bulkDebounce = bulkDebounce;
  }

  /*
    ==================== API ====================

    Contains the list of possible API calls.
  */

  /**
   * Performs http requests iterating on `this.resources` until one succeed.
   */
  async #fetch({
    path: rawPath,
    searchParams,
    body: jsonBody,
    headers: rawHeaders,
    signal,
    ...options
  }: IconifyApiFetchOptions): Promise<Response> {
    let path: string = rawPath;

    if (searchParams !== undefined) {
      if (rawPath.includes('?')) {
        throw new Error('Cannot provide search params inside the path. Use `searchParams`.');
      }
      const searchParamsAsString: string = searchParams.toString();
      if (searchParamsAsString !== '') {
        path = `${rawPath}?${searchParamsAsString}`;
      }
    }

    let body: string | null = null;
    const headers: Headers = new Headers(rawHeaders);

    if (jsonBody !== undefined) {
      body = JSON.stringify(jsonBody);
      headers.set('content-type', 'application/json');
    }

    const sharedSignal = signal
      ? AbortSignal.any([signal, AbortSignal.timeout(this.timeout)])
      : AbortSignal.timeout(this.timeout);

    for (const resource of this.resources) {
      const url = new URL(path, resource);

      try {
        const response: Response = await fetch(url, {
          ...options,
          body,
          headers,
          signal: AbortSignal.any([sharedSignal, AbortSignal.timeout(this.rotate)]),
        });

        if (response.ok) {
          return response;
        }
      } catch (error: unknown) {
        if (!signal?.aborted) {
          console.warn(error);
        }
      }
    }

    throw new Error(`Unable to fetch api: ${path}.`);
  }

  async #fetchJSON<GReturn>({
    expectNumberResponse,
    ...options
  }: IconifyApiFetchJSONOptions): Promise<GReturn> {
    const response: unknown = await (await this.#fetch(options)).json();

    if (typeof response === 'number' && !expectNumberResponse) {
      throw new Error(`fetch failed with error code: ${response}`);
    }

    return response as GReturn;
  }

  /**
   * Returns the url to fetch an SVG.
   *
   * @inheritDoc https://iconify.design/docs/api/svg.html
   */
  getSVGUrl({
    prefix,
    name,
    color,
    width,
    height,
    flip,
    rotate,
    download,
    box,
    resourceIndex = 0,
  }: IconifyApiGetSVGUrlOptions): URL {
    if (!(0 <= resourceIndex && resourceIndex < this.resources.length)) {
      throw new RangeError(`\`resourceIndex\` must be in range [0, ${this.resources.length}[`);
    }

    const url = new URL(
      `${this.resources[resourceIndex]}/${encodeURIComponent(prefix)}/${encodeURIComponent(name)}.svg`,
    );

    if (color !== undefined) {
      url.searchParams.set('color', color);
    }

    if (width !== undefined) {
      url.searchParams.set('width', String(width));
    }

    if (height !== undefined) {
      url.searchParams.set('height', String(height));
    }

    if (flip !== undefined) {
      url.searchParams.set('flip', flip);
    }

    if (rotate !== undefined) {
      url.searchParams.set('rotate', String(rotate));
    }

    if (download) {
      url.searchParams.set('download', '1');
    }

    if (box) {
      url.searchParams.set('box', '1');
    }

    return url;
  }

  /**
   * Loads many icons data in bulk.
   *
   * @inheritDoc https://iconify.design/docs/api/icon-data.html
   */
  getIconsData({
    prefix,
    icons,
    pretty = false,
    ...options
  }: IconifyApiGetIconsDataOptions): Promise<IconifyJSON> {
    const searchParams = new URLSearchParams();

    if (icons.length > 0) {
      searchParams.set('icons', icons.join(','));
    } else {
      throw new Error('Must have at least one icon.');
    }

    if (pretty) {
      searchParams.set('pretty', '1');
    }

    return this.#fetchJSON({
      ...options,
      path: `/${prefix}.json`,
      searchParams,
    });
  }

  /**
   * Lists the `lastModified` properties of Iconify collections.
   *
   * @inheritDoc https://iconify.design/docs/api/last-modified.html#query
   */
  getLastModified({
    prefixes = [],
    pretty = false,
    ...options
  }: IconifyApiGetLastModifiedOptions): Promise<IconifyApiGetLastModifiedResponse> {
    const searchParams = new URLSearchParams();

    if (prefixes.length > 0) {
      searchParams.set('prefixes', prefixes.join(','));
    }

    if (pretty) {
      searchParams.set('pretty', '1');
    }

    return this.#fetchJSON({
      ...options,
      path: '/last-modified',
      searchParams,
    });
  }

  /**
   * Lists the icon sets.
   *
   * @inheritDoc https://iconify.design/docs/api/collections.html
   */
  listIconSets({
    prefixes = [],
    pretty = false,
    ...options
  }: IconifyApiListIconSetsOptions = {}): Promise<IconifyApiListIconSetsResponse> {
    const searchParams = new URLSearchParams();

    if (prefixes.length > 0) {
      searchParams.set('prefixes', prefixes.join(','));
    }

    if (pretty) {
      searchParams.set('pretty', '1');
    }

    return this.#fetchJSON({
      ...options,
      path: '/collections',
      searchParams,
    });
  }

  /**
   * Lists the icons of a set.
   *
   * @inheritDoc https://iconify.design/docs/api/collection.html
   */
  listIcons({
    prefix,
    info,
    chars,
    pretty = false,
    ...options
  }: IconifyApiListIconsOptions): Promise<IconifyApiListIconsResponse> {
    const searchParams = new URLSearchParams();

    searchParams.set('prefix', prefix);

    if (info) {
      searchParams.set('info', '1');
    }

    if (chars) {
      searchParams.set('chars', '1');
    }

    if (pretty) {
      searchParams.set('pretty', '1');
    }

    return this.#fetchJSON({
      ...options,
      path: '/collection',
      searchParams,
    });
  }

  readonly #cachedListIcons: Map<string /* cache key */, CachedIconifyApiListIconsResponse> =
    new Map();

  /**
   * Lists the icons of a set - uses cache, if any.
   *
   * @see listIcons
   */
  listIconsCached({
    prefix,
    info = false,
    chars = false,
    signal,
  }: Omit<IconifyApiListIconsOptions, 'pretty'>): Promise<IconifyApiListIconsResponse> {
    return new Promise<IconifyApiListIconsResponse>(
      (
        resolve: (value: IconifyApiListIconsResponse) => void,
        reject: (reason?: unknown) => void,
      ): void => {
        signal?.throwIfAborted();

        const key: string = JSON.stringify([prefix, info, chars]);

        let cached: CachedIconifyApiListIconsResponse | undefined = this.#cachedListIcons.get(key);

        if (cached === undefined) {
          const controller: AbortController = new AbortController();
          const signal: AbortSignal = controller.signal;

          const promise: Promise<IconifyApiListIconsResponse> = this.listIcons({
            prefix,
            info,
            chars,
            signal,
          }).catch((error: unknown): never => {
            if (!signal.aborted) {
              this.#cachedListIcons.delete(key);
            }
            throw error;
          });

          cached = {
            controller,
            promise,
            count: 0,
          };

          this.#cachedListIcons.set(key, cached);
        }

        cached.count++;

        const end = (): void => {
          signal?.removeEventListener('abort', onAbort);
        };

        const onAbort = (): void => {
          cached!.count--;
          if (cached.count === 0) {
            cached!.controller.abort();
            this.#cachedListIcons.delete(key);
          }

          reject(signal!.reason);
        };

        signal?.addEventListener('abort', onAbort);

        cached.promise.then(
          (value: IconifyApiListIconsResponse): void => {
            end();
            resolve(value);
          },
          (reason: unknown): void => {
            end();
            reject(reason);
          },
        );
      },
    );
  }

  /**
   * Clears the cached `listIcons` responses.
   *
   * @see listIcons
   */
  clearListIconsCache(): void {
    this.#cachedListIcons.clear();
  }

  /**
   * Search icons.
   *
   * @inheritDoc https://iconify.design/docs/api/search.html
   */
  searchIcons({
    query,
    limit,
    start,
    prefixes = [],
    category,
    pretty = false,
    ...options
  }: IconifyApiSearchIconsOptions): Promise<IconifyApiSearchIconsResponse> {
    const searchParams = new URLSearchParams();

    searchParams.set('query', query);

    if (limit !== undefined) {
      searchParams.set('limit', String(limit));
    }

    if (start !== undefined) {
      searchParams.set('start', String(start));
    }

    if (prefixes.length > 0) {
      searchParams.set('prefixes', prefixes.join(','));
    }

    if (category) {
      searchParams.set('category', category);
    }

    if (pretty) {
      searchParams.set('pretty', '1');
    }

    return this.#fetchJSON({
      ...options,
      path: '/search',
      searchParams,
    });
  }

  /*
    ==================== CUSTOM ====================

    Contains a list of "helper" methods.
    You'll usually prefer to use these methods instead of the direct "API" call
  */

  // CACHED SVGs

  readonly #cachedSvg: Map<string /* key: `<prefix>:<name>` */, CachedSVGsEntry> = new Map<
    string,
    CachedSVGsEntry
  >();

  /**
   * Gets the content of an SVG with an optimized process:
   *
   * - caches the SVGs
   * - load them in bulk
   */
  getSVG({ prefix, name, signal }: IconifyApiGetSVGOptions): Promise<string> {
    return new Promise<string>(
      (resolve: (value: string) => void, reject: (reason?: unknown) => void): void => {
        signal?.throwIfAborted();

        const key: string = `${prefix}:${name}`;

        let cached: CachedSVGsEntry | undefined = this.#cachedSvg.get(key);

        if (cached === undefined) {
          const controller: AbortController = new AbortController();
          const signal: AbortSignal = controller.signal;

          const promise: Promise<string> = this.#requestSVG({
            prefix,
            name,
            signal,
          }).catch((error: unknown): never => {
            if (!signal.aborted) {
              this.#cachedSvg.delete(key);
            }
            throw error;
          });

          cached = {
            controller,
            promise,
            count: 0,
          };

          this.#cachedSvg.set(key, cached);
        }

        cached.count++;

        const end = (): void => {
          signal?.removeEventListener('abort', onAbort);
        };

        const onAbort = (): void => {
          cached!.count--;
          if (cached.count === 0) {
            cached!.controller.abort();
            this.#cachedSvg.delete(key);
          }

          reject(signal!.reason);
        };

        signal?.addEventListener('abort', onAbort);

        cached.promise.then(
          (value: string): void => {
            end();
            resolve(value);
          },
          (reason: unknown): void => {
            end();
            reject(reason);
          },
        );
      },
    );
  }

  #requestedSVGs: Map<string /* prefix */, RequestedSVGsEntry> = new Map<
    string,
    RequestedSVGsEntry
  >();

  /**
   * Gets the content of an SVG with an optimized process:
   *  debounce individual requests to perform a "grouped/bulk" request.
   */
  #requestSVG({ prefix, name, signal }: IconifyApiGetSVGOptions): Promise<string> {
    return new Promise<string>(
      (resolve: (value: string) => void, reject: (reason?: unknown) => void): void => {
        signal?.throwIfAborted();

        let requestedSVGs: RequestedSVGsEntry | undefined = this.#requestedSVGs.get(prefix);

        if (requestedSVGs === undefined) {
          const names: Set<string> = new Set<string>();

          const controller: AbortController = new AbortController();

          const { promise, resolve, reject }: PromiseWithResolvers<IconifyJSON> =
            Promise.withResolvers<IconifyJSON>();

          const timer: ReturnType<typeof setTimeout> = setTimeout((): void => {
            this.#requestedSVGs.delete(prefix);
            if (names.size > 0) {
              this.getIconsData({
                prefix,
                icons: Array.from(names),
                signal: controller.signal,
              }).then(resolve, reject);
            } else {
              reject(new Error('Nothing to load.'));
            }
          }, this.bulkDebounce);

          requestedSVGs = {
            names,
            controller,
            promise,
            timer,
          };

          this.#requestedSVGs.set(prefix, requestedSVGs);
        }

        requestedSVGs.names.add(name);

        const end = (): void => {
          signal?.removeEventListener('abort', onAbort);
        };

        const onAbort = (): void => {
          end();

          requestedSVGs.names.delete(name);
          if (requestedSVGs!.names.size === 0) {
            clearTimeout(requestedSVGs!.timer);
            requestedSVGs!.controller.abort();
            this.#requestedSVGs.delete(prefix);
          }

          reject(signal!.reason);
        };

        signal?.addEventListener('abort', onAbort);

        requestedSVGs.promise
          .then((result: IconifyJSON): string => {
            if (!Reflect.has(result.icons, name)) {
              throw new Error(`Missing icon: ${name}.`);
            }

            const icon: ExtendedIconifyIcon = result.icons[name];
            const width: number = icon.width ?? result.width ?? DEFAULT_ICON_WIDTH;
            const height: number = icon.height ?? result.height ?? width;

            return `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 ${width} ${height}">${icon.body}</svg>`;
          })
          .then(
            (value: string): void => {
              end();
              resolve(value);
            },
            (reason: unknown): void => {
              end();
              reject(reason);
            },
          );
      },
    );
  }

  /**
   * Clears the cached `getSVG` responses.
   *
   * @see getSVG
   */
  clearSVGsCache(): void {
    this.#cachedSvg.clear();
    this.#requestedSVGs.clear();
  }

  // SEARCH

  /**
   * Searches icons in a more flexible and performant way.
   *
   * @example
   *
   * `cog` => returns icons having `cog` in their name or in their tags (a _tag_ is a category beginning with `#`).
   * `cog envelope` => returns icons having `cog` AND `envelope` in their name or in their tags.
   * `@ksuite` => returns icons having `@ksuite` as category.
   * `cog @ksuite` => returns icons having `cog` in their name or in their tags; AND having `@ksuite` as category.
   */
  async search({
    prefix,
    query = '',
    signal,
  }: IconifyApiSearchOptions): Promise<IconifyApiIconList> {
    const icons: IconifyApiIconList = iconifyApiListIconsResponseToIconifyApiIconList(
      await this.listIconsCached({
        prefix,
        signal,
      }),
    );

    query = query.trim();

    if (query === '') {
      return icons;
    }

    const parts: readonly string[] = query.split(/\s+/g);

    return icons.filter(({ name, categories }: IconifyApiIconListIcon): boolean => {
      const lowercaseName: string = name.toLowerCase();

      return parts.every((part: string): boolean => {
        const lowercasePart: string = part.toLowerCase();

        if (/^[a-zA-Z0-9#]/.test(part)) {
          // └> prefixed with an alphanumeric char or #
          return (
            // search in name
            lowercaseName.includes(lowercasePart) ||
            // and in tags
            Array.from(categories).some((category: string): boolean => {
              return category.startsWith('#') && category.toLowerCase().includes(lowercasePart);
            })
          );
        } else {
          // └> prefixed with a "special" symbol
          // search in categories
          return Array.from(categories).some((category: string): boolean => {
            return category.toLowerCase().startsWith(lowercasePart);
          });
        }
      });
    });
  }
}

/* INTERNALS */

const DEFAULT_ICON_WIDTH = 16;

// CACHED LIST

interface CachedIconifyApiListIconsResponse {
  readonly controller: AbortController;
  readonly promise: Promise<IconifyApiListIconsResponse>;
  count: number;
}

// CACHED SVGs

interface CachedSVGsEntry {
  readonly controller: AbortController;
  readonly promise: Promise<string>;
  count: number;
}

interface RequestedSVGsEntry {
  readonly names: Set<string>;
  readonly controller: AbortController;
  readonly promise: Promise<IconifyJSON>;
  readonly timer: ReturnType<typeof setTimeout>;
}
