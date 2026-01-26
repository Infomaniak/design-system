import type { DesignToken } from '../../../../design-token.ts';
import type { DimensionDesignTokenValue } from './value/dimension-design-token-value.ts';

/**
 * @inheritDoc https://www.designtokens.org/tr/2025.10/format/#dimension
 */
export type DimensionDesignToken = DesignToken<'dimension', DimensionDesignTokenValue>;
