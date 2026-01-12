import type { DesignToken } from '../../../../design-token.js';
import type { ColorDesignTokenValue } from './value/color-design-token-value.ts';

/**
 * @inheritDoc https://www.designtokens.org/tr/2025.10/color/
 */
export type ColorDesignToken = DesignToken<'color', ColorDesignTokenValue>;
