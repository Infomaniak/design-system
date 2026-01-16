import type { ColorDesignTokenValue } from '../../../../../../../design-token/token/types/base/types/color/value/color-design-token-value.ts';
import type { DimensionDesignTokenValue } from '../../../../../../../design-token/token/types/base/types/dimension/value/dimension-design-token-value.ts';
import type { BorderDesignTokenValue } from '../../../../../../../design-token/token/types/composite/types/border/value/border-design-token-value.ts';
import type { StrokeStyleDesignTokenValue } from '../../../../../../../design-token/token/types/composite/types/stroke-style/value/stroke-style-design-token-value.ts';
import type { ColorDesignTokensCollectionTokenValue } from '../../../../base/color/value/color-design-tokens-collection-token-value.ts';
import { colorDesignTokenValueToColorDesignTokensCollectionTokenValue } from '../../../../base/color/value/from/color-design-token-value-to-color-design-tokens-collection-token-value.ts';
import type { DimensionDesignTokensCollectionTokenValue } from '../../../../base/dimension/value/dimension-design-tokens-collection-token-value.ts';
import { dimensionDesignTokenValueToDimensionDesignTokensCollectionTokenValue } from '../../../../base/dimension/value/from/dimension-design-token-value-to-dimension-design-tokens-collection-token-value.ts';
import { strokeStyleDesignTokenValueToStrokeStyleDesignTokensCollectionTokenValue } from '../../../stroke-style/value/from/stroke-style-design-token-value-to-stroke-style-design-tokens-collection-token-value.ts';
import type { StrokeStyleDesignTokensCollectionTokenValue } from '../../../stroke-style/value/stroke-style-design-tokens-collection-token-value.ts';
import { valueOrDesignTokenReferenceToMappedValueOrCurlyReference } from '../../../value-or-design-token-reference-to-mapped-value-or-curly-reference.ts';
import type { BorderDesignTokensCollectionTokenValue } from '../border-design-tokens-collection-token-value.ts';

export function borderDesignTokenValueToBorderDesignTokensCollectionTokenValue(
  $value: BorderDesignTokenValue,
  root: unknown,
): BorderDesignTokensCollectionTokenValue {
  return {
    color: valueOrDesignTokenReferenceToMappedValueOrCurlyReference(
      $value.color,
      (value: ColorDesignTokenValue): ColorDesignTokensCollectionTokenValue =>
        colorDesignTokenValueToColorDesignTokensCollectionTokenValue(value, root),
    ),
    width: valueOrDesignTokenReferenceToMappedValueOrCurlyReference(
      $value.width,
      (value: DimensionDesignTokenValue): DimensionDesignTokensCollectionTokenValue =>
        dimensionDesignTokenValueToDimensionDesignTokensCollectionTokenValue(value, root),
    ),
    style: valueOrDesignTokenReferenceToMappedValueOrCurlyReference(
      $value.style,
      (value: StrokeStyleDesignTokenValue): StrokeStyleDesignTokensCollectionTokenValue =>
        strokeStyleDesignTokenValueToStrokeStyleDesignTokensCollectionTokenValue(value, root),
    ),
  };
}
