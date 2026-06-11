import type { ShadowDesignTokensCollectionToken } from '../../../../../../token/types/composite/shadow/shadow-design-tokens-collection-token.ts';
import type { ShadowDesignTokensCollectionTokenValue } from '../../../../../../token/types/composite/shadow/value/shadow-design-tokens-collection-token-value.ts';
import type { KotlinVariableDeclaration } from '../../../../kotlin-variable-declaration/kotlin-variable-declaration.ts';
import type { KotlinVariableDeclarationShadowValue } from '../../../../kotlin-variable-declaration/value/built-in/shadow/kotlin-variable-declaration-shadow-value.ts';
import {
  designTokensCollectionTokenWithMapValueToKotlinVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-kotlin-variable-declaration.ts';
import {
  shadowDesignTokensCollectionTokenValueToKotlinValue,
  type ShadowDesignTokensCollectionTokenValueToKotlinValueOptions,
} from './value/shadow-design-tokens-collection-token-value-to-kotlin-value.ts';

export interface ShadowDesignTokensCollectionTokenToKotlinVariableDeclarationOptions
  extends
    DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions,
    ShadowDesignTokensCollectionTokenValueToKotlinValueOptions {}

export function shadowDesignTokensCollectionTokenToKotlinVariableDeclaration(
  token: ShadowDesignTokensCollectionToken,
  options?: ShadowDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
): KotlinVariableDeclaration {
  return designTokensCollectionTokenWithMapValueToKotlinVariableDeclaration(
    token,
    (value: ShadowDesignTokensCollectionTokenValue): KotlinVariableDeclarationShadowValue =>
      shadowDesignTokensCollectionTokenValueToKotlinValue(value, options),
    options,
  );
}
