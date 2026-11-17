import { isDesignTokenReference } from '../../../../../../../../design-token/reference/is-design-token-reference.ts';
import { expectDesignTokenReference } from '../../../../../../../../design-token/reference/value-or/expect/expect-design-token-reference.ts';
import type { ShadowDesignToken } from '../../../../../../../../design-token/token/types/composite/types/shadow/shadow-design-token.ts';
import type { ObjectArrayShadowDesignTokenValue } from '../../../../../../../../design-token/token/types/composite/types/shadow/value/types/object-array/object-array-shadow-design-token-value.ts';
import { isObjectShadowDesignTokenValue } from '../../../../../../../../design-token/token/types/composite/types/shadow/value/types/object/is-object-shadow-design-token-value.ts';
import type { ObjectShadowDesignTokenValue } from '../../../../../../../../design-token/token/types/composite/types/shadow/value/types/object/object-shadow-design-token-value.ts';
import { ensureColorDesignTokenValueIsOrContainsOnlyReferences } from '../../base/color/ensure-color-design-token-value-is-or-contains-only-references.ts';

export function ensureShadowDesignTokenContainsOnlyReferences(token: ShadowDesignToken): void {
  if (!isDesignTokenReference(token.$value)) {
    if (isObjectShadowDesignTokenValue(token.$value)) {
      ensureObjectShadowDesignTokenValueContainsOnlyReferences(token.$value);
    } else {
      ensureObjectArrayShadowDesignTokenValueContainsOnlyReferences(token.$value);
    }
  }
}

export function ensureObjectShadowDesignTokenValueContainsOnlyReferences(
  value: ObjectShadowDesignTokenValue,
): void {
  /**
   * NOTE: Curly reference is not official
   */
  ensureColorDesignTokenValueIsOrContainsOnlyReferences(value.color);
  expectDesignTokenReference(value.offsetX);
  expectDesignTokenReference(value.offsetY);
  expectDesignTokenReference(value.blur);
  expectDesignTokenReference(value.spread);
}

export function ensureObjectArrayShadowDesignTokenValueContainsOnlyReferences(
  value: ObjectArrayShadowDesignTokenValue,
): void {
  for (const shadow of value) {
    if (!isDesignTokenReference(shadow)) {
      ensureObjectShadowDesignTokenValueContainsOnlyReferences(shadow);
    }
  }
}
