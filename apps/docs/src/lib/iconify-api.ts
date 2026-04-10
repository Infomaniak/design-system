import { IconifyApi } from '@infomaniak-design-system/esds-svg';

/**
 * Pre-configured IconifyApi instance for the storybook.
 * Uses VITE_ICONIFY_API_URL env variable or defaults to preprod endpoint.
 *
 * This singleton is separate from the esds-svg web component package
 * to avoid cross-package dependencies.
 */
export const iconifyApi = new IconifyApi({
  resources: [import.meta.env.VITE_ICONIFY_API_URL ?? 'https://iconify.preprod.dev.infomaniak.ch'],
});
