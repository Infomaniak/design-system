import type { IconifyApiSharedFetchJSONOptions } from '../iconify-api-fetch-options.private.ts';

/**
 * Options to get icons data.
 *
 * @inheritDoc https://iconify.design/docs/api/icon-data.html
 */
export interface IconifyApiGetIconsDataOptions extends IconifyApiSharedFetchJSONOptions {
  readonly prefix: string;
  readonly icons: readonly string[];
}
