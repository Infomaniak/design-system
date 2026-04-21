/**
 * The options to perform an Iconify API fetch.
 *
 * @internal
 */
export interface IconifyApiFetchOptions extends Omit<RequestInit, 'body'> {
  readonly path: string;
  readonly searchParams?: URLSearchParams;
  readonly body?: object | null;
}

export interface IconifyApiFetchJSONOptions extends IconifyApiFetchOptions {
  readonly expectNumberResponse?: boolean;
}

export interface IconifyApiSharedFetchJSONOptions extends Pick<
  IconifyApiFetchJSONOptions,
  'signal'
> {
  readonly pretty?: boolean;
}
