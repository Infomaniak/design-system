import { expectDesignTokenReference } from '../../../../../../../../design-token/reference/value-or/expect/expect-design-token-reference.ts';
import type { CubicBezierDesignToken } from '../../../../../../../../design-token/token/types/base/types/cubic-bezier/cubic-bezier-design-token.ts';

export function ensureCubicBezierDesignTokenContainsOnlyReferences(
  token: CubicBezierDesignToken,
): void {
  expectDesignTokenReference(token.$value);
}
