import type { ValueOrCurlyReference } from '../../../../../../../../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { ValueOrDesignTokenReference } from '../../../../../../../../../../../design-token/reference/value-or/value-or-design-token-reference.ts';
import type { DimensionDesignTokenValue } from '../../../../../../../../../../../design-token/token/types/base/types/dimension/value/dimension-design-token-value.ts';
import type { StrokeStyleDesignTokenValueDashArray } from '../../../../../../../../../../../design-token/token/types/composite/types/stroke-style/value/types/object/members/dash-array/stroke-style-design-token-value-dash-array.ts';
import type { DimensionDesignTokensCollectionTokenValue } from '../../../../../../../../base/dimension/value/dimension-design-tokens-collection-token-value.ts';
import { dimensionDesignTokenValueToDimensionDesignTokensCollectionTokenValue } from '../../../../../../../../base/dimension/value/from/dimension-design-token-value-to-dimension-design-tokens-collection-token-value.ts';
import { valueOrDesignTokenReferenceToMappedValueOrCurlyReference } from '../../../../../../../value-or-design-token-reference-to-mapped-value-or-curly-reference.ts';
import type { StrokeStyleDesignTokensCollectionTokenValueDashArray } from '../stroke-style-design-tokens-collection-token-value-dash-array.ts';

export function strokeStyleDesignTokenValueDashArrayToStrokeStyleDesignTokensCollectionTokenValueDashArray(
  dashArray: StrokeStyleDesignTokenValueDashArray,
  root: unknown,
): StrokeStyleDesignTokensCollectionTokenValueDashArray {
  return dashArray.map(
    (
      component: ValueOrDesignTokenReference<DimensionDesignTokenValue>,
    ): ValueOrCurlyReference<DimensionDesignTokensCollectionTokenValue> => {
      return valueOrDesignTokenReferenceToMappedValueOrCurlyReference(
        component,
        (value: DimensionDesignTokenValue): DimensionDesignTokensCollectionTokenValue =>
          dimensionDesignTokenValueToDimensionDesignTokensCollectionTokenValue(value, root),
      );
    },
  );
}
