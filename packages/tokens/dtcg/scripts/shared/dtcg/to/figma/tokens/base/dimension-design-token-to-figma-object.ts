import { isDesignTokenReference } from '../../../../design-token/reference/is-design-token-reference.ts';
import { isJsonReference } from '../../../../design-token/reference/types/json/is-json-reference.ts';
import type { DimensionDesignToken } from '../../../../design-token/token/types/base/types/dimension/dimension-design-token.ts';
import { designTokenReferenceToFigmaReference } from '../../references/design-token-reference-to-figma-reference.ts';

export function dimensionDesignTokenToFigmaObject({ $value }: DimensionDesignToken): any {
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
    $value: unit === 'rem' ? value * 16 : value,
  };
}

// export function dimensionDesignTokenToFigmaObject({ $value }: DimensionDesignToken): any {
//   if (isDesignTokenReference($value)) {
//     return {
//       $type: 'dimension',
//       $value: designTokenReferenceToFigmaReference($value),
//     };
//   }
//
//   const { value, unit } = $value;
//
//   if (isJsonReference(value) || isJsonReference(unit)) {
//     throw new Error('JSON references are not supported yet.');
//   }
//
//   return {
//     $type: 'dimension',
//     $value: `${value}${unit}`,
//   };
// }
