import type { UpdateCurlyReference } from '../../../../../../../design-token/reference/types/curly/update/update-curly-reference.ts';
import { updateValueOrCurlyReference } from '../../../../../../../design-token/reference/types/curly/value-or/update/update-value-or-curly-reference.ts';
import type { ValueOrCurlyReference } from '../../../../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { GradientDesignTokensCollectionTokenValue } from '../gradient-design-tokens-collection-token-value.ts';
import type { ObjectGradientDesignTokensCollectionTokenValue } from '../members/object/object-gradient-design-tokens-collection-token-value.ts';
import { updateObjectGradientDesignTokensCollectionTokenValueReferences } from '../members/object/update/update-object-gradient-design-tokens-collection-token-value-references.ts';

export function updateGradientDesignTokensCollectionTokenValueReferences(
  value: GradientDesignTokensCollectionTokenValue,
  update: UpdateCurlyReference,
): GradientDesignTokensCollectionTokenValue {
  return value.map(
    (
      component: ValueOrCurlyReference<ObjectGradientDesignTokensCollectionTokenValue>,
    ): ValueOrCurlyReference<ObjectGradientDesignTokensCollectionTokenValue> => {
      return updateValueOrCurlyReference(
        component,
        update,
        updateObjectGradientDesignTokensCollectionTokenValueReferences,
      );
    },
  );
}
