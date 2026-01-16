import type { ValueOrCurlyReference } from '../../../../../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { ColorDesignTokensCollectionTokenValue } from '../../../../../base/color/value/color-design-tokens-collection-token-value.ts';
import type { DimensionDesignTokensCollectionTokenValue } from '../../../../../base/dimension/value/dimension-design-tokens-collection-token-value.ts';

export interface ObjectShadowDesignTokensCollectionTokenValue {
  readonly color: ValueOrCurlyReference<ColorDesignTokensCollectionTokenValue>;
  readonly offsetX: ValueOrCurlyReference<DimensionDesignTokensCollectionTokenValue>;
  readonly offsetY: ValueOrCurlyReference<DimensionDesignTokensCollectionTokenValue>;
  readonly blur: ValueOrCurlyReference<DimensionDesignTokensCollectionTokenValue>;
  readonly spread: ValueOrCurlyReference<DimensionDesignTokensCollectionTokenValue>;
  readonly inset?: boolean;
}
