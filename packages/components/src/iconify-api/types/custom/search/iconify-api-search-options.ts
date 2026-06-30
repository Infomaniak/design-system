import type { IconifyApiFetchOptions } from '../../api/iconify-api-fetch-options.private.ts';

/**
 * Searches options.
 */
export interface IconifyApiSearchOptions extends Pick<IconifyApiFetchOptions, 'signal'> {
  /**
   * The set prefix to search against.
   */
  readonly prefix: string;

  /**
   * A search query - example:
   *
   * `cog` => returns icons having `cog` in their name or in their tags (a _tag_ is a category beginning with `#`).
   * `cog envelope` => returns icons having `cog` AND `envelope` in their name or in their tags.
   * `@ksuite` => returns icons having `@ksuite` as category.
   * `cog @ksuite` => returns icons having `cog` in their name or in their tags; AND having `@ksuite` as category.
   */
  readonly query?: string;
}
