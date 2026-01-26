import { resolveValueOrJsonReference } from '../../../../../../../design-token/reference/types/json/value-or/resolve/resolve-value-or-json-reference.ts';
import type { ValueOrJsonReference } from '../../../../../../../design-token/reference/types/json/value-or/value-or-json-reference.ts';
import type { CubicBezierDesignTokenValue } from '../../../../../../../design-token/token/types/base/types/cubic-bezier/value/cubic-bezier-design-token-value.ts';
import type { CubicBezierDesignTokensCollectionTokenValue } from '../cubic-bezier-design-tokens-collection-token-value.ts';

export function cubicBezierDesignTokenValueToCubicBezierDesignTokensCollectionTokenValue(
  $value: CubicBezierDesignTokenValue,
  root: unknown,
): CubicBezierDesignTokensCollectionTokenValue {
  return $value.map((component: ValueOrJsonReference<number>): number => {
    return resolveValueOrJsonReference(component, root);
  }) as unknown as CubicBezierDesignTokensCollectionTokenValue;
}
