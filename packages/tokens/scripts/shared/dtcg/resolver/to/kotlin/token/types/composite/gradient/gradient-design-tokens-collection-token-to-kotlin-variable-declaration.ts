import type { GradientDesignTokensCollectionToken } from '../../../../../../token/types/composite/gradient/gradient-design-tokens-collection-token.ts';
import type { GradientDesignTokensCollectionTokenValue } from '../../../../../../token/types/composite/gradient/value/gradient-design-tokens-collection-token-value.ts';
import type { KotlinVariableDeclaration } from '../../../../kotlin-variable-declaration/kotlin-variable-declaration.ts';
import {
  designTokensCollectionTokenWithMapValueToKotlinVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-kotlin-variable-declaration.ts';
import {
  gradientDesignTokensCollectionTokenValueToKotlinValue,
  type GradientDesignTokensCollectionTokenValueToKotlinValueOptions,
} from './value/gradient-design-tokens-collection-token-value-to-kotlin-value.ts';

export interface GradientDesignTokensCollectionTokenToKotlinVariableDeclarationOptions
  extends
    DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions,
    GradientDesignTokensCollectionTokenValueToKotlinValueOptions {}

export function gradientDesignTokensCollectionTokenToKotlinVariableDeclaration(
  token: GradientDesignTokensCollectionToken,
  options?: GradientDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
): KotlinVariableDeclaration {
  return designTokensCollectionTokenWithMapValueToKotlinVariableDeclaration(
    token,
    (value: GradientDesignTokensCollectionTokenValue): never =>
      gradientDesignTokensCollectionTokenValueToKotlinValue(value, options),
    options,
  );
}
