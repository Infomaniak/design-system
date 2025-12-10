import type { DesignToken } from '../../design-token.ts';
import type { FontWeightDesignTokenValue } from './value/font-weight-design-token-value.ts';

/**
 * @inheritDoc https://www.designtokens.org/tr/2025.10/format/#font-weight
 */
export type FontWeightDesignToken = DesignToken<'fontWeight', FontWeightDesignTokenValue>;
