import type { ColorDesignTokenValue } from '../../../../../../../../../design-token/token/types/base/types/color/value/color-design-token-value.ts';
import type { DimensionDesignTokenValue } from '../../../../../../../../../design-token/token/types/base/types/dimension/value/dimension-design-token-value.ts';
import type { ObjectShadowDesignTokenValue } from '../../../../../../../../../design-token/token/types/composite/types/shadow/value/types/object/object-shadow-design-token-value.ts';
import type { ColorDesignTokensCollectionTokenValue } from '../../../../../../base/color/value/color-design-tokens-collection-token-value.ts';
import { colorDesignTokenValueToColorDesignTokensCollectionTokenValue } from '../../../../../../base/color/value/from/color-design-token-value-to-color-design-tokens-collection-token-value.ts';
import type { DimensionDesignTokensCollectionTokenValue } from '../../../../../../base/dimension/value/dimension-design-tokens-collection-token-value.ts';
import { dimensionDesignTokenValueToDimensionDesignTokensCollectionTokenValue } from '../../../../../../base/dimension/value/from/dimension-design-token-value-to-dimension-design-tokens-collection-token-value.ts';
import { valueOrDesignTokenReferenceToMappedValueOrCurlyReference } from '../../../../../value-or-design-token-reference-to-mapped-value-or-curly-reference.ts';
import type { ObjectShadowDesignTokensCollectionTokenValue } from '../object-shadow-design-tokens-collection-token-value.ts';

export function objectShadowDesignTokenValueToObjectShadowDesignTokensCollectionTokenValue(
  value: ObjectShadowDesignTokenValue,
  root: unknown,
): ObjectShadowDesignTokensCollectionTokenValue {
  return {
    color: valueOrDesignTokenReferenceToMappedValueOrCurlyReference(
      value.color,
      (value: ColorDesignTokenValue): ColorDesignTokensCollectionTokenValue =>
        colorDesignTokenValueToColorDesignTokensCollectionTokenValue(value, root),
    ),
    offsetX: valueOrDesignTokenReferenceToMappedValueOrCurlyReference(
      value.offsetX,
      (value: DimensionDesignTokenValue): DimensionDesignTokensCollectionTokenValue =>
        dimensionDesignTokenValueToDimensionDesignTokensCollectionTokenValue(value, root),
    ),
    offsetY: valueOrDesignTokenReferenceToMappedValueOrCurlyReference(
      value.offsetY,
      (value: DimensionDesignTokenValue): DimensionDesignTokensCollectionTokenValue =>
        dimensionDesignTokenValueToDimensionDesignTokensCollectionTokenValue(value, root),
    ),
    blur: valueOrDesignTokenReferenceToMappedValueOrCurlyReference(
      value.blur,
      (value: DimensionDesignTokenValue): DimensionDesignTokensCollectionTokenValue =>
        dimensionDesignTokenValueToDimensionDesignTokensCollectionTokenValue(value, root),
    ),
    spread: valueOrDesignTokenReferenceToMappedValueOrCurlyReference(
      value.spread,
      (value: DimensionDesignTokenValue): DimensionDesignTokensCollectionTokenValue =>
        dimensionDesignTokenValueToDimensionDesignTokensCollectionTokenValue(value, root),
    ),
    inset: value.inset,
  };
}
