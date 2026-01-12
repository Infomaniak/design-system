import type { DesignToken } from '../../../../design-token.ts';
import type { BorderDesignTokenValue } from './value/border-design-token-value.ts';

/**
 * @inheritDoc https://www.designtokens.org/tr/2025.10/format/#border
 */
export type BorderDesignToken = DesignToken<'border', BorderDesignTokenValue>;
