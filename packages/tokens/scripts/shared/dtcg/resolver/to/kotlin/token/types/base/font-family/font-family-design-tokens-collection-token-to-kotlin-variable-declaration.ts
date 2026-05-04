import type { FontFamilyDesignTokensCollectionToken } from '../../../../../../token/types/base/font-family/font-family-design-tokens-collection-token.ts';
import type { KotlinVariableDeclaration } from '../../../../kotlin-variable-declaration/kotlin-variable-declaration.ts';
import {
  designTokensCollectionTokenWithMapValueToKotlinVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-kotlin-variable-declaration.ts';
import { fontFamilyDesignTokensCollectionTokenValueToKotlinValue } from './value/font-family-design-tokens-collection-token-value-to-kotlin-value.ts';

export type FontFamilyDesignTokensCollectionTokenToKotlinVariableDeclarationOptions =
  DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions;

export function fontFamilyDesignTokensCollectionTokenToKotlinVariableDeclaration(
  token: FontFamilyDesignTokensCollectionToken,
  options?: FontFamilyDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
): KotlinVariableDeclaration {
  return designTokensCollectionTokenWithMapValueToKotlinVariableDeclaration(
    token,
    fontFamilyDesignTokensCollectionTokenValueToKotlinValue,
    options,
  );
}
