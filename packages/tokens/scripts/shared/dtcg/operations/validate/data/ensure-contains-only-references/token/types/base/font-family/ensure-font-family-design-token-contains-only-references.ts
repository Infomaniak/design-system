import { expectDesignTokenReference } from '../../../../../../../../design-token/reference/value-or/expect/expect-design-token-reference.ts';
import type { FontFamilyDesignToken } from '../../../../../../../../design-token/token/types/base/types/font-family/font-family-design-token.ts';

export function ensureFontFamilyDesignTokenContainsOnlyReferences(
  token: FontFamilyDesignToken,
): void {
  expectDesignTokenReference(token.$value);
}
