import { expectDesignTokenReference } from '../../../../../../../../design-token/reference/value-or/expect/expect-design-token-reference.ts';
import type { DimensionDesignToken } from '../../../../../../../../design-token/token/types/base/types/dimension/dimension-design-token.ts';

export function ensureDimensionDesignTokenContainsOnlyReferences(
  token: DimensionDesignToken,
): void {
  expectDesignTokenReference(token.$value);
}
