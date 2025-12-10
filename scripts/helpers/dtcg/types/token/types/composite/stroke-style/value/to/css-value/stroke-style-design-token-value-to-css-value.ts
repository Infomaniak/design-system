import type { StrokeStyleDesignTokenValue } from '../../stroke-style-design-token-value.ts';
import { isObjectStrokeStyleDesignTokenValue } from '../../types/object/is-object-stroke-style-design-token-value.ts';
import { predefinedStrokeStyleDesignTokenValueToCssValue } from '../../types/predefined/to/css-value/predefined-stroke-style-design-token-value-to-css-value.ts';

export function strokeStyleDesignTokenValueToCssValue(value: StrokeStyleDesignTokenValue): string {
  if (isObjectStrokeStyleDesignTokenValue(value)) {
    throw new Error('ObjectStrokeStyleDesignTokenValue cannot be converted to CSS value.');
  } else {
    return predefinedStrokeStyleDesignTokenValueToCssValue(value);
  }
}
