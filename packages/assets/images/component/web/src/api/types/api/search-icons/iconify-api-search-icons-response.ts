import type { IconifyInfo } from '@iconify/types';

/**
 * Response of the `/search` API call.
 */
export interface IconifyApiSearchIconsResponse {
  readonly icons: readonly string[];
  readonly total: number;
  readonly limit: number;
  readonly start: number;
  readonly collections: Record<string, IconifyInfo>;
}
