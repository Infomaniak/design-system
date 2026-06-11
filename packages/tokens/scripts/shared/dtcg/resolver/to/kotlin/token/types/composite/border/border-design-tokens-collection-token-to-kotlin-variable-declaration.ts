import type { BorderDesignTokensCollectionToken } from '../../../../../../token/types/composite/border/border-design-tokens-collection-token.ts';
import type { BorderDesignTokensCollectionTokenValue } from '../../../../../../token/types/composite/border/value/border-design-tokens-collection-token-value.ts';
import type { KotlinVariableDeclaration } from '../../../../kotlin-variable-declaration/kotlin-variable-declaration.ts';
import type { KotlinVariableDeclarationBorderStrokeValue } from '../../../../kotlin-variable-declaration/value/built-in/border-stroke/kotlin-variable-declaration-border-stroke-value.ts';
import {
  designTokensCollectionTokenWithMapValueToKotlinVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-kotlin-variable-declaration.ts';
import {
  borderDesignTokensCollectionTokenValueToKotlinValue,
  type BorderDesignTokensCollectionTokenValueToKotlinValueOptions,
} from './value/border-design-tokens-collection-token-value-to-kotlin-value.ts';

export interface BorderDesignTokensCollectionTokenToKotlinVariableDeclarationOptions
  extends
    DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions,
    BorderDesignTokensCollectionTokenValueToKotlinValueOptions {}

export function borderDesignTokensCollectionTokenToKotlinVariableDeclaration(
  token: BorderDesignTokensCollectionToken,
  options?: BorderDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
): KotlinVariableDeclaration {
  return designTokensCollectionTokenWithMapValueToKotlinVariableDeclaration(
    token,
    (value: BorderDesignTokensCollectionTokenValue): KotlinVariableDeclarationBorderStrokeValue =>
      borderDesignTokensCollectionTokenValueToKotlinValue(value, options),
    options,
  );
}
