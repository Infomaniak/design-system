/**
 * Error codes for the Icon Gallery feature
 */
export const IconGalleryErrorCode = {
  ABORTED: 'ABORTED',
  API_ERROR: 'API_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  BOUNDARY_ERROR: 'BOUNDARY_ERROR',
} as const;

export type IconGalleryErrorCode = (typeof IconGalleryErrorCode)[keyof typeof IconGalleryErrorCode];
