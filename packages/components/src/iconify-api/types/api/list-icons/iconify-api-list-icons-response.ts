import type { IconifyInfo, IconifyJSON } from '@iconify/types';

/**
 * Response of the `/collection` API call.
 */
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
  readonly themes?: IconifyJSON['themes'];
  readonly prefixes?: IconifyJSON['prefixes'];
  readonly suffixes?: IconifyJSON['suffixes'];
}
