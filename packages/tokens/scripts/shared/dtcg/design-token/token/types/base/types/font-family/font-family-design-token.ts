import type { DesignToken } from '../../../../design-token.ts';
import type { FontFamilyDesignTokenValue } from './value/font-family-design-token-value.ts';

/**
 * @inheritDoc https://www.designtokens.org/tr/2025.10/format/#font-family
 */
export type FontFamilyDesignToken = DesignToken<'fontFamily', FontFamilyDesignTokenValue>;
