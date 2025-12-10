import type { UnknownDesignToken } from '../unknown/unknown-design-token.ts';
import type { FontFamilyDesignToken } from './font-family-design-token.ts';

export function isFontFamilyDesignToken(input: UnknownDesignToken): input is FontFamilyDesignToken {
  return input.$type === 'fontFamily';
}
