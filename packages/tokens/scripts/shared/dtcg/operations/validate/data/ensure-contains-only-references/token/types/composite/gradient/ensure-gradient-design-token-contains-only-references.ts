import { isDesignTokenReference } from '../../../../../../../../design-token/reference/is-design-token-reference.ts';
import { expectDesignTokenReference } from '../../../../../../../../design-token/reference/value-or/expect/expect-design-token-reference.ts';
import type { GradientDesignToken } from '../../../../../../../../design-token/token/types/composite/types/gradient/gradient-design-token.ts';
import type { GradientDesignTokenValue } from '../../../../../../../../design-token/token/types/composite/types/gradient/value/gradient-design-token-value.ts';
import type { ObjectGradientDesignTokenValue } from '../../../../../../../../design-token/token/types/composite/types/gradient/value/members/object/object-gradient-design-token-value.ts';

export function ensureGradientDesignTokenContainsOnlyReferences(token: GradientDesignToken): void {
  if (!isDesignTokenReference(token.$value)) {
    ensureGradientDesignTokenValueContainsOnlyReferences(token.$value);
  }
}

export function ensureGradientDesignTokenValueContainsOnlyReferences(
  value: GradientDesignTokenValue,
): void {
  for (const gradient of value) {
    if (!isDesignTokenReference(gradient)) {
      ensureObjectGradientDesignTokenValueContainsOnlyReferences(gradient);
    }
  }
}

export function ensureObjectGradientDesignTokenValueContainsOnlyReferences(
  value: ObjectGradientDesignTokenValue,
): void {
  expectDesignTokenReference(value.color);
  expectDesignTokenReference(value.position);
}
