import { loadRemoteCss } from '../helpers/load-remote-css.ts';
import { FONTS_CSS_URL_DEFAULT } from './font-css-url.ts';

/**
 * Pre-configured loader for the design system fonts CSS.
 * Uses VITE_FONTS_CSS_URL env variable or defaults to the dev storage endpoint.
 *
 * This replaces the static `@infomaniak-design-system/fonts` import so the
 * font source can be switched per environment (dev / preprod / prod storage).
 */
export const fontsCssUrl: string = import.meta.env.VITE_FONTS_CSS_URL ?? FONTS_CSS_URL_DEFAULT;

export function loadFontsCss(): Promise<void> {
  return loadRemoteCss(fontsCssUrl);
}
