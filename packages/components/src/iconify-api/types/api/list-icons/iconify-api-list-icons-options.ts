import type { IconifyApiSharedFetchJSONOptions } from '../iconify-api-fetch-options.private.ts';

/**
 * Options to list Iconify icons of a set.
 *
 * @inheritDoc https://iconify.design/docs/api/collection.html
 */
export interface IconifyApiListIconsOptions extends IconifyApiSharedFetchJSONOptions {
  readonly prefix: string;
  readonly info?: boolean;
  readonly chars?: boolean;
}
