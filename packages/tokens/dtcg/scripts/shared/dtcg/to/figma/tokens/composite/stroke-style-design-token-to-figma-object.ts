import { isDesignTokenReference } from '../../../../design-token/reference/is-design-token-reference.ts';
import type { StrokeStyleDesignToken } from '../../../../design-token/token/types/composite/types/stroke-style/stroke-style-design-token.ts';
import { isPredefinedStrokeStyleDesignTokenValue } from '../../../../design-token/token/types/composite/types/stroke-style/value/types/predefined/is-predefined-stroke-style-design-token-value.ts';
import { designTokenReferenceToFigmaReference } from '../../references/design-token-reference-to-figma-reference.ts';

export function strokeStyleDesignTokenToFigmaObject({ $value }: StrokeStyleDesignToken): any {
  if (isDesignTokenReference($value)) {
    return {
      $type: 'string',
      $value: designTokenReferenceToFigmaReference($value),
    };
  }

  if (isPredefinedStrokeStyleDesignTokenValue($value)) {
    return {
      $type: 'string',
      $value: $value,
    };
  } else {
    throw new Error('Unsupported ObjectStrokeStyleDesignTokenValue.');
  }
}
