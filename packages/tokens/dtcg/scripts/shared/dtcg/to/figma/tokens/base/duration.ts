import { isDesignTokenReference } from '../../../../design-token/reference/is-design-token-reference.ts';
import type { ResolvedDesignToken } from '../../../../design-token/reference/resolve/token/resolved-design-token.ts';
import { designTokenReferenceToCurlyReference } from '../../../../design-token/reference/to/curly-reference/design-token-reference-to-curly-reference.ts';
import { isJsonReference } from '../../../../design-token/reference/types/json/is-json-reference.ts';
import type { DurationDesignToken } from '../../../../design-token/token/types/base/types/duration/duration-design-token.ts';
import type { DurationDesignTokenValue } from '../../../../design-token/token/types/base/types/duration/value/duration-design-token-value.ts';
import type { DesignTokenTreeToFigmaFormatContext } from '../../design-token-tree-to-figma-format-context.ts';

export function durationDesignTokenValueToFigmaValue(
  { value, unit }: DurationDesignTokenValue,
  _ctx: DesignTokenTreeToFigmaFormatContext,
): number {
  if (isJsonReference(value) || isJsonReference(unit)) {
    throw new Error('JSON references are not supported yet.');
  }

  return unit === 's' ? value * 1000 : value;
}

export function resolvedDurationDesignTokenToFigmaObject(
  { $value: $originalValue }: DurationDesignToken,
  { $value, $description }: ResolvedDesignToken<'duration', DurationDesignTokenValue>,
  ctx: DesignTokenTreeToFigmaFormatContext,
): any {
  return {
    $type: 'number',
    $value: isDesignTokenReference($originalValue)
      ? designTokenReferenceToCurlyReference($originalValue)
      : durationDesignTokenValueToFigmaValue($value, ctx),
    $description,
  };
}
