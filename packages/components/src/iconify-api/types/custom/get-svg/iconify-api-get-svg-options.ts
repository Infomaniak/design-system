import type { IconifyApiGetSVGUrlOptions } from '../../api/get-svg-url/iconify-api-get-svg-url-options.ts';
import type { IconifyApiFetchOptions } from '../../api/iconify-api-fetch-options.ts';

export interface IconifyApiGetSVGOptions
  extends
    Pick<IconifyApiGetSVGUrlOptions, 'prefix' | 'name'>,
    Pick<IconifyApiFetchOptions, 'signal'> {}
