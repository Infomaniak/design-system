import { expectDesignTokenReference } from '../../../../../../../../design-token/reference/value-or/expect/expect-design-token-reference.ts';
import type { DurationDesignToken } from '../../../../../../../../design-token/token/types/base/types/duration/duration-design-token.ts';

export function ensureDurationDesignTokenContainsOnlyReferences(token: DurationDesignToken): void {
  expectDesignTokenReference(token.$value);
}
