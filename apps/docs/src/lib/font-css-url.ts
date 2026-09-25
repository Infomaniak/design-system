/**
 * Default URL of the remote Infomaniak Sans stylesheet, used when no explicit
 * URL is configured via `VITE_FONTS_CSS_URL` (preview + manager builds).
 *
 * Kept free of `import.meta.env` access so it can safely be imported by both
 * browser code and Node build code (`.storybook/main.ts`).
 */
export const FONTS_CSS_URL_DEFAULT: string =
  'https://fonts.storage.infomaniak.com/design-system/dev/infomaniak-sans.min.css';
