import { isDesignTokenReference } from '../../../../../../../../design-token/reference/is-design-token-reference.ts';
import { expectDesignTokenReference } from '../../../../../../../../design-token/reference/value-or/expect/expect-design-token-reference.ts';
import type { ColorDesignToken } from '../../../../../../../../design-token/token/types/base/types/color/color-design-token.ts';

export function ensureColorDesignTokenContainsOnlyReferences(token: ColorDesignToken): void {
  /**
   * NOTE: Curly reference is not official
   */
  if (!isDesignTokenReference(token.$value)) {
    expectDesignTokenReference(token.$value.components);
    expectDesignTokenReference(token.$value.alpha);
  }

  // NOTE: official
  // expectDesignTokenReference(token.$value);
}
