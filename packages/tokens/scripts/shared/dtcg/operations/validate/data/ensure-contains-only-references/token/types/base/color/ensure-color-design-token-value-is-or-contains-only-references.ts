import { isDesignTokenReference } from '../../../../../../../../design-token/reference/is-design-token-reference.ts';
import type { ValueOrDesignTokenReference } from '../../../../../../../../design-token/reference/value-or/value-or-design-token-reference.ts';
import type { ColorDesignTokenValue } from '../../../../../../../../design-token/token/types/base/types/color/value/color-design-token-value.ts';
import { ensureColorDesignTokenValueContainsOnlyReferences } from './ensure-color-design-token-value-contains-only-references.ts';

/**
 * NOTE: Curly reference is not official
 */
export function ensureColorDesignTokenValueIsOrContainsOnlyReferences(
  $value: ValueOrDesignTokenReference<ColorDesignTokenValue>,
): void {
  if (!isDesignTokenReference($value)) {
    ensureColorDesignTokenValueContainsOnlyReferences($value);
  }
}
