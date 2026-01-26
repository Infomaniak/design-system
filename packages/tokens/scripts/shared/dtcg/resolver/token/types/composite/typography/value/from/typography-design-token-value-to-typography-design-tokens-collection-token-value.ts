import type { DimensionDesignTokenValue } from '../../../../../../../design-token/token/types/base/types/dimension/value/dimension-design-token-value.ts';
import type { FontFamilyDesignTokenValue } from '../../../../../../../design-token/token/types/base/types/font-family/value/font-family-design-token-value.ts';
import type { FontWeightDesignTokenValue } from '../../../../../../../design-token/token/types/base/types/font-weight/value/font-weight-design-token-value.ts';
import type { NumberDesignTokenValue } from '../../../../../../../design-token/token/types/base/types/number/value/number-design-token-value.ts';
import type { TypographyDesignTokenValue } from '../../../../../../../design-token/token/types/composite/types/typography/value/typography-design-token-value.ts';
import type { DimensionDesignTokensCollectionTokenValue } from '../../../../base/dimension/value/dimension-design-tokens-collection-token-value.ts';
import { dimensionDesignTokenValueToDimensionDesignTokensCollectionTokenValue } from '../../../../base/dimension/value/from/dimension-design-token-value-to-dimension-design-tokens-collection-token-value.ts';
import type { FontFamilyDesignTokensCollectionTokenValue } from '../../../../base/font-family/value/font-family-design-tokens-collection-token-value.ts';
import { fontFamilyDesignTokenValueToFontFamilyDesignTokensCollectionTokenValue } from '../../../../base/font-family/value/from/font-family-design-token-value-to-font-family-design-tokens-collection-token-value.ts';
import type { FontWeightDesignTokensCollectionTokenValue } from '../../../../base/font-weight/value/font-weight-design-tokens-collection-token-value.ts';
import { fontWeightDesignTokenValueToFontWeightDesignTokensCollectionTokenValue } from '../../../../base/font-weight/value/from/font-weight-design-token-value-to-font-weight-design-tokens-collection-token-value.ts';
import { numberDesignTokenValueToNumberDesignTokensCollectionTokenValue } from '../../../../base/number/value/from/number-design-token-value-to-number-design-tokens-collection-token-value.ts';
import type { NumberDesignTokensCollectionTokenValue } from '../../../../base/number/value/number-design-tokens-collection-token-value.ts';
import { valueOrDesignTokenReferenceToMappedValueOrCurlyReference } from '../../../value-or-design-token-reference-to-mapped-value-or-curly-reference.ts';
import type { TypographyDesignTokensCollectionTokenValue } from '../typography-design-tokens-collection-token-value.ts';

export function typographyDesignTokenValueToTypographyDesignTokensCollectionTokenValue(
  $value: TypographyDesignTokenValue,
  root: unknown,
): TypographyDesignTokensCollectionTokenValue {
  return {
    fontFamily: valueOrDesignTokenReferenceToMappedValueOrCurlyReference(
      $value.fontFamily,
      (value: FontFamilyDesignTokenValue): FontFamilyDesignTokensCollectionTokenValue =>
        fontFamilyDesignTokenValueToFontFamilyDesignTokensCollectionTokenValue(value, root),
    ),
    fontSize: valueOrDesignTokenReferenceToMappedValueOrCurlyReference(
      $value.fontSize,
      (value: DimensionDesignTokenValue): DimensionDesignTokensCollectionTokenValue =>
        dimensionDesignTokenValueToDimensionDesignTokensCollectionTokenValue(value, root),
    ),
    fontWeight: valueOrDesignTokenReferenceToMappedValueOrCurlyReference(
      $value.fontWeight,
      (value: FontWeightDesignTokenValue): FontWeightDesignTokensCollectionTokenValue =>
        fontWeightDesignTokenValueToFontWeightDesignTokensCollectionTokenValue(value, root),
    ),
    letterSpacing: valueOrDesignTokenReferenceToMappedValueOrCurlyReference(
      $value.letterSpacing,
      (value: DimensionDesignTokenValue): DimensionDesignTokensCollectionTokenValue =>
        dimensionDesignTokenValueToDimensionDesignTokensCollectionTokenValue(value, root),
    ),
    lineHeight: valueOrDesignTokenReferenceToMappedValueOrCurlyReference(
      $value.lineHeight,
      (value: NumberDesignTokenValue): NumberDesignTokensCollectionTokenValue =>
        numberDesignTokenValueToNumberDesignTokensCollectionTokenValue(value, root),
    ),
  };
}
