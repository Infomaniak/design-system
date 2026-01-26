import type { ValueOrCurlyReference } from '../../../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { CubicBezierDesignTokensCollectionTokenValue } from '../../../base/cubic-bezier/value/cubic-bezier-design-tokens-collection-token-value.ts';
import type { DurationDesignTokensCollectionTokenValue } from '../../../base/duration/value/duration-design-tokens-collection-token-value.ts';

export interface TransitionDesignTokensCollectionTokenValue {
  readonly duration: ValueOrCurlyReference<DurationDesignTokensCollectionTokenValue>;
  readonly delay: ValueOrCurlyReference<DurationDesignTokensCollectionTokenValue>;
  readonly timingFunction: ValueOrCurlyReference<CubicBezierDesignTokensCollectionTokenValue>;
}
