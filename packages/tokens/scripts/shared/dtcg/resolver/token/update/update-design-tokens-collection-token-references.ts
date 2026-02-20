import type { CurlyReference } from '../../../design-token/reference/types/curly/curly-reference.ts';
import { isCurlyReference } from '../../../design-token/reference/types/curly/is-curly-reference.ts';
import type { UpdateCurlyReference } from '../../../design-token/reference/types/curly/update/update-curly-reference.ts';
import type { GenericDesignTokensCollectionToken } from '../design-tokens-collection-token.ts';
import { isBorderDesignTokensCollectionToken } from '../types/composite/border/is-border-design-tokens-collection-token.ts';
import { updateBorderDesignTokensCollectionTokenValueReferences } from '../types/composite/border/value/update/update-border-design-tokens-collection-token-value-references.ts';
import { isGradientDesignTokensCollectionToken } from '../types/composite/gradient/is-gradient-design-tokens-collection-token.ts';
import { updateGradientDesignTokensCollectionTokenValueReferences } from '../types/composite/gradient/value/update/update-gradient-design-tokens-collection-token-value-references.ts';
import { isShadowDesignTokensCollectionToken } from '../types/composite/shadow/is-shadow-design-tokens-collection-token.ts';
import { updateShadowDesignTokensCollectionTokenValueReferences } from '../types/composite/shadow/value/update/update-shadow-design-tokens-collection-token-value-references.ts';
import { isStrokeStyleDesignTokensCollectionToken } from '../types/composite/stroke-style/is-stroke-style-design-tokens-collection-token.ts';
import { updateStrokeStyleDesignTokensCollectionTokenValueReferences } from '../types/composite/stroke-style/value/update/update-stroke-style-design-tokens-collection-token-value-references.ts';
import { isTransitionDesignTokensCollectionToken } from '../types/composite/transition/is-transition-design-tokens-collection-token.ts';
import { updateTransitionDesignTokensCollectionTokenValueReferences } from '../types/composite/transition/value/update/update-transition-design-tokens-collection-token-value-references.ts';
import { isTypographyDesignTokensCollectionToken } from '../types/composite/typography/is-typography-design-tokens-collection-token.ts';
import { updateTypographyDesignTokensCollectionTokenValueReferences } from '../types/composite/typography/value/update/update-typography-design-tokens-collection-token-value-references.ts';

export function updateDesignTokensCollectionTokenReferences(
  token: GenericDesignTokensCollectionToken,
  update: UpdateCurlyReference,
): GenericDesignTokensCollectionToken {
  let value: unknown | CurlyReference = token.value;

  if (isCurlyReference(token.value)) {
    value = update(token.value);
  } else {
    console.assert(token.type !== undefined);

    if (isBorderDesignTokensCollectionToken(token)) {
      value = updateBorderDesignTokensCollectionTokenValueReferences(token.value, update);
    } else if (isGradientDesignTokensCollectionToken(token)) {
      value = updateGradientDesignTokensCollectionTokenValueReferences(token.value, update);
    } else if (isShadowDesignTokensCollectionToken(token)) {
      value = updateShadowDesignTokensCollectionTokenValueReferences(token.value, update);
    } else if (isStrokeStyleDesignTokensCollectionToken(token)) {
      value = updateStrokeStyleDesignTokensCollectionTokenValueReferences(token.value, update);
    } else if (isTransitionDesignTokensCollectionToken(token)) {
      value = updateTransitionDesignTokensCollectionTokenValueReferences(token.value, update);
    } else if (isTypographyDesignTokensCollectionToken(token)) {
      value = updateTypographyDesignTokensCollectionTokenValueReferences(token.value, update);
    }
  }

  return {
    ...token,
    value,
  };
}
