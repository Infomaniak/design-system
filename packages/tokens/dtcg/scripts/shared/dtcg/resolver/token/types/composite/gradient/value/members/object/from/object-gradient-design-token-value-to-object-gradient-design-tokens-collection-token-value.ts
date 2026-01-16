import type { ColorDesignTokenValue } from '../../../../../../../../../design-token/token/types/base/types/color/value/color-design-token-value.ts';
import type { NumberDesignTokenValue } from '../../../../../../../../../design-token/token/types/base/types/number/value/number-design-token-value.ts';
import type { ObjectGradientDesignTokenValue } from '../../../../../../../../../design-token/token/types/composite/types/gradient/value/members/object/object-gradient-design-token-value.ts';
import type { ColorDesignTokensCollectionTokenValue } from '../../../../../../base/color/value/color-design-tokens-collection-token-value.ts';
import { colorDesignTokenValueToColorDesignTokensCollectionTokenValue } from '../../../../../../base/color/value/from/color-design-token-value-to-color-design-tokens-collection-token-value.ts';
import { numberDesignTokenValueToNumberDesignTokensCollectionTokenValue } from '../../../../../../base/number/value/from/number-design-token-value-to-number-design-tokens-collection-token-value.ts';
import type { NumberDesignTokensCollectionTokenValue } from '../../../../../../base/number/value/number-design-tokens-collection-token-value.ts';
import { valueOrDesignTokenReferenceToMappedValueOrCurlyReference } from '../../../../../value-or-design-token-reference-to-mapped-value-or-curly-reference.ts';
import type { ObjectGradientDesignTokensCollectionTokenValue } from '../object-gradient-design-tokens-collection-token-value.ts';

export function objectGradientDesignTokenValueToObjectGradientDesignTokensCollectionTokenValue(
  value: ObjectGradientDesignTokenValue,
  root: unknown,
): ObjectGradientDesignTokensCollectionTokenValue {
  return {
    color: valueOrDesignTokenReferenceToMappedValueOrCurlyReference(
      value.color,
      (value: ColorDesignTokenValue): ColorDesignTokensCollectionTokenValue =>
        colorDesignTokenValueToColorDesignTokensCollectionTokenValue(value, root),
    ),
    position: valueOrDesignTokenReferenceToMappedValueOrCurlyReference(
      value.position,
      (value: NumberDesignTokenValue): NumberDesignTokensCollectionTokenValue =>
        numberDesignTokenValueToNumberDesignTokensCollectionTokenValue(value, root),
    ),
  };
}
