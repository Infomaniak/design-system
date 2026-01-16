import type { UpdateCurlyReference } from '../../../../../../../design-token/reference/types/curly/update/update-curly-reference.ts';
import { isPredefinedStrokeStyleDesignTokenValue } from '../../../../../../../design-token/token/types/composite/types/stroke-style/value/types/predefined/is-predefined-stroke-style-design-token-value.ts';
import type { StrokeStyleDesignTokensCollectionTokenValue } from '../stroke-style-design-tokens-collection-token-value.ts';
import { updateObjectStrokeStyleDesignTokensCollectionTokenValueReferences } from '../types/object/update/update-object-stroke-style-design-tokens-collection-token-value-references.ts';

export function updateStrokeStyleDesignTokensCollectionTokenValueReferences(
  value: StrokeStyleDesignTokensCollectionTokenValue,
  update: UpdateCurlyReference,
): StrokeStyleDesignTokensCollectionTokenValue {
  return isPredefinedStrokeStyleDesignTokenValue(value)
    ? value
    : updateObjectStrokeStyleDesignTokensCollectionTokenValueReferences(value, update);
}
