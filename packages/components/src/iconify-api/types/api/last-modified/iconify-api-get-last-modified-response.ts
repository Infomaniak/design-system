/**
 * Response of the `/last-modified` API call.
 */
export interface IconifyApiGetLastModifiedResponse {
  readonly lastModified: Record<string /* set */, number>;
}
