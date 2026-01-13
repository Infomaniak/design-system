import { isDesignTokenReference } from '../../../../design-token/reference/is-design-token-reference.ts';
import type { NumberDesignToken } from '../../../../design-token/token/types/base/types/number/number-design-token.ts';
import { designTokenReferenceToFigmaReference } from '../../references/design-token-reference-to-figma-reference.ts';

export function numberDesignTokenToFigmaObject({ $value }: NumberDesignToken): any {
  if (isDesignTokenReference($value)) {
    return {
      $type: 'number',
      $value: designTokenReferenceToFigmaReference($value),
    };
  }

  return {
    $type: 'number',
    $value: $value,
  };
}
