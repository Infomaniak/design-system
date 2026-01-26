import type { DesignToken } from '../../../../design-token.ts';
import type { CubicBezierDesignTokenValue } from './value/cubic-bezier-design-token-value.ts';

/**
 * @inheritDoc https://www.designtokens.org/tr/2025.10/format/#cubic-bezier
 */
export type CubicBezierDesignToken = DesignToken<'cubicBezier', CubicBezierDesignTokenValue>;
