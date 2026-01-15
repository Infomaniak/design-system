import { isDesignTokenReference } from '../../../../design-token/reference/is-design-token-reference.ts';
import type { ResolvedDesignToken } from '../../../../design-token/reference/resolve/token/resolved-design-token.ts';
import { designTokenReferenceToCurlyReference } from '../../../../design-token/reference/to/curly-reference/design-token-reference-to-curly-reference.ts';
import type { StrokeStyleDesignToken } from '../../../../design-token/token/types/composite/types/stroke-style/stroke-style-design-token.ts';
import type { StrokeStyleDesignTokenValue } from '../../../../design-token/token/types/composite/types/stroke-style/value/stroke-style-design-token-value.ts';
import { isPredefinedStrokeStyleDesignTokenValue } from '../../../../design-token/token/types/composite/types/stroke-style/value/types/predefined/is-predefined-stroke-style-design-token-value.ts';
import type { DesignTokenTreeToFigmaFormatContext } from '../../design-token-tree-to-figma-format-context.ts';

export function strokeStyleDesignTokenValueToFigmaValue(
  $value: StrokeStyleDesignTokenValue,
  _ctx: DesignTokenTreeToFigmaFormatContext,
): string {
  if (isPredefinedStrokeStyleDesignTokenValue($value)) {
    return $value;
  } else {
    throw new Error('Unsupported ObjectStrokeStyleDesignTokenValue.');
  }
}

export function resolvedStrokeStyleDesignTokenToFigmaObject(
  { $value: $originalValue }: StrokeStyleDesignToken,
  { $value, $description }: ResolvedDesignToken<'strokeStyle', StrokeStyleDesignTokenValue>,
  ctx: DesignTokenTreeToFigmaFormatContext,
): any {
  return {
    $type: 'string',
    $value: isDesignTokenReference($originalValue)
      ? designTokenReferenceToCurlyReference($originalValue)
      : strokeStyleDesignTokenValueToFigmaValue($value, ctx),
    $description,
  };
}
