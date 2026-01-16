import type { ValueOrCurlyReference } from '../../../../../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { ColorDesignTokensCollectionTokenValue } from '../../../../../base/color/value/color-design-tokens-collection-token-value.ts';
import type { NumberDesignTokensCollectionTokenValue } from '../../../../../base/number/value/number-design-tokens-collection-token-value.ts';

export interface ObjectGradientDesignTokensCollectionTokenValue {
  readonly color: ValueOrCurlyReference<ColorDesignTokensCollectionTokenValue>;
  readonly position: ValueOrCurlyReference<NumberDesignTokensCollectionTokenValue>; // [0, 1]
}
