import type { IconifyApiSharedFetchJSONOptions } from '../iconify-api-fetch-options.ts';

/**
 * Options to list the icon sets available.
 *
 * @inheritDoc https://iconify.design/docs/api/collections.html
 */
export interface IconifyApiListIconSetsOptions extends IconifyApiSharedFetchJSONOptions {
  readonly prefixes?: readonly string[];
}
