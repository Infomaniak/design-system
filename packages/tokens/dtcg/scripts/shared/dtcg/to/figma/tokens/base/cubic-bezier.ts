import type { ResolvedDesignToken } from '../../../../design-token/reference/resolve/token/resolved-design-token.ts';
import type { CubicBezierDesignToken } from '../../../../design-token/token/types/base/types/cubic-bezier/cubic-bezier-design-token.ts';
import type { CubicBezierDesignTokenValue } from '../../../../design-token/token/types/base/types/cubic-bezier/value/cubic-bezier-design-token-value.ts';
import type { DesignTokenTreeToFigmaFormatContext } from '../../design-token-tree-to-figma-format-context.ts';
export function cubicBezierDesignTokenValueToFigmaValue(
  _$value: CubicBezierDesignTokenValue,
  _ctx: DesignTokenTreeToFigmaFormatContext,
): any {
  throw new Error('Cubic bezier design tokens are not supported yet by figma.');
}

export function resolvedCubicBezierDesignTokenToFigmaObject(
  _token: CubicBezierDesignToken,
  _resolvedToken: ResolvedDesignToken<'cubicBezier', CubicBezierDesignTokenValue>,
  _ctx: DesignTokenTreeToFigmaFormatContext,
): any {
  throw new Error('Cubic bezier design tokens are not supported yet by figma.');
}
