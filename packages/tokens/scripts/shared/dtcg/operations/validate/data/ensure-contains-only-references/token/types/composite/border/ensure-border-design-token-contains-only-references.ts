import { isDesignTokenReference } from '../../../../../../../../design-token/reference/is-design-token-reference.ts';
import { expectDesignTokenReference } from '../../../../../../../../design-token/reference/value-or/expect/expect-design-token-reference.ts';
import type { BorderDesignToken } from '../../../../../../../../design-token/token/types/composite/types/border/border-design-token.ts';
import type { BorderDesignTokenValue } from '../../../../../../../../design-token/token/types/composite/types/border/value/border-design-token-value.ts';

export function ensureBorderDesignTokenContainsOnlyReferences(token: BorderDesignToken): void {
  if (!isDesignTokenReference(token.$value)) {
    ensureBorderDesignTokenValueContainsOnlyReferences(token.$value);
  }
}

export function ensureBorderDesignTokenValueContainsOnlyReferences(
  value: BorderDesignTokenValue,
): void {
  expectDesignTokenReference(value.color);
  expectDesignTokenReference(value.width);
  expectDesignTokenReference(value.style);
}
