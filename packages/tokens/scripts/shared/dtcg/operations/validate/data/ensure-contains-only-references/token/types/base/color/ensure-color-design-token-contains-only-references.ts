import { isDesignTokenReference } from '../../../../../../../../design-token/reference/is-design-token-reference.ts';
import { expectDesignTokenReference } from '../../../../../../../../design-token/reference/value-or/expect/expect-design-token-reference.ts';
import type { ColorDesignToken } from '../../../../../../../../design-token/token/types/base/types/color/color-design-token.ts';

export function ensureColorDesignTokenContainsOnlyReferences(token: ColorDesignToken): void {
  /**
   * NOTE: Curly reference is not official
   */
  if (!isDesignTokenReference(token.$value)) {
    expectDesignTokenReference(token.$value.components);

    // NOTE: for alpha we allow "raw" values instead of just curly references (it provides a better experience in Figma)
    //   uncomment the following code when this exception is no more wanted
    // if (token.$value.alpha !== undefined) {
    //   expectDesignTokenReference(token.$value.alpha);
    // }
  }

  // NOTE: official
  // expectDesignTokenReference(token.$value);
}
