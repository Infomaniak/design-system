import type { TypographyDesignTokensCollectionToken } from '../../../../../../token/types/composite/typography/typography-design-tokens-collection-token.ts';
import type { TypographyDesignTokensCollectionTokenValue } from '../../../../../../token/types/composite/typography/value/typography-design-tokens-collection-token-value.ts';
import type { KotlinVariableDeclaration } from '../../../../kotlin-variable-declaration/kotlin-variable-declaration.ts';
import type { KotlinVariableDeclarationTextStyleValue } from '../../../../kotlin-variable-declaration/value/built-in/text-style/kotlin-variable-declaration-text-style-value.ts';
import {
  designTokensCollectionTokenWithMapValueToKotlinVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-kotlin-variable-declaration.ts';
import {
  typographyDesignTokensCollectionTokenValueToKotlinValue,
  type TypographyDesignTokensCollectionTokenValueToKotlinValueOptions,
} from './value/typography-design-tokens-collection-token-value-to-kotlin-value.ts';

export interface TypographyDesignTokensCollectionTokenToKotlinVariableDeclarationOptions
  extends
    DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions,
    TypographyDesignTokensCollectionTokenValueToKotlinValueOptions {}

export function typographyDesignTokensCollectionTokenToKotlinVariableDeclaration(
  token: TypographyDesignTokensCollectionToken,
  options?: TypographyDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
): KotlinVariableDeclaration {
  return designTokensCollectionTokenWithMapValueToKotlinVariableDeclaration(
    token,
    (value: TypographyDesignTokensCollectionTokenValue): KotlinVariableDeclarationTextStyleValue =>
      typographyDesignTokensCollectionTokenValueToKotlinValue(value, options),
    options,
  );
}
