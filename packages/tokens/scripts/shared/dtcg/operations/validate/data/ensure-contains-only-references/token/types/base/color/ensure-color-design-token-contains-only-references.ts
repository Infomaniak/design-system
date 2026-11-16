import type { ColorDesignToken } from '../../../../../../../../design-token/token/types/base/types/color/color-design-token.ts';
import { ensureColorDesignTokenValueIsOrContainsOnlyReferences } from './ensure-color-design-token-value-is-or-contains-only-references.ts';

export function ensureColorDesignTokenContainsOnlyReferences(token: ColorDesignToken): void {
  /**
   * NOTE: Curly reference is not official
   */
  ensureColorDesignTokenValueIsOrContainsOnlyReferences(token.$value);

  // NOTE: official
  // expectDesignTokenReference(token.$value);
}
