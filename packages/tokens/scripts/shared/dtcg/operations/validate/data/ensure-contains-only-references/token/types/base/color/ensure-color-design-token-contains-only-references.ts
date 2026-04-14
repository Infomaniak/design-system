import { expectDesignTokenReference } from '../../../../../../../../design-token/reference/value-or/expect/expect-design-token-reference.ts';
import type { ColorDesignToken } from '../../../../../../../../design-token/token/types/base/types/color/color-design-token.ts';

export function ensureColorDesignTokenContainsOnlyReferences(token: ColorDesignToken): void {
  expectDesignTokenReference(token.$value);
}
