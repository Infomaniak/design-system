import { type IconifyInfo } from '@iconify/types';

const BASE_URL =
  import.meta.env['VITE_ICONIFY_API_URL'] ?? 'https://iconify.preprod.dev.infomaniak.ch/';
const DEFAULT_TIMEOUT_MS = 10_000;

export interface IconifyApiFetchOptions {
  readonly path: string;
  readonly searchParams?: URLSearchParams;
  readonly signal?: AbortSignal;
}

export interface IconifyApiListIconSetsOptions {
  readonly prefixes?: readonly string[];
  readonly pretty?: boolean;
  readonly signal?: AbortSignal;
}

export type IconifyApiCollectionsList = Record<string, IconifyInfo>;

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
}

export interface IconifyApiIconListIconsOptimizedIcon {
  readonly name: string;
  readonly categories: ReadonlySet<string>;
}

export type IconifyApiIconListIconsOptimizedIcons = readonly IconifyApiIconListIconsOptimizedIcon[];

export interface IconifyApiListIconsOptions {
  readonly prefix: string;
  readonly signal?: AbortSignal;
}

export class IconifyApi {
  readonly #timeout: number;

  constructor(timeout: number = DEFAULT_TIMEOUT_MS) {
    this.#timeout = timeout;
  }

  private async fetch<T>({ path, searchParams, signal }: IconifyApiFetchOptions): Promise<T> {
    let urlPath = path;

    if (searchParams !== undefined && searchParams.toString() !== '') {
      urlPath = `${path}?${searchParams.toString()}`;
    }

    const url = new URL(urlPath, BASE_URL);

    const timeoutSignal = AbortSignal.timeout(this.#timeout);
    const combinedSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;

    try {
      const response = await fetch(url, {
        signal: combinedSignal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Request failed`, { cause: error });
    }
  }

  /**
   * Lists the icon sets.
   *
   * @inheritDoc https://iconify.design/docs/api/collections.html
   */
  async listIconSets({
    prefixes = [],
    pretty = false,
    signal,
  }: IconifyApiListIconSetsOptions = {}): Promise<IconifyApiCollectionsList> {
    const searchParams = new URLSearchParams();

    if (prefixes.length > 0) {
      searchParams.set('prefixes', prefixes.join(','));
    }

    if (pretty) {
      searchParams.set('pretty', '1');
    }

    return this.fetch<IconifyApiCollectionsList>({
      path: '/collections',
      searchParams,
      signal,
    });
  }

  /**
   * Lists the icons of a set.
   *
   * @inheritDoc https://iconify.design/docs/api/collection.html
   */
  private async listIcons({
    prefix,
    signal,
  }: IconifyApiListIconsOptions): Promise<IconifyApiListIconsResponse> {
    const searchParams = new URLSearchParams();

    searchParams.set('prefix', prefix);

    return this.fetch<IconifyApiListIconsResponse>({
      path: '/collection',
      searchParams,
      signal,
    });
  }

  readonly #listIconsCache: Map<
    string /* prefix */,
    Promise<IconifyApiIconListIconsOptimizedIcons>
  > = new Map<string, Promise<IconifyApiIconListIconsOptimizedIcons>>();

  async listIconsOptimized({
    prefix,
    signal,
  }: IconifyApiListIconsOptions): Promise<IconifyApiIconListIconsOptimizedIcons> {
    signal?.throwIfAborted();

    const key: string = prefix;

    let cached: Promise<IconifyApiIconListIconsOptimizedIcons> | undefined =
      this.#listIconsCache.get(key);

    if (cached === undefined) {
      cached = this.listIcons({
        prefix,
        signal,
      })
        .then((response: IconifyApiListIconsResponse): IconifyApiIconListIconsOptimizedIcons => {
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

          return Array.from(allIcons, (name: string): IconifyApiIconListIconsOptimizedIcon => {
            return {
              name,
              categories: iconNameToIconCategories.get(name) ?? new Set<string>(),
            };
          });
        })
        .catch((error: unknown): never => {
          this.#listIconsCache.delete(key);
          throw error;
        });

      this.#listIconsCache.set(key, cached);
    }

    // Always cleanup listener when promise settles
    return cached.finally(() => {
      // Cleanup is handled by the signal's abort handler
    });
  }
}
