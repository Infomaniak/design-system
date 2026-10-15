import type { UpdateCurlyReference } from '../../../../../../../../design-token/reference/types/curly/update/update-curly-reference.ts';
import { updateValueOrCurlyReference } from '../../../../../../../../design-token/reference/types/curly/value-or/update/update-value-or-curly-reference.ts';
import type { ColorDesignTokensCollectionTokenValue } from '../../color-design-tokens-collection-token-value.ts';

/**
 * NOTE: Curly reference is not official
 */
export function updateColorDesignTokensCollectionTokenValueReferences(
  value: ColorDesignTokensCollectionTokenValue,
  update: UpdateCurlyReference,
): ColorDesignTokensCollectionTokenValue {
  return {
    ...value,
    components: updateValueOrCurlyReference(value.components, update),
    alpha: updateValueOrCurlyReference(value.alpha, update),
  };
}
