import { isDesignTokenReference } from '../../../../design-token/reference/is-design-token-reference.ts';
import type { ResolvedDesignToken } from '../../../../design-token/reference/resolve/token/resolved-design-token.ts';
import { designTokenReferenceToCurlyReference } from '../../../../design-token/reference/to/curly-reference/design-token-reference-to-curly-reference.ts';
import { isJsonReference } from '../../../../design-token/reference/types/json/is-json-reference.ts';
import type { ValueOrDesignTokenReference } from '../../../../design-token/reference/value-or/value-or-design-token-reference.ts';
import type { FontFamilyDesignToken } from '../../../../design-token/token/types/base/types/font-family/font-family-design-token.ts';
import type { FontFamilyDesignTokenValue } from '../../../../design-token/token/types/base/types/font-family/value/font-family-design-token-value.ts';
import { isStringFontFamilyDesignTokenValue } from '../../../../design-token/token/types/base/types/font-family/value/types/string/is-string-font-family-design-token-value.ts';
import type { DesignTokenTreeToFigmaFormatContext } from '../../design-token-tree-to-figma-format-context.ts';

export function fontFamilyDesignTokenValueToFigmaValue(
  $value: FontFamilyDesignTokenValue,
  _ctx: DesignTokenTreeToFigmaFormatContext,
): string {
  if (isStringFontFamilyDesignTokenValue($value)) {
    return $value;
  } else {
    return $value
      .map((item: ValueOrDesignTokenReference<string>): string => {
        if (isJsonReference(item)) {
          throw new Error('JSON references are not supported yet.');
        }
        return item.includes(' ') ? JSON.stringify(item) : item;
      })
      .join(', ');
  }
}

export function resolvedFontFamilyDesignTokenToFigmaObject(
  { $value: $originalValue }: FontFamilyDesignToken,
  { $value, $description }: ResolvedDesignToken<'fontFamily', FontFamilyDesignTokenValue>,
  ctx: DesignTokenTreeToFigmaFormatContext,
): any {
  return {
    $type: 'string',
    $value: isDesignTokenReference($originalValue)
      ? designTokenReferenceToCurlyReference($originalValue)
      : fontFamilyDesignTokenValueToFigmaValue($value, ctx),
    $description,
  };
}
