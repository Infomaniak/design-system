import { isDesignTokenReference } from '../../../../../../../../design-token/reference/is-design-token-reference.ts';
import { expectDesignTokenReference } from '../../../../../../../../design-token/reference/value-or/expect/expect-design-token-reference.ts';
import type { TransitionDesignToken } from '../../../../../../../../design-token/token/types/composite/types/transition/transition-design-token.ts';
import type { TransitionDesignTokenValue } from '../../../../../../../../design-token/token/types/composite/types/transition/value/transition-design-token-value.ts';

export function ensureTransitionDesignTokenContainsOnlyReferences(
  token: TransitionDesignToken,
): void {
  if (!isDesignTokenReference(token.$value)) {
    ensureTransitionDesignTokenValueContainsOnlyReferences(token.$value);
  }
}

export function ensureTransitionDesignTokenValueContainsOnlyReferences(
  value: TransitionDesignTokenValue,
): void {
  expectDesignTokenReference(value.duration);
  expectDesignTokenReference(value.delay);
  expectDesignTokenReference(value.timingFunction);
}
