import { type ExtendedIconifyIcon, type IconifyInfo, type IconifyJSON } from '@iconify/types';

/* TYPES */

// FETCH

export interface IconifyApiFetchOptions extends Omit<RequestInit, 'body'> {
  readonly path: string;
  readonly searchParams?: URLSearchParams;
  readonly body?: object | null;
}

export interface IconifyApiSharedFetchJSONOptions extends Pick<IconifyApiFetchOptions, 'signal'> {
  readonly pretty?: boolean;
}

// GET SVG

export interface IconifyApiGetSVGUrlOptions {
  readonly prefix: string;
  readonly name: string;
  readonly color?: string;
  readonly width?: string | number;
  readonly height?: string | number;
  readonly flip?: string;
  readonly rotate?: string | number;
  readonly download?: boolean;
  readonly box?: boolean;
  readonly ressourceIndex?: number;
}

export interface IconifyApiGetSVGOptions
  extends Omit<IconifyApiGetSVGUrlOptions, 'download'>,
    Pick<IconifyApiFetchOptions, 'signal'> {}

export interface IconifyApiGetSVGOptimizedOptions
  extends Pick<IconifyApiGetSVGUrlOptions, 'prefix' | 'name'>,
    Pick<IconifyApiFetchOptions, 'signal'> {}

// GET ICONS DATA

export interface IconifyApiGetIconsDataOptions extends IconifyApiSharedFetchJSONOptions {
  readonly prefix: string;
  readonly icons: readonly string[];
}

interface CachedSVGsEntry {
  readonly controller: AbortController;
  readonly promise: Promise<string>;
  count: number;
}

interface RequestedSVGsEntry {
  readonly names: Set<string>;
  readonly controller: AbortController;
  readonly promise: Promise<IconifyJSON>;
  readonly timer: any;
}

// LIST ICON SETS

export interface IconifyApiListIconSetsOptions extends IconifyApiSharedFetchJSONOptions {
  readonly prefixes?: readonly string[];
}

export type IconifyApiCollectionsList = Record<string, IconifyInfo>;

// LIST ICONS

export interface IconifyApiListIconsOptions extends IconifyApiSharedFetchJSONOptions {
  readonly prefix: string;
  readonly info?: boolean;
  readonly chars?: boolean;
}

export interface IconifyApiListIconsResponse {
  readonly prefix: string;
  readonly total: number;
  readonly title?: string;
  readonly info?: IconifyInfo;
  readonly uncategorized?: readonly string[];
  readonly categories?: Record<string, string[]>;
  readonly hidden?: readonly string[];
  readonly aliases?: Record<string, string>;
  readonly chars?: Record<string, string>;
  readonly themes?: IconifyJSON['themes'];
  readonly prefixes?: IconifyJSON['prefixes'];
  readonly suffixes?: IconifyJSON['suffixes'];
}

// -> optimized

export interface IconifyApiIconListIconsOptimizedIcon {
  readonly name: string;
  readonly categories: ReadonlySet<string>;
}

export type IconifyApiIconListIconsOptimizedIcons = readonly IconifyApiIconListIconsOptimizedIcon[];

// SEARCH ICONS

export interface IconifyApiSearchIconsOptions extends IconifyApiSharedFetchJSONOptions {
  readonly query: string;
  readonly limit?: number;
  readonly start?: number;
  readonly prefixes?: readonly string[];
  readonly category?: string;
}

export interface IconifyApiSearchIconsResponse {
  readonly icons: readonly string[];
  readonly total: number;
  readonly limit: number;
  readonly start: number;
  readonly collections: Record<string, IconifyInfo>;
  readonly request: Record<string, string>;
}

// -> optimized

export interface IconifyApiIconSearchOptimizedOptions
  extends Pick<IconifyApiFetchOptions, 'signal'> {
  readonly prefix: string;
  readonly query?: string;
}

// CONSTRUCTOR

export interface IconifyApiOptions {
  readonly resources?: readonly string[];
  readonly rotate?: number;
  readonly timeout?: number;
  readonly bulkDebounce?: number;
}

/* CLASS */

export class IconifyApi {
  readonly resources: readonly string[];
  readonly rotate: number;
  readonly timeout: number;
  readonly bulkDebounce: number;

  constructor({
    resources = ['https://api.iconify.design'],
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

  async #fetchJSON<GReturn>(options: IconifyApiFetchOptions): Promise<GReturn> {
    return (await (await this.#fetch(options)).json()) as GReturn;
  }

  /**
   * Returns the url to fetch an SVG.
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
    ressourceIndex = 0,
  }: IconifyApiGetSVGUrlOptions): URL {
    if (!(0 <= ressourceIndex && ressourceIndex < this.resources.length)) {
      throw new RangeError(`\`ressourceIndex\` must be in range [0, ${this.resources.length}[`);
    }

    const url = new URL(
      `${this.resources[ressourceIndex]}/${encodeURIComponent(prefix)}/${encodeURIComponent(name)}.svg`,
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
   * Gets the content of an SVG.
   */
  async getSVG({ signal, ...options }: IconifyApiGetSVGOptions): Promise<string> {
    const url: URL = this.getSVGUrl(options);

    return await (
      await this.#fetch({
        path: url.pathname,
        searchParams: url.searchParams,
        signal,
      })
    ).text();
  }

  // => OPTIMIZED

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
  getSVGOptimized({ prefix, name, signal }: IconifyApiGetSVGOptimizedOptions): Promise<string> {
    return new Promise<string>(
      (resolve: (value: string) => void, reject: (reason?: any) => void): void => {
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
  #requestSVG({ prefix, name, signal }: IconifyApiGetSVGOptimizedOptions): Promise<string> {
    return new Promise<string>(
      (resolve: (value: string) => void, reject: (reason?: any) => void): void => {
        signal?.throwIfAborted();

        let requestedSVGs: RequestedSVGsEntry | undefined = this.#requestedSVGs.get(prefix);

        if (requestedSVGs === undefined) {
          const names: Set<string> = new Set<string>();

          const controller: AbortController = new AbortController();

          const { promise, resolve, reject }: PromiseWithResolvers<IconifyJSON> =
            Promise.withResolvers<IconifyJSON>();

          const timer: any = setTimeout((): void => {
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
            const width: number = icon.width ?? result.width ?? 16;
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
   * Lists the icon sets.
   *
   * @inheritDoc https://iconify.design/docs/api/collections.html
   */
  listIconSets({
    prefixes = [],
    pretty = false,
    ...options
  }: IconifyApiListIconSetsOptions = {}): Promise<IconifyApiCollectionsList> {
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

  readonly #listIconsCache: Map<
    string /* prefix */,
    Promise<IconifyApiIconListIconsOptimizedIcons>
  > = new Map<string, Promise<IconifyApiIconListIconsOptimizedIcons>>();

  listIconsOptimized({
    prefix,
    signal,
  }: Pick<
    IconifyApiListIconsOptions,
    'prefix' | 'signal'
  >): Promise<IconifyApiIconListIconsOptimizedIcons> {
    return new Promise<IconifyApiIconListIconsOptimizedIcons>(
      (
        resolve: (value: IconifyApiIconListIconsOptimizedIcons) => void,
        reject: (reason?: any) => void,
      ): void => {
        signal?.throwIfAborted();

        const key: string = prefix;

        let cached: Promise<IconifyApiIconListIconsOptimizedIcons> | undefined =
          this.#listIconsCache.get(key);

        if (cached === undefined) {
          cached = this.listIcons({
            prefix,
          })
            .then(
              (response: IconifyApiListIconsResponse): IconifyApiIconListIconsOptimizedIcons => {
                const allIcons: Set<string> = new Set<string>();
                const iconNameToIconCategories: Map<string /* name */, Set<string>> = new Map<
                  string,
                  Set<string>
                >();

                if (response.uncategorized !== undefined) {
                  for (const icon of response.uncategorized) {
                    allIcons.add(icon);
                  }
                }

                if (response.categories !== undefined) {
                  for (const [category, icons] of Object.entries(response.categories)) {
                    for (const icon of icons) {
                      allIcons.add(icon);

                      let categories: Set<string> | undefined = iconNameToIconCategories.get(icon);
                      if (categories === undefined) {
                        categories = new Set<string>();
                        iconNameToIconCategories.set(icon, categories);
                      }
                      categories.add(category);
                    }
                  }
                }

                return Array.from(
                  allIcons,
                  (name: string): IconifyApiIconListIconsOptimizedIcon => {
                    return {
                      name,
                      categories: iconNameToIconCategories.get(name) ?? new Set<string>(),
                    };
                  },
                );
              },
            )
            .catch((error: unknown): never => {
              this.#listIconsCache.delete(key);
              throw error;
            });

          this.#listIconsCache.set(key, cached);
        }

        const end = (): void => {
          signal?.removeEventListener('abort', onAbort);
        };

        const onAbort = (): void => {
          reject(signal!.reason);
        };

        signal?.addEventListener('abort', onAbort);

        cached.then(
          (value: IconifyApiIconListIconsOptimizedIcons): void => {
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

  // SEARCH

  /**
   * Searches icons.
   *
   * @inheritDoc https://iconify.design/docs/api/search.html
   */
  searchIcons({
    query,
    limit = 999,
    start = 0,
    prefixes = [],
    category,
    pretty = false,
    ...options
  }: IconifyApiSearchIconsOptions): Promise<IconifyApiSearchIconsResponse> {
    const searchParams = new URLSearchParams();

    searchParams.set('query', query);

    if (limit !== undefined) {
      searchParams.set('limit', limit.toString(10));
    }

    if (start !== undefined) {
      searchParams.set('start', start.toString(10));
    }

    if (prefixes.length > 0) {
      searchParams.set('prefixes', prefixes.join(','));
    }

    if (category !== undefined) {
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

  // SEARCH OPTIMIZED

  /**
   * Searches icons in an optimized way.
   *
   * @example
   *
   * `cog` => returns icons having `cog` in their name or in their tags (a _tag_ is a category beginning with `#`).
   * `cog envelope` => returns icons having `cog` AND `envelope` in their name or in their tags.
   * `@ksuite` => returns icons having `@ksuite` as category.
   * `cog @ksuite` => returns icons having `cog` in their name or in their tags; AND having `@ksuite` as category.
   */
  async searchIconsOptimized({
    prefix,
    query = '',
    signal,
  }: IconifyApiIconSearchOptimizedOptions): Promise<IconifyApiIconListIconsOptimizedIcons> {
    const icons: IconifyApiIconListIconsOptimizedIcons = await this.listIconsOptimized({
      prefix,
      signal,
    });

    query = query.trim();

    if (query === '') {
      return icons;
    }

    const parts: readonly string[] = query.split(/\s+/g);

    return icons.filter(({ name, categories }: IconifyApiIconListIconsOptimizedIcon): boolean => {
      const lowercaseName: string = name.toLowerCase();

      return parts.every((part: string): boolean => {
        const lowercasePart: string = part.toLowerCase();

        if (/^[a-zA-Z#]/.test(part)) {
          // └> prefixed with a letter or #
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
