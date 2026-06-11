import type { FontWeightDesignTokensCollectionToken } from '../../../../../../token/types/base/font-weight/font-weight-design-tokens-collection-token.ts';
import type { KotlinVariableDeclaration } from '../../../../kotlin-variable-declaration/kotlin-variable-declaration.ts';
import {
  designTokensCollectionTokenWithMapValueToKotlinVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-kotlin-variable-declaration.ts';
import { fontWeightDesignTokensCollectionTokenValueToKotlinValue } from './value/font-weight-design-tokens-collection-token-value-to-kotlin-value.ts';

export type FontWeightDesignTokensCollectionTokenToKotlinVariableDeclarationOptions =
  DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions;

export function fontWeightDesignTokensCollectionTokenToKotlinVariableDeclaration(
  token: FontWeightDesignTokensCollectionToken,
  options?: FontWeightDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
): KotlinVariableDeclaration {
  return designTokensCollectionTokenWithMapValueToKotlinVariableDeclaration(
    token,
    fontWeightDesignTokensCollectionTokenValueToKotlinValue,
    options,
  );
}
