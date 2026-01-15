import { isDesignTokenReference } from '../../../../design-token/reference/is-design-token-reference.ts';
import type { ResolvedDesignToken } from '../../../../design-token/reference/resolve/token/resolved-design-token.ts';
import { designTokenReferenceToCurlyReference } from '../../../../design-token/reference/to/curly-reference/design-token-reference-to-curly-reference.ts';
import type { FontWeightDesignToken } from '../../../../design-token/token/types/base/types/font-weight/font-weight-design-token.ts';
import type { FontWeightDesignTokenValue } from '../../../../design-token/token/types/base/types/font-weight/value/font-weight-design-token-value.ts';
import { isPredefinedFontWeightDesignTokenValue } from '../../../../design-token/token/types/base/types/font-weight/value/types/predefined/is-predefined-font-weight-design-token-value.ts';
import { predefinedFontWeightDesignTokenValueToNumberValue } from '../../../../design-token/token/types/base/types/font-weight/value/types/predefined/to/number-value/predefined-font-weight-design-token-value-to-number-value.ts';
import type { DesignTokenTreeToFigmaFormatContext } from '../../design-token-tree-to-figma-format-context.ts';

export function fontWeightDesignTokenValueToFigmaValue(
  $value: FontWeightDesignTokenValue,
  _ctx: DesignTokenTreeToFigmaFormatContext,
): number {
  return isPredefinedFontWeightDesignTokenValue($value)
    ? predefinedFontWeightDesignTokenValueToNumberValue($value)
    : $value;
}

export function resolvedFontWeightDesignTokenToFigmaObject(
  { $value: $originalValue }: FontWeightDesignToken,
  { $value, $description }: ResolvedDesignToken<'fontWeight', FontWeightDesignTokenValue>,
  ctx: DesignTokenTreeToFigmaFormatContext,
): any {
  return {
    $type: 'number',
    $value: isDesignTokenReference($originalValue)
      ? designTokenReferenceToCurlyReference($originalValue)
      : fontWeightDesignTokenValueToFigmaValue($value, ctx),
    $description,
  };
}
