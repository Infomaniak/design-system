import type { UpdateCurlyReference } from '../../../../../../../../../../../design-token/reference/types/curly/update/update-curly-reference.ts';
import { updateValueOrCurlyReference } from '../../../../../../../../../../../design-token/reference/types/curly/value-or/update/update-value-or-curly-reference.ts';
import type { ValueOrCurlyReference } from '../../../../../../../../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { DimensionDesignTokensCollectionTokenValue } from '../../../../../../../../base/dimension/value/dimension-design-tokens-collection-token-value.ts';
import type { StrokeStyleDesignTokensCollectionTokenValueDashArray } from '../stroke-style-design-tokens-collection-token-value-dash-array.ts';

export function updateStrokeStyleDesignTokensCollectionTokenValueDashArrayReferences(
  dashArray: StrokeStyleDesignTokensCollectionTokenValueDashArray,
  update: UpdateCurlyReference,
): StrokeStyleDesignTokensCollectionTokenValueDashArray {
  return dashArray.map(
    (
      component: ValueOrCurlyReference<DimensionDesignTokensCollectionTokenValue>,
    ): ValueOrCurlyReference<DimensionDesignTokensCollectionTokenValue> => {
      return updateValueOrCurlyReference(component, update);
    },
  );
}
