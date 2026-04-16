import { expectDesignTokenReference } from '../../../../../../../../design-token/reference/value-or/expect/expect-design-token-reference.ts';
import type { FontWeightDesignToken } from '../../../../../../../../design-token/token/types/base/types/font-weight/font-weight-design-token.ts';

export function ensureFontWeightDesignTokenContainsOnlyReferences(
  token: FontWeightDesignToken,
): void {
  expectDesignTokenReference(token.$value);
}
