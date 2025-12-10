import type { DesignToken } from '../../design-token.ts';
import type { DurationDesignTokenValue } from './value/duration-design-token-value.ts';

/**
 * @inheritDoc https://www.designtokens.org/tr/2025.10/format/#duration
 */
export type DurationDesignToken = DesignToken<'duration', DurationDesignTokenValue>;
