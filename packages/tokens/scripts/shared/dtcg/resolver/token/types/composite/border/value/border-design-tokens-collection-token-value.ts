import type { ValueOrCurlyReference } from '../../../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { ColorDesignTokensCollectionTokenValue } from '../../../base/color/value/color-design-tokens-collection-token-value.ts';
import type { DimensionDesignTokensCollectionTokenValue } from '../../../base/dimension/value/dimension-design-tokens-collection-token-value.ts';
import type { StrokeStyleDesignTokensCollectionTokenValue } from '../../stroke-style/value/stroke-style-design-tokens-collection-token-value.ts';

export interface BorderDesignTokensCollectionTokenValue {
  readonly color: ValueOrCurlyReference<ColorDesignTokensCollectionTokenValue>;
  readonly width: ValueOrCurlyReference<DimensionDesignTokensCollectionTokenValue>;
  readonly style: ValueOrCurlyReference<StrokeStyleDesignTokensCollectionTokenValue>;
}
