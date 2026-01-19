import type { TransitionDesignTokensCollectionToken } from '../../../../../../token/types/composite/transition/transition-design-tokens-collection-token.ts';
import type { TransitionDesignTokensCollectionTokenValue } from '../../../../../../token/types/composite/transition/value/transition-design-tokens-collection-token-value.ts';
import type { CssVariableDeclaration } from '../../../../css-variable-declaration.ts';
import {
  designTokensCollectionTokenWithMapValueToCssVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-css-variable-declaration.ts';
import {
  transitionDesignTokensCollectionTokenValueToCssValue,
  type TransitionDesignTokensCollectionTokenValueToCssValueOptions,
} from './value/transition-design-tokens-collection-token-value-to-css-value.ts';

export interface TransitionDesignTokensCollectionTokenToCssVariableDeclarationOptions
  extends
    DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions,
    TransitionDesignTokensCollectionTokenValueToCssValueOptions {}

export function transitionDesignTokensCollectionTokenToCssVariableDeclaration(
  token: TransitionDesignTokensCollectionToken,
  options?: TransitionDesignTokensCollectionTokenToCssVariableDeclarationOptions,
): CssVariableDeclaration {
  return designTokensCollectionTokenWithMapValueToCssVariableDeclaration(
    token,
    (value: TransitionDesignTokensCollectionTokenValue): string =>
      transitionDesignTokensCollectionTokenValueToCssValue(value, options),
    options,
  );
}
