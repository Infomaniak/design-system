import type { DesignToken } from '../../design-token.ts';
import type { NumberDesignTokenValue } from './value/number-design-token-value.ts';

/**
 * @inheritDoc https://www.designtokens.org/tr/2025.10/format/#number
 */
export type NumberDesignToken = DesignToken<'number', NumberDesignTokenValue>;
