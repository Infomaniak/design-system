import type { StrokeStyleDesignTokenValue } from '../../../../../../../design-token/token/types/composite/types/stroke-style/value/stroke-style-design-token-value.ts';
import { isPredefinedStrokeStyleDesignTokenValue } from '../../../../../../../design-token/token/types/composite/types/stroke-style/value/types/predefined/is-predefined-stroke-style-design-token-value.ts';
import type { StrokeStyleDesignTokensCollectionTokenValue } from '../stroke-style-design-tokens-collection-token-value.ts';
import { objectStrokeStyleDesignTokenValueToObjectStrokeStyleDesignTokensCollectionTokenValue } from '../types/object/from/object-stroke-style-design-token-value-to-object-stroke-style-design-tokens-collection-token-value.ts';

export function strokeStyleDesignTokenValueToStrokeStyleDesignTokensCollectionTokenValue(
  $value: StrokeStyleDesignTokenValue,
  root: unknown,
): StrokeStyleDesignTokensCollectionTokenValue {
  return isPredefinedStrokeStyleDesignTokenValue($value)
    ? $value
    : objectStrokeStyleDesignTokenValueToObjectStrokeStyleDesignTokensCollectionTokenValue(
        $value,
        root,
      );
}
