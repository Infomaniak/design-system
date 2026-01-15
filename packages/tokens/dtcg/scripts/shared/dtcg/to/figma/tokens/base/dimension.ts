import { isDesignTokenReference } from '../../../../design-token/reference/is-design-token-reference.ts';
import type { ResolvedDesignToken } from '../../../../design-token/reference/resolve/token/resolved-design-token.ts';
import { designTokenReferenceToCurlyReference } from '../../../../design-token/reference/to/curly-reference/design-token-reference-to-curly-reference.ts';
import { isJsonReference } from '../../../../design-token/reference/types/json/is-json-reference.ts';
import type { DimensionDesignToken } from '../../../../design-token/token/types/base/types/dimension/dimension-design-token.ts';
import type { DimensionDesignTokenValue } from '../../../../design-token/token/types/base/types/dimension/value/dimension-design-token-value.ts';
import type { DesignTokenTreeToFigmaFormatContext } from '../../design-token-tree-to-figma-format-context.ts';

export function dimensionDesignTokenValueToFigmaValue(
  { value, unit }: DimensionDesignTokenValue,
  _ctx: DesignTokenTreeToFigmaFormatContext,
): number {
  if (isJsonReference(value) || isJsonReference(unit)) {
    throw new Error('JSON references are not supported yet.');
  }

  return unit === 'rem' ? value * 16 : value;
}

export function resolvedDimensionDesignTokenToFigmaObject(
  { $value: $originalValue }: DimensionDesignToken,
  { $value, $description }: ResolvedDesignToken<'dimension', DimensionDesignTokenValue>,
  ctx: DesignTokenTreeToFigmaFormatContext,
): any {
  return {
    $type: 'number',
    $value: isDesignTokenReference($originalValue)
      ? designTokenReferenceToCurlyReference($originalValue)
      : dimensionDesignTokenValueToFigmaValue($value, ctx),
    $description,
  };
}
