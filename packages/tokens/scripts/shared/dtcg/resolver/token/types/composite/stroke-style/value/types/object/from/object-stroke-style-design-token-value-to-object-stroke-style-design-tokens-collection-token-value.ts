import type { ObjectStrokeStyleDesignTokenValue } from '../../../../../../../../../design-token/token/types/composite/types/stroke-style/value/types/object/object-stroke-style-design-token-value.ts';
import { strokeStyleDesignTokenValueDashArrayToStrokeStyleDesignTokensCollectionTokenValueDashArray } from '../members/dash-array/from/stroke-style-design-token-value-dash-array-to-stroke-style-design-tokens-collection-token-value-dash-array.ts';
import type { ObjectStrokeStyleDesignTokensCollectionTokenValue } from '../object-stroke-style-design-tokens-collection-token-value.ts';

export function objectStrokeStyleDesignTokenValueToObjectStrokeStyleDesignTokensCollectionTokenValue(
  value: ObjectStrokeStyleDesignTokenValue,
  root: unknown,
): ObjectStrokeStyleDesignTokensCollectionTokenValue {
  return {
    dashArray:
      strokeStyleDesignTokenValueDashArrayToStrokeStyleDesignTokensCollectionTokenValueDashArray(
        value.dashArray,
        root,
      ),
    lineCap: value.lineCap,
  };
}
