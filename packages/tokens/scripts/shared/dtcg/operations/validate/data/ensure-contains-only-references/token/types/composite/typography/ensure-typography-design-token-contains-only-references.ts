import { isDesignTokenReference } from '../../../../../../../../design-token/reference/is-design-token-reference.ts';
import { expectDesignTokenReference } from '../../../../../../../../design-token/reference/value-or/expect/expect-design-token-reference.ts';
import type { TypographyDesignToken } from '../../../../../../../../design-token/token/types/composite/types/typography/typography-design-token.ts';
import type { TypographyDesignTokenValue } from '../../../../../../../../design-token/token/types/composite/types/typography/value/typography-design-token-value.ts';

export function ensureTypographyDesignTokenContainsOnlyReferences(
  token: TypographyDesignToken,
): void {
  if (!isDesignTokenReference(token.$value)) {
    ensureTypographyDesignTokenValueContainsOnlyReferences(token.$value);
  }
}

export function ensureTypographyDesignTokenValueContainsOnlyReferences(
  value: TypographyDesignTokenValue,
): void {
  expectDesignTokenReference(value.fontFamily);
  expectDesignTokenReference(value.fontSize);
  expectDesignTokenReference(value.fontWeight);
  expectDesignTokenReference(value.letterSpacing);
  expectDesignTokenReference(value.lineHeight);
}
