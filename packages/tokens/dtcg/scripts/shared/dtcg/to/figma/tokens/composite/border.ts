import type { ResolvedDesignToken } from '../../../../design-token/reference/resolve/token/resolved-design-token.ts';
import type { BorderDesignToken } from '../../../../design-token/token/types/composite/types/border/border-design-token.ts';
import type { BorderDesignTokenValue } from '../../../../design-token/token/types/composite/types/border/value/border-design-token-value.ts';
import type { DesignTokenTreeToFigmaFormatContext } from '../../design-token-tree-to-figma-format-context.ts';
import { designTokenTreeToFigmaFormat } from '../../design-token-tree-to-figma-format.ts';

export function borderDesignTokenToFigmaObject(
  _token: BorderDesignToken,
  { $value, ...properties }: ResolvedDesignToken<'border', BorderDesignTokenValue>,
  ctx: DesignTokenTreeToFigmaFormatContext,
): any {
  const { color, width, style } = $value;

  return {
    color: designTokenTreeToFigmaFormat(
      {
        ...properties,
        $type: 'color',
        $value: color,
      },
      ctx,
    ),
    width: designTokenTreeToFigmaFormat(
      {
        ...properties,
        $type: 'dimension',
        $value: width,
      },
      ctx,
    ),
    style: designTokenTreeToFigmaFormat(
      {
        ...properties,
        $type: 'strokeStyle',
        $value: style,
      },
      ctx,
    ),
  };
}
