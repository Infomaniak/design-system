import type { ResolvedDesignToken } from '../../../../design-token/reference/resolve/token/resolved-design-token.ts';
import type { TypographyDesignToken } from '../../../../design-token/token/types/composite/types/typography/typography-design-token.ts';
import type { TypographyDesignTokenValue } from '../../../../design-token/token/types/composite/types/typography/value/typography-design-token-value.ts';
import type { DesignTokenTreeToFigmaFormatContext } from '../../design-token-tree-to-figma-format-context.ts';
import { designTokenTreeToFigmaFormat } from '../../design-token-tree-to-figma-format.ts';

export function resolvedTypographyDesignTokenToFigmaObject(
  _token: TypographyDesignToken,
  { $value, ...properties }: ResolvedDesignToken<'typography', TypographyDesignTokenValue>,
  ctx: DesignTokenTreeToFigmaFormatContext,
): any {
  const { fontFamily, fontSize, fontWeight, letterSpacing, lineHeight } = $value;

  return {
    fontFamily: designTokenTreeToFigmaFormat(
      {
        ...properties,
        $type: 'fontFamily',
        $value: fontFamily,
      },
      ctx,
    ),
    fontSize: designTokenTreeToFigmaFormat(
      {
        ...properties,
        $type: 'dimension',
        $value: fontSize,
      },
      ctx,
    ),
    fontWeight: designTokenTreeToFigmaFormat(
      {
        ...properties,
        $type: 'fontWeight',
        $value: fontWeight,
      },
      ctx,
    ),
    letterSpacing: designTokenTreeToFigmaFormat(
      {
        ...properties,
        $type: 'dimension',
        $value: letterSpacing,
      },
      ctx,
    ),
    lineHeight: designTokenTreeToFigmaFormat(
      {
        ...properties,
        $type: 'number',
        $value: lineHeight,
      },
      ctx,
    ),
  };
}
