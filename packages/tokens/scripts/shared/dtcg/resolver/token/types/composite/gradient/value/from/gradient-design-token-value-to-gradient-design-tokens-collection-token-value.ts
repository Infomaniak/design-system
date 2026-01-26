import type { ValueOrDesignTokenReference } from '../../../../../../../design-token/reference/value-or/value-or-design-token-reference.ts';
import type { GradientDesignTokenValue } from '../../../../../../../design-token/token/types/composite/types/gradient/value/gradient-design-token-value.ts';
import type { ObjectGradientDesignTokenValue } from '../../../../../../../design-token/token/types/composite/types/gradient/value/members/object/object-gradient-design-token-value.ts';
import { valueOrDesignTokenReferenceToMappedValueOrCurlyReference } from '../../../value-or-design-token-reference-to-mapped-value-or-curly-reference.ts';
import type { GradientDesignTokensCollectionTokenValue } from '../gradient-design-tokens-collection-token-value.ts';
import { objectGradientDesignTokenValueToObjectGradientDesignTokensCollectionTokenValue } from '../members/object/from/object-gradient-design-token-value-to-object-gradient-design-tokens-collection-token-value.ts';
import type { ObjectGradientDesignTokensCollectionTokenValue } from '../members/object/object-gradient-design-tokens-collection-token-value.ts';

export function gradientDesignTokenValueToGradientDesignTokensCollectionTokenValue(
  $value: GradientDesignTokenValue,
  root: unknown,
): GradientDesignTokensCollectionTokenValue {
  return $value.map((component: ValueOrDesignTokenReference<ObjectGradientDesignTokenValue>) => {
    return valueOrDesignTokenReferenceToMappedValueOrCurlyReference(
      component,
      (value: ObjectGradientDesignTokenValue): ObjectGradientDesignTokensCollectionTokenValue => {
        return objectGradientDesignTokenValueToObjectGradientDesignTokensCollectionTokenValue(
          value,
          root,
        );
      },
    );
  });
}
