import { isDesignTokenReference } from '../../../../design-token/reference/is-design-token-reference.ts';
import type { ResolvedDesignToken } from '../../../../design-token/reference/resolve/token/resolved-design-token.ts';
import { designTokenReferenceToCurlyReference } from '../../../../design-token/reference/to/curly-reference/design-token-reference-to-curly-reference.ts';
import type { NumberDesignToken } from '../../../../design-token/token/types/base/types/number/number-design-token.ts';
import type { NumberDesignTokenValue } from '../../../../design-token/token/types/base/types/number/value/number-design-token-value.ts';
import type { DesignTokenTreeToFigmaFormatContext } from '../../design-token-tree-to-figma-format-context.ts';

export function numberDesignTokenValueToFigmaValue(
  $value: NumberDesignTokenValue,
  _ctx: DesignTokenTreeToFigmaFormatContext,
): number {
  return $value;
}

export function resolvedNumberDesignTokenToFigmaObject(
  { $value: $originalValue }: NumberDesignToken,
  { $value, $description }: ResolvedDesignToken<'number', NumberDesignTokenValue>,
  ctx: DesignTokenTreeToFigmaFormatContext,
): any {
  return {
    $type: 'number',
    $value: isDesignTokenReference($originalValue)
      ? designTokenReferenceToCurlyReference($originalValue)
      : numberDesignTokenValueToFigmaValue($value, ctx),
    $description,
  };
}
