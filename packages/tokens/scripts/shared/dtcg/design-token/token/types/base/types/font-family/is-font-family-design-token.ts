import type { GenericDesignToken } from '../../../../generic-design-token.ts';
import type { FontFamilyDesignToken } from './font-family-design-token.ts';

export function isFontFamilyDesignToken(input: GenericDesignToken): input is FontFamilyDesignToken {
  return input.$type === 'fontFamily';
}
