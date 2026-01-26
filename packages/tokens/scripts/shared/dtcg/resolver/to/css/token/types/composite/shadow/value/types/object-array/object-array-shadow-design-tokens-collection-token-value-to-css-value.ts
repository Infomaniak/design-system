import type { ValueOrCurlyReference } from '../../../../../../../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { ObjectArrayShadowDesignTokensCollectionTokenValue } from '../../../../../../../../../token/types/composite/shadow/value/types/object-array/object-array-shadow-design-tokens-collection-token-value.ts';
import type { ObjectShadowDesignTokensCollectionTokenValue } from '../../../../../../../../../token/types/composite/shadow/value/types/object/object-shadow-design-tokens-collection-token-value.ts';
import {
  valueOrCurlyReferenceToCssVariableReference,
  type ValueOrCurlyReferenceToCssVariableReferenceOptions,
} from '../../../../../../../reference/value-or-curly-reference-to-css-variable-reference.ts';
import {
  objectShadowDesignTokensCollectionTokenValueToCssValue,
  type ObjectShadowDesignTokensCollectionTokenValueToCssValueOptions,
} from '../object/object-shadow-design-tokens-collection-token-value-to-css-value.ts';

export interface ObjectArrayShadowDesignTokensCollectionTokenValueToCssValueOptions
  extends
    ValueOrCurlyReferenceToCssVariableReferenceOptions,
    ObjectShadowDesignTokensCollectionTokenValueToCssValueOptions {}

/**
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/box-shadow
 */
export function objectArrayShadowDesignTokensCollectionTokenValueToCssValue(
  value: ObjectArrayShadowDesignTokensCollectionTokenValue,
  options?: ObjectArrayShadowDesignTokensCollectionTokenValueToCssValueOptions,
): string {
  return value
    .map(
      (component: ValueOrCurlyReference<ObjectShadowDesignTokensCollectionTokenValue>): string => {
        return valueOrCurlyReferenceToCssVariableReference(
          component,
          (value: ObjectShadowDesignTokensCollectionTokenValue): string =>
            objectShadowDesignTokensCollectionTokenValueToCssValue(value, options),
          options,
        );
      },
    )
    .join(', ');
}
