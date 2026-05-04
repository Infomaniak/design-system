import type { ColorDesignTokensCollectionToken } from '../../../../../../token/types/base/color/color-design-tokens-collection-token.ts';
import type { ColorDesignTokensCollectionTokenValue } from '../../../../../../token/types/base/color/value/color-design-tokens-collection-token-value.ts';
import type { KotlinVariableDeclaration } from '../../../../kotlin-variable-declaration/kotlin-variable-declaration.ts';
import type { KotlinVariableDeclarationValue } from '../../../../kotlin-variable-declaration/value/kotlin-variable-declaration-value.ts';
import {
  designTokensCollectionTokenWithMapValueToKotlinVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-kotlin-variable-declaration.ts';
import { colorDesignTokensCollectionTokenValueToKotlinValue } from './value/color-design-tokens-collection-token-value-to-kotlin-value.ts';

export type ColorDesignTokensCollectionTokenToKotlinVariableDeclarationOptions =
  DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions;

export function colorDesignTokensCollectionTokenToKotlinVariableDeclaration(
  token: ColorDesignTokensCollectionToken,
  options?: ColorDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
): KotlinVariableDeclaration {
  return designTokensCollectionTokenWithMapValueToKotlinVariableDeclaration(
    token,
    (value: ColorDesignTokensCollectionTokenValue): KotlinVariableDeclarationValue =>
      colorDesignTokensCollectionTokenValueToKotlinValue(value),
    options,
  );
}
