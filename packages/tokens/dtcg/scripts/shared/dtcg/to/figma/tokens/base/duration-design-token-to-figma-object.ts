import { isDesignTokenReference } from '../../../../design-token/reference/is-design-token-reference.ts';
import { isJsonReference } from '../../../../design-token/reference/types/json/is-json-reference.ts';
import type { DurationDesignToken } from '../../../../design-token/token/types/base/types/duration/duration-design-token.ts';
import { designTokenReferenceToFigmaReference } from '../../references/design-token-reference-to-figma-reference.ts';

export function durationDesignTokenToFigmaObject({ $value }: DurationDesignToken): any {
  if (isDesignTokenReference($value)) {
    return {
      $type: 'number',
      $value: designTokenReferenceToFigmaReference($value),
    };
  }

  const { value, unit } = $value;

  if (isJsonReference(value) || isJsonReference(unit)) {
    throw new Error('JSON references are not supported yet.');
  }

  return {
    $type: 'number',
    $value: unit === 's' ? value * 1000 : value,
  };
}
