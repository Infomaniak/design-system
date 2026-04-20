import { expectDesignTokenReference } from '../../../../../../../../design-token/reference/value-or/expect/expect-design-token-reference.ts';
import type { NumberDesignToken } from '../../../../../../../../design-token/token/types/base/types/number/number-design-token.ts';

export function ensureNumberDesignTokenContainsOnlyReferences(token: NumberDesignToken): void {
  expectDesignTokenReference(token.$value);
}
