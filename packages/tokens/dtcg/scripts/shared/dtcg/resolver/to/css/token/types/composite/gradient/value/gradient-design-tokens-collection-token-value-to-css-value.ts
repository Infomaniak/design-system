import type { ValueOrCurlyReference } from '../../../../../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { GradientDesignTokensCollectionTokenValue } from '../../../../../../../token/types/composite/gradient/value/gradient-design-tokens-collection-token-value.ts';
import type { ObjectGradientDesignTokensCollectionTokenValue } from '../../../../../../../token/types/composite/gradient/value/members/object/object-gradient-design-tokens-collection-token-value.ts';
import {
  valueOrCurlyReferenceToCssVariableReference,
  type ValueOrCurlyReferenceToCssVariableReferenceOptions,
} from '../../../../../reference/value-or-curly-reference-to-css-variable-reference.ts';
import {
  objectGradientDesignTokensCollectionTokenValueToToCssValue,
  type ObjectGradientDesignTokensCollectionTokenValueToToCssValueOptions,
} from './members/object/object-gradient-design-tokens-collection-token-value-to-to-css-value.ts';

export interface GradientDesignTokensCollectionTokenValueToCssValueOptions
  extends
    ValueOrCurlyReferenceToCssVariableReferenceOptions,
    ObjectGradientDesignTokensCollectionTokenValueToToCssValueOptions {}

/**
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient
 */
export function gradientDesignTokensCollectionTokenValueToCssValue(
  value: GradientDesignTokensCollectionTokenValue,
  options?: GradientDesignTokensCollectionTokenValueToCssValueOptions,
): string {
  return value
    .map(
      (
        component: ValueOrCurlyReference<ObjectGradientDesignTokensCollectionTokenValue>,
      ): string => {
        return valueOrCurlyReferenceToCssVariableReference(
          component,
          (value: ObjectGradientDesignTokensCollectionTokenValue): string =>
            objectGradientDesignTokensCollectionTokenValueToToCssValue(value, options),
          options,
        );
      },
    )
    .join(', ');
}
