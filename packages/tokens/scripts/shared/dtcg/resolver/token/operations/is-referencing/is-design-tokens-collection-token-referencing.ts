import type { CurlyReference } from '../../../../design-token/reference/types/curly/curly-reference.ts';
import { isCurlyReference } from '../../../../design-token/reference/types/curly/is-curly-reference.ts';
import {
  type GenericDesignTokensCollectionToken,
  isDesignTokensCollectionTokenWithType,
} from '../../design-tokens-collection-token.ts';
import { isBorderDesignTokensCollectionToken } from '../../types/composite/border/is-border-design-tokens-collection-token.ts';
import { isBorderDesignTokensCollectionTokenValueReferencing } from '../../types/composite/border/value/operations/is-referencing/is-border-design-tokens-collection-token-value-referencing.ts';
import { isGradientDesignTokensCollectionToken } from '../../types/composite/gradient/is-gradient-design-tokens-collection-token.ts';
import { isShadowDesignTokensCollectionToken } from '../../types/composite/shadow/is-shadow-design-tokens-collection-token.ts';
import { isStrokeStyleDesignTokensCollectionToken } from '../../types/composite/stroke-style/is-stroke-style-design-tokens-collection-token.ts';
import { isTransitionDesignTokensCollectionToken } from '../../types/composite/transition/is-transition-design-tokens-collection-token.ts';
import { isTypographyDesignTokensCollectionToken } from '../../types/composite/typography/is-typography-design-tokens-collection-token.ts';
import { isTypographyDesignTokensCollectionTokenValueReferencing } from '../../types/composite/typography/value/is-referencing/is-typography-design-tokens-collection-token-value-referencing.ts';

export function isDesignTokensCollectionTokenReferencing(
  token: GenericDesignTokensCollectionToken,
  target: CurlyReference,
): boolean {
  if (isCurlyReference(token.value)) {
    return token.value === target;
  } else {
    if (!isDesignTokensCollectionTokenWithType(token)) {
      throw new Error('Expected token with type.');
    }

    if (isBorderDesignTokensCollectionToken(token)) {
      return isBorderDesignTokensCollectionTokenValueReferencing(token.value, target);
    } else if (isGradientDesignTokensCollectionToken(token)) {
      throw 'TODO: implement'; // TODO
    } else if (isShadowDesignTokensCollectionToken(token)) {
      throw 'TODO: implement'; // TODO
    } else if (isStrokeStyleDesignTokensCollectionToken(token)) {
      throw 'TODO: implement'; // TODO
    } else if (isTransitionDesignTokensCollectionToken(token)) {
      throw 'TODO: implement'; // TODO
    } else if (isTypographyDesignTokensCollectionToken(token)) {
      return isTypographyDesignTokensCollectionTokenValueReferencing(token.value, target);
    } else {
      return false;
    }
  }
}
