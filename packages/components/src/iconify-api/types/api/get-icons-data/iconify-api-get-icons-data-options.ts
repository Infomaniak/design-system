import type { IconifyApiSharedFetchJSONOptions } from '../iconify-api-fetch-options.ts';

/**
 * Options to get icons data.
 *
 * @inheritDoc https://iconify.design/docs/api/icon-data.html
 */
export interface IconifyApiGetIconsDataOptions extends IconifyApiSharedFetchJSONOptions {
  readonly prefix: string;
  readonly icons: readonly string[];
}
