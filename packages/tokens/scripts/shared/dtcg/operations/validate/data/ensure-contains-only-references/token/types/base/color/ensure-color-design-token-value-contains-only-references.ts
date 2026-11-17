import { expectDesignTokenReference } from '../../../../../../../../design-token/reference/value-or/expect/expect-design-token-reference.ts';
import type { ColorDesignTokenValue } from '../../../../../../../../design-token/token/types/base/types/color/value/color-design-token-value.ts';

/**
 * NOTE: Curly reference is not official
 */
export function ensureColorDesignTokenValueContainsOnlyReferences(
  $value: ColorDesignTokenValue,
): void {
  expectDesignTokenReference($value.components);

  // NOTE: for alpha we allow "raw" values instead of just curly references (it provides a better experience in Figma)
  //   uncomment the following code when this exception is no more wanted
  // if (token.$value.alpha !== undefined) {
  //   expectDesignTokenReference(token.$value.alpha);
  // }
}
