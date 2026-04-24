import type { IconifyApiSharedFetchJSONOptions } from '../iconify-api-fetch-options.ts';

/**
 * Options to list the `lastModified` properties of Iconify collections.
 *
 * @inheritDoc https://iconify.design/docs/api/last-modified.html#query
 */
export interface IconifyApiGetLastModifiedOptions extends IconifyApiSharedFetchJSONOptions {
  readonly prefixes?: readonly string[];
}
