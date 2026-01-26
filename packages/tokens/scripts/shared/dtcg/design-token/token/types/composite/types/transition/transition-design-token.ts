import type { DesignToken } from '../../../../design-token.ts';
import type { TransitionDesignTokenValue } from './value/transition-design-token-value.ts';

/**
 * @inheritDoc https://www.designtokens.org/tr/2025.10/format/#transition
 */
export type TransitionDesignToken = DesignToken<'transition', TransitionDesignTokenValue>;
