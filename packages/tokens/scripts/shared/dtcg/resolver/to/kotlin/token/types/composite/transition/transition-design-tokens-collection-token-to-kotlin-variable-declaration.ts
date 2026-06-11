import type { TransitionDesignTokensCollectionToken } from '../../../../../../token/types/composite/transition/transition-design-tokens-collection-token.ts';
import type { TransitionDesignTokensCollectionTokenValue } from '../../../../../../token/types/composite/transition/value/transition-design-tokens-collection-token-value.ts';
import type { KotlinVariableDeclaration } from '../../../../kotlin-variable-declaration/kotlin-variable-declaration.ts';
import {
  designTokensCollectionTokenWithMapValueToKotlinVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-kotlin-variable-declaration.ts';
import {
  transitionDesignTokensCollectionTokenValueToKotlinValue,
  type TransitionDesignTokensCollectionTokenValueToKotlinValueOptions,
} from './value/transition-design-tokens-collection-token-value-to-kotlin-value.ts';

export interface TransitionDesignTokensCollectionTokenToKotlinVariableDeclarationOptions
  extends
    DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions,
    TransitionDesignTokensCollectionTokenValueToKotlinValueOptions {}

export function transitionDesignTokensCollectionTokenToKotlinVariableDeclaration(
  token: TransitionDesignTokensCollectionToken,
  options?: TransitionDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
): KotlinVariableDeclaration {
  return designTokensCollectionTokenWithMapValueToKotlinVariableDeclaration(
    token,
    (value: TransitionDesignTokensCollectionTokenValue): never =>
      transitionDesignTokensCollectionTokenValueToKotlinValue(value, options),
    options,
  );
}
