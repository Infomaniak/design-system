import type { ValueOrCurlyReference } from '../../../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { DimensionDesignTokensCollectionTokenValue } from '../../../base/dimension/value/dimension-design-tokens-collection-token-value.ts';
import type { FontFamilyDesignTokensCollectionTokenValue } from '../../../base/font-family/value/font-family-design-tokens-collection-token-value.ts';
import type { FontWeightDesignTokensCollectionTokenValue } from '../../../base/font-weight/value/font-weight-design-tokens-collection-token-value.ts';
import type { NumberDesignTokensCollectionTokenValue } from '../../../base/number/value/number-design-tokens-collection-token-value.ts';

export interface TypographyDesignTokensCollectionTokenValue {
  readonly fontFamily: ValueOrCurlyReference<FontFamilyDesignTokensCollectionTokenValue>;
  readonly fontSize: ValueOrCurlyReference<DimensionDesignTokensCollectionTokenValue>;
  readonly fontWeight: ValueOrCurlyReference<FontWeightDesignTokensCollectionTokenValue>;
  readonly letterSpacing: ValueOrCurlyReference<DimensionDesignTokensCollectionTokenValue>;
  readonly lineHeight: ValueOrCurlyReference<NumberDesignTokensCollectionTokenValue>;
}
