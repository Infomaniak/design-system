import type { UpdateCurlyReference } from '../../../../../../../../../design-token/reference/types/curly/update/update-curly-reference.ts';
import { updateStrokeStyleDesignTokensCollectionTokenValueDashArrayReferences } from '../members/dash-array/update/update-stroke-style-design-tokens-collection-token-value-dash-array-references.ts';
import type { ObjectStrokeStyleDesignTokensCollectionTokenValue } from '../object-stroke-style-design-tokens-collection-token-value.ts';

export function updateObjectStrokeStyleDesignTokensCollectionTokenValueReferences(
  value: ObjectStrokeStyleDesignTokensCollectionTokenValue,
  update: UpdateCurlyReference,
): ObjectStrokeStyleDesignTokensCollectionTokenValue {
  return {
    dashArray: updateStrokeStyleDesignTokensCollectionTokenValueDashArrayReferences(
      value.dashArray,
      update,
    ),
    lineCap: value.lineCap,
  };
}
