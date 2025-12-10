import type { DesignToken } from '../../../design-token.ts';
import type { StrokeStyleDesignTokenValue } from './value/stroke-style-design-token-value.ts';

/**
 * @inheritDoc https://www.designtokens.org/tr/2025.10/format/#stroke-style
 */
export type StrokeStyleDesignToken = DesignToken<'strokeStyle', StrokeStyleDesignTokenValue>;
