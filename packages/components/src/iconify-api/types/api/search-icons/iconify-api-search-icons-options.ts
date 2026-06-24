import type { IconifyApiSharedFetchJSONOptions } from '../iconify-api-fetch-options.private.ts';

/**
 * Options to search icons.
 *
 * @inheritDoc https://iconify.design/docs/api/search.html
 */
export interface IconifyApiSearchIconsOptions extends IconifyApiSharedFetchJSONOptions {
  readonly query: string;
  readonly limit?: number;
  readonly start?: number;
  readonly prefixes?: readonly string[];
  readonly category?: string;
}
