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
  readonly resourceIndex?: number;
}

export interface IconifyApiGetSVGOptions
  extends
    Pick<IconifyApiGetSVGUrlOptions, 'prefix' | 'name'>,
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
  readonly timer: ReturnType<typeof setTimeout>;
}

// LIST ICON SETS

export interface IconifyApiListIconSetsOptions extends IconifyApiSharedFetchJSONOptions {
  readonly prefixes?: readonly string[];
}

export type IconifyApiCollectionsList = Record<string, IconifyInfo>;

// LIST ICONS

// --> raw

export interface IconifyApiRawListIconsOptions extends IconifyApiSharedFetchJSONOptions {
  readonly prefix: string;
  readonly info?: boolean;
  readonly chars?: boolean;
}

export interface IconifyApiRawListIconsResponse {
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

export type IconifyApiListIconsOptions = Pick<
  IconifyApiRawListIconsOptions,
  'prefix' | 'signal'
> & {
  readonly info?: boolean;
};

export interface IconifyApiIconListIconsIcon {
  readonly name: string;
  readonly categories: ReadonlySet<string>;
  readonly aliases: ReadonlySet<string>;
}

export type IconifyApiIconListIconsIcons = readonly IconifyApiIconListIconsIcon[];

export interface IconifyApiListIconsResult {
  readonly icons: IconifyApiIconListIconsIcons;
  readonly info?: IconifyInfo;
}

// SEARCH ICONS

export interface IconifyApiIconSearchOptions extends Pick<IconifyApiFetchOptions, 'signal'> {
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
    // TODO: default on infomaniak endpoint when available
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
  #listIcons({
    prefix,
    info,
    chars,
    pretty = false,
    ...options
  }: IconifyApiRawListIconsOptions): Promise<IconifyApiRawListIconsResponse> {
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
    string /* key: `<prefix>:<info>` */,
    Promise<IconifyApiListIconsResult>
  > = new Map<string, Promise<IconifyApiListIconsResult>>();

  /**
   * Lists the icons of a set with internal optimizations.
   */
  listIcons({
    prefix,
    signal,
    info,
  }: IconifyApiListIconsOptions): Promise<IconifyApiListIconsResult> {
    return new Promise<IconifyApiListIconsResult>(
      (
        resolve: (value: IconifyApiListIconsResult) => void,
        reject: (reason?: unknown) => void,
      ): void => {
        signal?.throwIfAborted();

        const cacheKey: string = `${prefix}:${String(info)}`;

        let cached: Promise<IconifyApiListIconsResult> | undefined =
          this.#listIconsCache.get(cacheKey);

        if (cached === undefined) {
          cached = this.#listIcons({
            prefix,
            info,
          })
            .then((response: IconifyApiRawListIconsResponse): IconifyApiListIconsResult => {
              const allIcons: Set<string> = new Set<string>();
              const iconNameToIconCategories: Map<string /* name */, Set<string>> = new Map<
                string,
                Set<string>
              >();
              const iconNameToAliases: Map<string /* name */, Set<string>> = new Map<
                string,
                Set<string>
              >();

              // Build reverse mapping: icon name -> set of aliases pointing to it
              if (response.aliases !== undefined) {
                for (const [aliasName, canonicalName] of Object.entries(response.aliases)) {
                  let aliases = iconNameToAliases.get(canonicalName);
                  if (aliases === undefined) {
                    aliases = new Set<string>();
                    iconNameToAliases.set(canonicalName, aliases);
                  }
                  aliases.add(aliasName);
                }
              }

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

              const icons: IconifyApiIconListIconsIcons = Array.from(
                allIcons,
                (name: string): IconifyApiIconListIconsIcon => {
                  return {
                    name,
                    categories: iconNameToIconCategories.get(name) ?? new Set<string>(),
                    aliases: iconNameToAliases.get(name) ?? new Set<string>(),
                  };
                },
              );

              return {
                icons,
                info: response.info,
              };
            })
            .catch((error: unknown): never => {
              this.#listIconsCache.delete(cacheKey);
              throw error;
            });

          this.#listIconsCache.set(cacheKey, cached);
        }

        const end = (): void => {
          signal?.removeEventListener('abort', onAbort);
        };

        const onAbort = (): void => {
          reject(signal!.reason);
        };

        signal?.addEventListener('abort', onAbort);

        cached.then(
          (value: IconifyApiListIconsResult): void => {
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
   * Searches icons in an optimized way.
   *
   * @example
   *
   * `cog` => returns icons having `cog` in their name or in their tags (a _tag_ is a category beginning with `#`).
   * `cog envelope` => returns icons having `cog` AND `envelope` in their name or in their tags.
   * `@ksuite` => returns icons having `@ksuite` as category.
   * `cog @ksuite` => returns icons having `cog` in their name or in their tags; AND having `@ksuite` as category.
   */
  async searchIcons({
    prefix,
    query = '',
    signal,
  }: IconifyApiIconSearchOptions): Promise<IconifyApiIconListIconsIcons> {
    const { icons }: IconifyApiListIconsResult = await this.listIcons({
      prefix,
      signal,
    });

    query = query.trim();

    if (query === '') {
      return icons;
    }

    const parts: readonly string[] = query.split(/\s+/g);

    return icons.filter(({ name, categories }: IconifyApiIconListIconsIcon): boolean => {
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

/* INTERNALS */

const DEFAULT_ICON_WIDTH = 16;
